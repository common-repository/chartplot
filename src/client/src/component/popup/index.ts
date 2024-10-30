/**
 * Chartplot lets you create charts am embed them into your websites. See chartplot.com/wordpress for more information.
 *
 * Copyright 2016-2019 Christoph Rodak <christoph@rodak.li>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
 *
 */
 
import {factory, init, inject} from "../../../../di";
import {array, variable} from "../../../../reactive";
import {Editor} from "../editor";
import {IUnifiedChartEvent} from "../echart/editor/chart/interaction";
import stream from "../../../../reactive/src/event";
import {pointRectangleDistance} from "../../geometry/rectangle";
import {IPoint} from "../../geometry/point";
import {EditorSettings} from "../editor/settings";

const Popper = require("popper.js").default;

export interface IPopupSettings{

    closeOn?: PopupSurface['closeOn'];
    placement?: string;
    sticky?: boolean;
    target: Element;
    content: (surface: PopupSurface) => any;
    priority?: number;
    ignoreChartEvents?: boolean;

}

export interface ITooltipSettings{

    target: Element;
    content: (surface: PopupSurface) => any;
    force?:boolean;
    sticky?: boolean;
    ignoreChartEvents?: boolean;

}

export class PopupStack{

    popups = array<PopupSurface>();

    private getPopupForLayer(layer: number){
        return this.popups.get(layer);
    }

    canAdd(popup: PopupSurface){
        return this.popups.length === popup.layer
            || (this.popups.length > popup.layer && this.getPopupForLayer(popup.layer).priority <= popup.priority);
    }

    addToStack(popup: PopupSurface){
        while(this.popups.length > 0){
            const p = this.popups.get(this.popups.length - 1);
            if (p.layer >= popup.layer){
                p.forceClose();
                this.popups.remove(this.popups.length - 1);
            }
            else{
                break;
            }
        }
        this.popups.push(popup);
    }

    getCurrent(){
        return this.popups.get(this.popups.length - 1);
    }

    remove(popup: PopupSurface){
        var indx = this.popups.values.indexOf(popup);
        if (indx > -1){
            var p = this.popups.values[indx];
            var nrToRemove = this.popups.length - indx - 1;
            for (var i=0; i < nrToRemove; i++){
                this.popups.values.pop();
                this.getCurrent().forceClose();
            }
            this.popups.remove(this.popups.length - 1);
            p.forceClose();
        }
    }

}

export class SinglePopupSystem{

    layer = 0;

    private lastTimeout;
    private lastElement;

    @factory
    private createPopupObject(){
        var s =  new PopupSurface();
        s.layer = this.layer;
        return s;
    }

    @inject
    popupStack: PopupStack;
    private tooltipPopup: PopupSurface;

    createPopup(settings: IPopupSettings){
        const surface = this.createPopupObject();
        surface.target = settings.target;
        surface.child = settings.content(surface);
        surface.sticky = settings.sticky;
        if ("ignoreChartEvents" in settings){
            surface.ignoreChartEvents = settings.ignoreChartEvents;
        }
        if (settings.placement){
            surface.placement = settings.placement;
        }
        if (settings.closeOn){
            surface.closeOn = settings.closeOn;
        }
        if ("priority" in settings){
            surface.priority = settings.priority;
        }
        surface.onClosed.observe(() => {
            if (this.tooltipPopup === surface){
                this.tooltipPopup = null;
            }
        });
        surface.attach();
        return surface;
    }

    registerForTooltip(settings: ITooltipSettings){
        var pop = this.popupStack.getCurrent();
        if (pop && pop.target === settings.target){
            return;
        }
        if (this.lastTimeout){
            clearTimeout(this.lastTimeout);
        }
        if (this.tooltipPopup && this.tooltipPopup.tooltipObserver){
            this.tooltipPopup.tooltipObserver.registerOut();
            this.tooltipPopup = null;
        }
        this.lastTimeout = setTimeout(() => {
            const pp = this.createPopup({
                content: settings.content,
                target: settings.target,
                sticky: settings.sticky,
                ignoreChartEvents: settings.ignoreChartEvents,
                closeOn: "tooltip",
                priority: -1
            });
            this.lastTimeout = null;
            if (pp.added){
                this.tooltipPopup = pp;
            }
        }, 500);
        this.lastElement = settings.target;
    }

    deregisterFromTooltip(target: Element = null){
        if (!target || this.lastElement === target){
            if (this.lastTimeout){
                clearTimeout(this.lastTimeout);
                this.lastTimeout = null;
            }
            else
            {
                if (this.tooltipPopup && this.tooltipPopup.tooltipObserver){
                    this.tooltipPopup.tooltipObserver.registerOut();
                }
            }
        }
    }

}

export class RibbonSinglePopupSystem extends SinglePopupSystem{

    @inject
    editorSettings: EditorSettings;

    registerForTooltip(r){
        if (!r.force && this.editorSettings.options.ribbon.tooltipsEnabled === false){
            return;
        }
        super.registerForTooltip(r);
    }

}

class TooltipCloseObserver{

    movementListener;
    cancelListener;
    private lastDist: IPoint = {
        x: 10000, y: 10000
    };
    outTimeout: any;
    isMouseOver = false;
    closed = false;

    constructor(public surface: PopupSurface){
        this.movementListener = (ev) => {
            const popupRect = this.surface.node.element.getBoundingClientRect();
            const dist = pointRectangleDistance({
                x: ev.clientX, y: ev.clientY
            }, {
                x: popupRect.left, y: popupRect.top, width: popupRect.width, height: popupRect.height
            });
            if (dist.x > (this.lastDist.x + 5)){
                this.surface.close();
                return;
            }
            if (dist.y > (this.lastDist.y + 5)){
                this.surface.close();
                return;
            }
            if (dist.x <= 2 && dist.y <= 2){
                this.isMouseOver = true;
            }
            else
            {
                this.isMouseOver = false;
            }
            this.lastDist = {
                x: Math.min(this.lastDist.x, dist.x),
                y: Math.min(this.lastDist.y, dist.y)
            }

        };
        this.cancelListener = () => {
            this.surface.close();
        }
        document.addEventListener("mousemove", this.movementListener);
        document.addEventListener("click", this.cancelListener);
        document.addEventListener("keydown", this.cancelListener);
        //document.addEventListener("touchmove", this.movementListener);
    }

    close(){
        document.removeEventListener("mousemove", this.movementListener);
        document.removeEventListener("click", this.cancelListener);
        document.removeEventListener("keydown", this.cancelListener);
        //document.removeEventListener("touchmove", this.movementListener);
        this.closed = true;
    }

    registerOut(){
        if (this.outTimeout){
            clearTimeout(this.outTimeout);
        }
        this.outTimeout = setTimeout(() => {
            if (!this.closed){
                if (!this.surface.sticky || !this.isMouseOver){
                    this.surface.popupStack.remove(this.surface);
                }
            }
        },  this.surface.sticky ? 500 : 2);
    }

}

export class DownOutsideEventFirer{

    constructor(public element: HTMLElement, public onClose: () => void){
        this.chartEventListener = (ev) => {
            if (ev.type === "down"){
                this.onClose();
                this.close();
            }
        }
    }

    private eventListener: any;
    private chartEventListener: (ev: IUnifiedChartEvent) => void;

    @inject
    editor: Editor;
    private closed = false;

    @init
    init(){
        this.eventListener = (ev) => {
            var parent = ev.target;
            while(parent){
                if (parent === this.element){
                    return;
                }
                parent = parent.parentElement;
            }
            this.onClose();
            this.close();
        };
        document.addEventListener("click", this.eventListener);
        this.editor.content.chartPreview.unifiedChartInteractionEvents.unifiedEvent.observe(this.chartEventListener);
    }

    close(){
        if (!this.closed){
            document.removeEventListener("click", this.eventListener);
            this.editor.content.chartPreview.unifiedChartInteractionEvents.unifiedEvent.unobserve(this.chartEventListener);
        }
        this.closed = true;
    }


}

export class PopupSurface {

    @inject
    editor: Editor;

    @inject
    popupStack: PopupStack;

    tag = "div";
    attr: any;
    style: any;
    child: any;
    closeOn: "click" | "never" | "down-outside" | "tooltip" = "click";
    popper: any;
    node: any;
    placement: string = "bottom-start";
    target: Element;
    private eventListener: any;
    private keyListener: any;
    private chartEventListener: (ev: IUnifiedChartEvent) => void;
    onClosed = stream<void>();
    public tooltipObserver: TooltipCloseObserver;
    layer; number;
    priority = 0;
    public closed = false;
    public added = false;
    sticky = false;
    ignoreChartEvents = false;

    constructor(){
        this.style = {
            zIndex: 1000000
        }
        this.chartEventListener = (ev) => {
            if (ev.type === "down"){
                this.close();
            }
        }
        this.attr = {
            class: "popup-surface"
        }
    }

    close(){
        if (this.popupStack.getCurrent() !== this){
            return;
        }
        else {
            this.popupStack.remove(this);
        }
    }

    forceClose(){
        if (this.closed){
            return;
        }
        this.editor.shapes.remove(this.editor.shapes.values.indexOf(this));
        this.onClosed.fire(null);
        this.closed = true;
    }

    onDetached(){
        this.popper && this.popper.destroy();
        this.popper = null;
        if (this.closeOn === "click"){
            document.removeEventListener("click", this.eventListener);
        }
        else if (this.closeOn === "down-outside"){
            document.removeEventListener("click", this.eventListener);
        }
        else if (this.closeOn === "tooltip"){
            this.tooltipObserver.close();
        }
        if (!this.ignoreChartEvents){
            this.editor.content && this.editor.content.chartPreview.unifiedChartInteractionEvents.unifiedEvent.unobserve(this.chartEventListener);
        }
    }

    onAttached(){
        this.popper = new Popper(this.target, this.node.element, {
            placement: this.placement,
            removeOnDestroy: true,
            modifiers: {
                preventOverflow: {
                    boundariesElement: 'window'
                }
            }
        });
        switch(this.closeOn){
            case "click":
                this.eventListener = (ev) => {
                    this.close();
                };
                document.addEventListener("click", this.eventListener);
                if (!this.ignoreChartEvents){
                    this.editor.content && this.editor.content.chartPreview.unifiedChartInteractionEvents.unifiedEvent.observe(this.chartEventListener);
                }
                break;
            case "down-outside":
                this.eventListener = (ev) => {
                    var parent = ev.target;
                    while(parent){
                        if (parent === this.node.element){
                            return;
                        }
                        parent = parent.parentElement;
                    }
                    this.close();
                };
                document.addEventListener("click", this.eventListener);
                this.editor.content.chartPreview.unifiedChartInteractionEvents.unifiedEvent.observe(this.chartEventListener);
                break;
            case "tooltip":
                this.tooltipObserver = new TooltipCloseObserver(this);
                if (!this.ignoreChartEvents){
                    this.editor.content && this.editor.content.chartPreview.unifiedChartInteractionEvents.unifiedEvent.observe(this.chartEventListener);
                }
                break;
            default:
                break;
        }
    }

    attach(){
        if (!this.added){
            if (!this.popupStack.canAdd(this)){
                return;
            }
            this.editor.shapes.push(this);
            this.popupStack.addToStack(this);
        }
        this.added = true;
    }

}

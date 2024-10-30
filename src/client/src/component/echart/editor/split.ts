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
 
import {IHtmlNodeShape} from "../../../../../html/src/html/node";
import {procedure, variable} from '../../../../../reactive';
import * as di from "../../../../../di";
import {IStream} from "../../../../../reactive/src/event";
import {ResizeComponents} from "./resize";
import {EditorMenu} from "../../editor/menu";
import {DataRibbonTab} from "../../editor/ribbon/data";
import {inject} from "../../../../../di";
import {Editor} from "../../editor";

declare var Split;

export enum ChartViewMode{
    FULL, SPLIT
}

export class HorizontalSplitComponent{

    tag: "div" = "div";
    attr = {
        class: "editor-split-container"
    }

    node: IHtmlNodeShape;
    style: any;

    lastMode: ChartViewMode = null;
    public r_mode = variable<ChartViewMode>(ChartViewMode.SPLIT);

    get mode(){
        return this.r_mode.value;
    }

    set mode(v){
        this.r_mode.value = v;
    }

    constructor(){
        const self = this;
        this.style = {
            get pointerEvents(){
                if (self.editor.popupStack.popups.length > 0){
                    return "none";
                }
                return "all";
            }
        }
    }

    @di.inject
    resizeComponents: ResizeComponents

    @di.inject
    menu: EditorMenu

    @inject
    editor: Editor;

    public split = 50;
    splitter;
    splitter2;

    public r_main = variable<any>(null);
    public r_bottom = variable<any>(null);
    public r_left = variable<any>(null);

    get left(){
        return this.r_left.value;
    }

    set left(v){
        this.r_left.value = v;
    }

    get bottom(){
        return this.r_bottom.value;
    }

    set bottom(v){
        this.r_bottom.value = v;
    }

    get main(){
        return this.r_main.value;
    }

    set main(v){
        this.r_main.value = v;
    }

    initSplitter(element){
        if (this.mode === ChartViewMode.SPLIT && this.bottom){
            if (!this.splitter){
                this.splitter = Split([element.childNodes[0], element.childNodes[1]], {
                    minSize: 200,
                    gutterSize: 8,
                    snapOffset: 10,
                    direction: "vertical",
                    onDrag: () => {
                        this.resizeComponents.triggerResize();
                    },
                    onDragEnd: () => {
                        this.resizeComponents.triggerResize();
                    }
                });
                this.resizeComponents.triggerResize();
            }
        }
        else
        {
            if (this.splitter){
                this.splitter.destroy();
                this.splitter = null;
                this.resizeComponents.triggerResize();
            }
        }
    }

    initSplitter2(element){
        if (this.mode === ChartViewMode.SPLIT && this.left){
            if (!this.splitter2){
                this.splitter2 = Split([element.childNodes[0], element.childNodes[1]], {
                    minSize: 100,
                    gutterSize: 8,
                    snapOffset: 10,
                    direction: "horizontal",
                    onDrag: () => {
                        this.resizeComponents.triggerResize();
                    },
                    onDragEnd: () => {
                        this.resizeComponents.triggerResize();
                    }
                });
                this.splitter2.setSizes([20, 80]);
                this.resizeComponents.triggerResize();
            }
        }
        else
        {
            if (this.splitter2){
                this.splitter2.destroy();
                this.splitter2 = null;
                this.resizeComponents.triggerResize();
            }
        }
    }

    get child(){
        const self = this;
        const bottomSplit = {
            tag: "div",
            get child() {
                return self.bottom;
            },
            attr: {
                class: "split"
            },
            get style(){
                if (self.mode === ChartViewMode.FULL || !self.bottom){
                    return {
                        position: "fixed",
                        top: "6000px"
                    }
                }
                return {

                }
            }
        };
        const mainSplit = {
            tag: "div",
            get child(){
                return {
                    tag: "div",
                    attr: {
                        class: "main-split"
                    },
                    get child(){
                        var main = {
                            tag: "div",
                            attr: {
                                class: "split split-vertical"
                            },
                            get child(){
                                return self.main;
                            },
                            get style(){
                                if (self.mode === ChartViewMode.FULL || !self.left){
                                    return {
                                        height: "100%",
                                        width: "100%"
                                    }
                                }
                                return {
                                    height: "100%"
                                }
                            }
                        }
                        const leftSplit = {
                            tag: "div",
                            get child() {
                                return {
                                    tag: "div",
                                    attr: {
                                        class: "left-cell"
                                    },
                                    get child() {
                                        return self.left;
                                    }
                                }
                            },
                            attr: {
                                class: "split split-horizontal"
                            },
                            get style(){
                                if (self.mode === ChartViewMode.FULL || !self.left){
                                    return {
                                        position: "fixed",
                                        top: "6000px"
                                    }
                                }
                                return {

                                }
                            }
                        }
                        return [leftSplit, main];
                    },
                    render: function(ctx){
                        if (self.mode !== ChartViewMode.SPLIT || !self.left){
                            self.initSplitter2(this.node.element);
                        }
                        this.node.renderAll();
                        self.initSplitter2(this.node.element);
                    },
                    onDetached: function(){
                        if (this.splitter2){
                            self.splitter2.destroy();
                        }
                        self.splitter2 = null;
                    }
                }
            },
            attr: {
                class: "split"
            },
            get style(){
                if (self.mode === ChartViewMode.FULL || !self.bottom){
                    return {
                        height: "100%"
                    }
                }
                return {

                }
            }
        }
        return  {
            tag: "div",
            attr: {
                class: "editor-split"
            },
            get child(){
                self.mode;
                return [mainSplit, bottomSplit];
            },
            render: function(ctx){
                if (self.mode !== ChartViewMode.SPLIT || !self.bottom){
                    self.initSplitter(this.node.element);
                }
                this.node.renderAll();
                self.initSplitter(this.node.element);
            },
            onDetached: function(){
                if (this.splitter){
                    self.splitter.destroy();
                }
                self.splitter = null;
            }
        }
    }

    @di.init
    init(){
        procedure(() => {
            if (this.mode !== this.lastMode){
                this.lastMode = this.mode;
                this.resizeComponents.triggerResize();
            }
        });
    }

}

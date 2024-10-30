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
 
import {inject} from "../../../../../../di";
import {SinglePopupSystem} from "../../../popup";
import {IHtmlNodeShape} from "../../../../../../html/src/html/node";
import extend from "../../../../../../core/src/extend";

export interface ITooltipHolder{
    tooltip: any;
    node: IHtmlNodeShape;
    stickyTooltip: boolean;
}

export class TooltipManager{

    constructor(public tooltipHolder: ITooltipHolder){

    }

    force = false;

    @inject
    popupSystem: SinglePopupSystem;

    ignoreChartEvents: boolean = false;

    protected registerTooltip(){
        if (this.tooltipHolder.tooltip){
            this.popupSystem.registerForTooltip({
                force: this.force,
                sticky: this.tooltipHolder.stickyTooltip,
                target: <Element>this.tooltipHolder.node.element,
                ignoreChartEvents: this.ignoreChartEvents,
                content: (p) => {
                    return {
                        tag: "div",
                        attr: {
                            class: "tooltip-container"
                        },
                        child: this.tooltipHolder.tooltip
                    }
                }
            });
        }
        else
        {
            this.popupSystem.deregisterFromTooltip();
        }
    }

    protected deregisterTooltip(){
        if (this.tooltipHolder.tooltip){
            this.popupSystem.deregisterFromTooltip(<Element>this.tooltipHolder.node.element);
        }
    }

    initEvents(object){
        extend(object, {
            mouseenter: (ev) => {
                this.registerTooltip();
            },
            mouseleave: (ev) => {
                this.deregisterTooltip();
            }
        });
    }
}

export interface ITooltipBlockSettings{
    title: any;
    content: any;
    footer?: any;
}

export class TooltipBlock{

    tag = "div";

    constructor(public settings: ITooltipBlockSettings){

    }

    get child(){
        const self = this;
        return [{tag: "div", attr:{class: "tooltip-title"}, get child(){
            return self.settings.title || "";
        }}, {
            tag: "div",
            attr: {class: "tooltip-content"},
            get child(){
                return self.settings.content || "";
            }
        },{
            tag: "div",
            attr: {class: "tooltip-footer"},
            get child(){
                return self.settings.footer || "";
            }
        }]
    }

}

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
 
import {ChartPreview} from "./index";
import {init, inject} from "../../../../../../di";
import {Editor} from "../../../editor";
import {EditorSettings} from "../../../editor/settings";

const events = ["touchstart", "touchend", "touchmove", "mousemove", "mousedown", "mouseover", "mouseout", "mouseup", "click"];
const exitEvents = ["touchend", "mouseout"];

export class ChartEventCatcher{

    tag = "div";

    attr: any;
    event: any;
    node: any;

    constructor(){
        this.attr = {
            class: "chart-event-catcher"
        }
    }

    get style(){
        if (this.editorSettings.options.view.modus !== "edit"){
            return {
                position: "absolute",
                left: "10000px"
            }
        }
        return {
        }
    }

    @inject
    chartPreview: ChartPreview;

    @inject
    editor: Editor;

    @inject
    editorSettings: EditorSettings;

    @init
    init(){
        var ev = {};
        var handleEvent = this.handleEvent.bind(this);
        events.forEach(es => {
            ev[es] = {
                handler: (event: MouseEvent) => {
                    const chartRect = this.chartPreview.getShapeDimensions();
                    (<any>event).chartX = event.clientX - chartRect.left;
                    (<any>event).chartY = event.clientY - chartRect.top;
                    handleEvent(event, es);
                },
                useCapture: true
            };
        });
        this.event = ev;
    }

    transformEvents(x: number, y: number){
        const thisRect = this.getBoundingClientRect();
        const chartRect = this.chartPreview.getShapeDimensions();
        return{
            x: x - chartRect.left,
            y: y - chartRect.top
        }
    }

    handleEvent(ev, name){
        if (this.editorSettings.options.view.modus !== "edit"){
            return;
        }
        this.chartPreview.onEvent.fire({
            event: ev,
            name: name
        });
    }

    getBoundingClientRect(){
        return this.node.element.getBoundingClientRect();
    }

}

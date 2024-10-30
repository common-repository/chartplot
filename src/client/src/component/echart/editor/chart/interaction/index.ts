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
 
import {ChartPreview} from "../index";
import * as di from "../../../../../../../di";
import {event, variable} from "../../../../../../../reactive";

export type UnifiedEvent = "down" | "up" | "move" | "out" | "enter";

export interface IUnifiedChartEvent{

    original: UIEvent;
    chartX: number;
    chartY: number;
    clientX: number;
    clientY: number;
    preventDefault();
    stopPropagation();
    type: UnifiedEvent;


}

function mouseToUnified(ev: MouseEvent, type: UnifiedEvent): IUnifiedChartEvent{
    return {
        chartX: (<any>ev).chartX,
        chartY: (<any>ev).chartY,
        clientX: ev.clientX,
        clientY: ev.clientY,
        original: ev,
        preventDefault: () => {
            ev.preventDefault();
        },
        stopPropagation: () => {
            ev.stopPropagation();
        },
        type: type
    }
}

function touchToUnified(ev: TouchEvent, type: UnifiedEvent): IUnifiedChartEvent{
    var touch = ev.touches[0];
    if (!touch){
        var cx = 0;
        var cy = 0;
    }
    else{
        cx = touch.clientX;
        cy = touch.clientY;
    }
    return {
        chartX: cx,
        chartY: cy,
        clientX: touch.clientX,
        clientY: touch.clientY,
        original: ev,
        preventDefault: () => {
            ev.preventDefault();
        },
        stopPropagation: () => {
            ev.stopPropagation();
        },
        type: type
    }
}

export class UnifyingChartInteractionEvents{

    @di.inject
    chartPreview: ChartPreview;


    unifiedEvent: event.IStream<IUnifiedChartEvent> = event();

    public r_lastEvent = variable<IUnifiedChartEvent>(null);

    get lastEvent(){
        return this.r_lastEvent.value;
    }

    set lastEvent(v){
        this.r_lastEvent.value = v;
    }

    fireEvent(ev: IUnifiedChartEvent){
        this.lastEvent = ev;
        this.unifiedEvent.fire(ev);
    }

    @di.init
    init(){
        this.chartPreview.onEvent.observe(ev => {
            switch(ev.name){
                case "mousemove":
                    this.fireEvent(mouseToUnified(<MouseEvent>ev.event, "move"));
                    break;
                case "mousedown":
                    this.fireEvent(mouseToUnified(<MouseEvent>ev.event,"down"));
                    break;
                case "mouseup":
                    this.fireEvent(mouseToUnified(<MouseEvent> ev.event, "up"));
                    break;
                case "mouseout":
                case "mouseleave":
                    this.fireEvent(mouseToUnified(<MouseEvent>ev.event, "out"))
                case "mouseenter":
                case "mouseover":
                    this.fireEvent(mouseToUnified(<MouseEvent> ev.event, "enter"));
            }
        });
    }

}

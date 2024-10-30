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
 
import {inject} from "../../../../../../../di";
import {Editor} from "../../../../editor";
import {IUnifiedChartEvent} from "./index";

export interface ISelectedComponentObserver{

    observe(event: IUnifiedChartEvent): "continue" | "break";

}

export class OrderedElementEvents{

    constructor(){
        this.observe = this.observe.bind(this);
    }

    @inject
    editor: Editor;

    listeners: ISelectedComponentObserver[];

    observe(e: IUnifiedChartEvent){
        for (var i=0; i < this.listeners.length; i++){
            var l = this.listeners[i];
            var r = l.observe(e);
            if (r === "break"){
                return;
            }
        }
    }

    start(){
        this.editor.chartPreview.chartSelection.unifiedChartInteractionEvents.unifiedEvent.observe(this.observe);
    }

    stop(){
        this.editor.chartPreview.chartSelection.unifiedChartInteractionEvents.unifiedEvent.unobserve(this.observe);
    }

}

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
 
import {extend} from "../../../../../../core";
import {DelayedEChartProcessor} from "./delayed";
import {create, define} from "../../../../../../di";

export class EChartProcessor{

    @create(() => new DelayedEChartProcessor())
    delayed: DelayedEChartProcessor;

    chartSettings;

    process(settings){
        this.chartSettings = settings;
        if (settings.series){
            settings.series.forEach((ser, indx) => {
                this.processSeries(ser, indx);
            });
        }
        return settings;
    }

    processSeries(ser, indx: number){
        if (ser.type === "scatter" || ser.type === "effectScatter"){
            ser.tooltip = extend({
                formatter: function (params, ticket, callback) {
                    var data = params.data;
                    if (typeof data === "number"){
                        data = [data];
                    }
                    else if (!Array.isArray(data)){
                        data = data.value;
                    }
                    return `
                    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>
                    ${params.seriesName}: [${data.join(", ")}]`
                }
            }, ser.tooltip);
        }
    }

    start(echart: any){
        this.delayed.start(echart);
    }


}

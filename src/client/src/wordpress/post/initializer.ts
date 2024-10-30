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
 
import {factory, init} from "../../../../di";
import {EChartProcessor} from "../../component/echart/settings/process";
import {define} from "../../../../di/src";

declare var jQuery;
declare var echarts;

export class WordpressPostInitializer {

    @factory
    createProcessor(){
        return new EChartProcessor();
    }

    @define
    echart: any;

    @init
    init(){
        jQuery(() => {
            var charts = (<any>window).chartplot_charts;
            if (charts){
                const createdCharts = [];
                charts.forEach(chart => {
                    if (chart.config){
                        var echart = echarts.init(document.getElementById(chart.id), chart.theme);
                        echart.chartplot_id = chart.chartplot_id;
                        var proc = this.createProcessor();
                        echart.setOption(proc.process(chart.config));
                        createdCharts.push(echart);
                        proc.start(echart);
                    }
                });
                const resizeListener = function(){
                    createdCharts.forEach(chart => {
                        chart.resize();
                    });
                };
                window.addEventListener("resize", resizeListener);
            }
        });
    }

}

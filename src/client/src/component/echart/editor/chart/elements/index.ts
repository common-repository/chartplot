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
 
import rtree, {RTree} from "../../../../../collection2d/rtree";
import {ISelectedComponent} from "./base";
import {indexTitle} from "./title";
import *as di from "../../../../../../../di";
import {indexLegend} from "./legend";
import {indexYAxis} from "./yAxis";
import {indexXAxis} from "./xAxis";
import {indexGrid} from "./grid";
import {ChartComponent} from "./chart";
import {indexSeries} from "./series";
import {inject} from "../../../../../../../di";
import {EChartSettings} from "../../../settings";

const typeToIndexer = {
    title: indexTitle,
    legend: indexLegend,
    yAxis: indexYAxis,
    xAxis: indexXAxis,
    grid: indexGrid,
    series: indexSeries
}

export class EChartComponentIndex{

    public indexTree: RTree;
    public typeToIndexToComponent = {};

    @inject
    settings: EChartSettings;

    public typeToIndexer = typeToIndexer;

    constructor(public echart: any){

    }

    select(x: number, y: number): ISelectedComponent[]{
        var res = <ISelectedComponent[]>this.indexTree.findOverlapping({
            xs: x - 6, ys: y - 6, xe: x + 6, ye: y + 6
        });
        res = res.filter(a => (a.priority > -100)).sort((a,b) => b.priority - a.priority);
        return res;
    }

    indexComponents(chart){
        var zr = chart.getZr();
        const indexed = [];
        zr.storage._roots.forEach(root => {
            if (root.__ecComponentInfo){
                const mainType = root.__ecComponentInfo.mainType;
                const indexer = this.typeToIndexer[mainType];
                if (indexer){
                    var idx = indexer(root);
                    idx.forEach(x => {
                        const comp = this.construct(x);
                        if (comp.init(root)){
                            comp.init(root);
                            indexed.push(comp);
                            this.addComponent(mainType, comp);
                        }
                    });
                }
            }
        });
        let chartc = this.construct(new ChartComponent());
        chartc.init(chart);
        indexed.push(chartc);
        this.addComponent("chart", chartc);
        const rt = rtree();
        indexed.forEach(ix => {
            rt.add(ix);
        });
        return rt;
    }

    @di.factory
    construct(indexer){
        return indexer
    }

    @di.init
    init(){
        this.indexTree = this.indexComponents(this.echart);
    }

    getComponent(type: string, index: number): ISelectedComponent {
        const indexToComponent = this.typeToIndexToComponent[type]
        if (indexToComponent){
            return indexToComponent[index];
        }
        return null;
    }

    private addComponent(type: string, comp: ISelectedComponent){
        let indexToComp = this.typeToIndexToComponent[type];
        if (!indexToComp){
            indexToComp = [];
            this.typeToIndexToComponent[type] = indexToComp;
        }
        indexToComp.push(comp);
    }


}

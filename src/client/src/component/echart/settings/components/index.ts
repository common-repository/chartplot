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
 
import {IEChartSettingsComponent} from "../base";
import {array} from "../../../../../../reactive";
import {factory, inject} from "../../../../../../di";
import {EChartTitleSettings} from "./title";
import {EChartLegendSettings} from "./legend";
import {ChartHistory} from "../../../history";
import {InsertArrayItemCommand} from "../../../history/array";

export interface IComponentSettings extends IEChartSettingsComponent{

    type: string;
    icon: any;

}

export class ComponentCollectionSettings implements IEChartSettingsComponent{

    components = array<IComponentSettings>();

    @inject
    history: ChartHistory;

    createConfig(){
        return this.components.values.map(c => c.createConfig());
    }

    applyConfig(c){
        this.components.clear();
        c.forEach(comp => {
            const com = this.createComponent(comp);
            com.applyConfig(comp);
            this.components.push(com);
        });
    }

    createEChartConfig(){
        var res: any = {};
        this.components.forEach(comp => {
            let arr = res[comp.type];
            if (!arr){
                arr = [];
                res[comp.type] = arr;
            }
            arr.push(comp.createEChartConfig());
        });
        return res;
    }

    insertComponent(c: any, index: number){
        const comp = this.createComponent(c);
        var indx = Math.max(0, Math.min(this.components.length, index));
        this.history.executeCommand(new InsertArrayItemCommand(this.components, comp, indx));
        return indx;
    }

    @factory
    createComponent(c: any): IComponentSettings{
        switch(c.type){
            case "title":
                var title = new EChartTitleSettings();
                title.applyConfig(c);
                return title;
            case "legend":
                var legend = new EChartLegendSettings();
                legend.applyConfig(c);
                return legend;
        }
    }

    getTitleAtIndex(index: number): EChartTitleSettings{
        return <EChartTitleSettings>this.components.values.filter(c => c.type === "title")[index];
    }

    getLegendAtIndex(index: number): EChartTitleSettings{
        return <EChartTitleSettings>this.components.values.filter(c => c.type === "legend")[index];
    }

    getRelativeIndexForComponent(component: IComponentSettings): number {
        var indx = 0;
        const comps = this.components.values;
        for (var i=0; i < comps.length; i++){
            const c = comps[i];
            if (c === component){
                return indx;
            }
            if (c.type === component.type){
                indx++;
            }
        }
        return -1;
    }

}

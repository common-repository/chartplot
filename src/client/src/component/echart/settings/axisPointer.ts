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
 
import {ConfigBuilder} from "./util";
import {variable} from "../../../../../reactive";
import {IEChartSettingsComponent} from "./base";
import {removeEmptyProperties} from "../../../../../core/src/object";

export class ChartAxisPointerSettings implements IEChartSettingsComponent{

    builder = new ConfigBuilder();

    public r_linkXAxes = variable<boolean>(null);
    public r_linkYAxes = variable<boolean>(null);

    get linkYAxes(){
        return this.r_linkYAxes.value;
    }

    set linkYAxes(v){
        this.r_linkYAxes.value = v;
    }

    get linkXAxes(){
        return this.r_linkXAxes.value;
    }

    set linkXAxes(v){
        this.r_linkXAxes.value = v;
    }

    constructor(){
        this.builder.value("linkXAxes", this.r_linkXAxes);
        this.builder.value("linkYAxes", this.r_linkYAxes);
    }


    createEChartConfig(){
        return removeEmptyProperties({
            link: removeEmptyProperties({
                xAxisIndex: this.linkXAxes ? "all" : null,
                yAxisIndex: this.linkYAxes ? "all" : null
            })
        });
    }

    createConfig(){
        return this.builder.createConfig({});
    }

    applyConfig(c){
        this.builder.applyConfig(c);
    }

}

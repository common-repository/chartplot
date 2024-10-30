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
 
import {variable} from "../../../../../../reactive";
import {IChartSettingsComponent} from "../../../echart/settings/base";
import {removeEmptyProperties} from "../../../../../../core/src/object";

export class DataOptionSettings implements IChartSettingsComponent{

    public r_view = variable<"" | "single">("");

    get view(){
        return this.r_view.value;
    }

    set view(v){
        this.r_view.value = v;
    }

    public r_seriesType = variable<string>("bar");

    get seriesType(){
        return this.r_seriesType.value;
    }

    set seriesType(v){
        this.r_seriesType.value = v;
    }

    public r_manageSeries = variable(true);

    get manageSeries(){
        return this.r_manageSeries.value;
    }

    set manageSeries(v){
        this.r_manageSeries.value = v;
    }

    createConfig(): any{
        return removeEmptyProperties({
            view: this.view,
            seriesType: this.seriesType,
            manageSeries: this.manageSeries
        });
    }

    applyConfig(config: any){
        this.view = config.view || "";
        this.seriesType = config.seriesType || "bar";
        if ("manageSeries" in config){
            this.manageSeries = config.manageSeries;
        }
        else
        {
            this.manageSeries = true;
        }
    }


}

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
import {ConfigBuilder} from "../../../echart/settings/util";

export class RibbonOptions implements IChartSettingsComponent{

    static CHART_RIBBON_INDEX = 0;
    static COMPONENT_RIBBON_INDEX = 3;
    static COORDINATE_RIBBON_INDEX = 2;
    static SERIES_RIBBON_INDEX = 1;
    static DATA_RIBBON_INDEX = 5;
    static SERIES_DATA_RIBBON_INDEX = 5;
    static SERIES_LABEL_RIBBON_INDEX = 6;
    static COORDINATE_AXES = 5;

    builder = new ConfigBuilder();

    constructor(){
        this.builder.value("tooltipsEnabled", this.r_tooltipsEnabled);
    }

    public r_selectedTab = variable<number | number[]>(0);

    public r_tooltipsEnabled = variable(null);

    get tooltipsEnabled(){
        return this.r_tooltipsEnabled.value;
    }

    set tooltipsEnabled(v){
        this.r_tooltipsEnabled.value = v;
    }

    get selectedTab(){
        return this.r_selectedTab.value;
    }

    set selectedTab(v){
        this.r_selectedTab.value = v;
    }

    get highlightedTabs(){
        var sel = this.selectedTab;
        if (Array.isArray(sel)){
            return sel.slice(0, sel.length - 1);
        }
        return [];
    }

    createConfig(){
        var r = removeEmptyProperties({
            selectedTab: this.selectedTab
        });
        return this.builder.createConfig(r);
    }

    applyConfig(c){
        if ("selectedTab" in c){
            this.selectedTab = c.selectedTab;
        }
        else
        {
            this.selectedTab = 0;
        }
        this.builder.applyConfig(c);
        if (!('tooltipsEnabled' in c)){
            this.tooltipsEnabled = (<any>window).chartplot_settings.show_tooltips != "";
        }
    }

}

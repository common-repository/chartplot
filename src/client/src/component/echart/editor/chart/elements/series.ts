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
 
import {AbstractSelectedComponent, createStandardIndexer} from "./base";
import {Editor} from "../../../../editor";
import * as di from "../../../../../../../di";
import {EditorSettings} from "../../../../editor/settings";
import {EChartSettings} from "../../../settings";
import {RibbonOptions} from "../../../../editor/settings/options/ribbon";
import {EChartSeriesSettings} from "../../../settings/series";

export class SeriesComponent extends AbstractSelectedComponent{

    constructor(){
        super();
    }

    private selectedRealIndex: number;

    priority = 2;

    @di.inject
    settings: EChartSettings;

    @di.inject
    editorSettings: EditorSettings;

    @di.inject
    editor: Editor;

    seriesSettings: EChartSeriesSettings;

    getModel(model: EChartSettings){
        return model;
    }

    activate() {
        this.editorSettings.options.ribbon.selectedTab = RibbonOptions.SERIES_RIBBON_INDEX;
        this.editorSettings.options.series.selected = this.selectedRealIndex;
        this.editorSettings.options.chart.editMode = "series";
    }

    init(component){
        var index = component.__ecComponentInfo.index;
        var sers = this.settings.series.seriesCollection.values;
        var ri = 0;
        var firstArea = true;
        for (var i=0; i < sers.length; i++){
            var s = sers[i];
            if(!s.isValid()){
                continue;
            }
            if (s.type === "area_interval" && firstArea){
                if (ri === index){
                    return false;
                }
                else {
                    ri++;
                    i--;
                    firstArea = false;
                    continue;
                }
            }
            firstArea = true;
            if (ri === index){
                this.selectedRealIndex = i;
                break;
            }
            ri++;
        }
        this.seriesSettings = s;
        return super.init(component);
    }

}

export const indexSeries = createStandardIndexer(() => new SeriesComponent());

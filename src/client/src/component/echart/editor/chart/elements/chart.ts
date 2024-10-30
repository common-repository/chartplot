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
 
import {AbstractSelectedComponent} from "./base";
import * as di from "../../../../../../../di";
import {EChartSettings} from "../../../settings";
import {RibbonOptions} from "../../../../editor/settings/options/ribbon";
import {EditorSettings} from "../../../../editor/settings";

export class ChartComponent extends AbstractSelectedComponent {

    priority = -100;

    @di.inject
    editorSettings: EditorSettings

    @di.inject
    settings: EChartSettings;

    getModel(model: EChartSettings){
        return model;
    }

    activate() {
        this.editorSettings.options.ribbon.selectedTab = RibbonOptions.CHART_RIBBON_INDEX;
        this.editorSettings.options.chart.editMode = "chart";
    }

    init(component){
        this.xs = 0;
        this.ys = 0;
        this.xe = component.getWidth();
        this.ye = component.getHeight();
        this.component = component;
        return true;
    }

}

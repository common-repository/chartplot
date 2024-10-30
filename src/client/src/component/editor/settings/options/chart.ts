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
import {inject} from "../../../../../../di";
import {EditorSettings} from "../index";
import {Ribbon} from "../../ribbon";
import {GridSettings} from "../../../echart/settings/coordinates/grid";
import {ConfigBuilder} from "../../../echart/settings/util";

export interface IFocusableElement {
    activateFocus(ribbon: Ribbon);
    deactivateFocus?(ribbon: Ribbon);
}

export class ChartOptionSettings implements IChartSettingsComponent{

    @inject
    editorSettings: EditorSettings;

    builder = new ConfigBuilder();

    constructor(){
        this.builder.value("theme", this.r_theme);
    }

    public r_theme = variable(null);

    get theme(){
        return this.r_theme.value;
    }

    set theme(v){
        this.r_theme.value = v;
    }

    public r_editMode = variable<"series" | "component" | "coordinate" | "axis" | "chart">(null);

    get editMode(){
        return this.r_editMode.value;
    }

    set editMode(v){
        this.r_editMode.value = v;
    }

    applyConfig(c){
        this.editMode = c.editMode || null;
        this.builder.applyConfig(c);
    }

    createConfig(){
        return this.builder.createConfig(removeEmptyProperties({
            editMode: this.editMode
        }));
    }

    getFocusedElements(): IFocusableElement[] {
        if (!this.editMode){
            return [];
        }
        switch(this.editMode){
            case "series":
                return [this.editorSettings.chart.series.seriesCollection.get(this.editorSettings.options.series.selected)];
            case "coordinate":
                let coord = this.editorSettings.chart.coordinates.coordinates.get(this.editorSettings.options.coordinates.selected);
                return [coord];
            case "axis":
                coord = this.editorSettings.chart.coordinates.coordinates.get(this.editorSettings.options.coordinates.selected);
                return [coord, (<GridSettings>coord).axes.axes.get(this.editorSettings.options.coordinates.axes.selected)];
            case "chart":
                return [this.editorSettings.chart];
        }
        return [];
    }

}


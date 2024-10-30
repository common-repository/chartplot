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
 
import {BigRibbonSelectButton, RibbonSelectButton} from "../blocks/index";
import {getIconShape, IconSet} from "../../../icon/index";
import {RibbonContentSection} from "../base";
import {create, inject} from "../../../../../../di/index";
import {IconLabelSelectListItem, SelectList} from "../../../list/select";
import {EChartSettings} from "../../../echart/settings/index";
import {ChartHistory} from "../../../history/index";
import {ValueHistory} from "../../../history/value";
import {EditorSettings} from "../../settings";
import {CheckboxInput} from "../blocks/checkbox";
import {TripleSurface} from "../blocks/surface";
import {SeriesTypeSelect} from "../series/general";

export function getIconForSeriesType(type: string){
    switch(type){
        case "":
        case "bar":
            return getIconShape(IconSet.bar_chart);
        case "line":
            return getIconShape(IconSet.line_chart);
        case "area":
            return getIconShape(IconSet.area_chart);
        case "pie":
            return getIconShape(IconSet.pie_chart);
        case "scatter":
            return getIconShape(IconSet.scatter_chart);
        case "effectScatter":
            return getIconShape(IconSet.scatter_chart);
        case "candlestick":
            return getIconShape(IconSet.chart_candlestick);
        case "area_interval":
            return getIconShape(IconSet.chart_area);
        default:
            return getIconShape(IconSet.square2);
    }
}

export function getLabelForSeriesType(type: string){
    switch(type){
        case "":
        case "bar":
            return "Bar";
        case "line":
            return "Line";
        case "area":
            return "Area";
        case "pie":
            return "Pie";
        case "scatter":
            return "Scatter";
        case "effectScatter":
            return "Effect Scatter";
        case "candlestick":
            return "Candlestick";
        case "area_interval":
            return "Area interval";
        default:
            return "Unknown";
    }
}

export class TypeSelect extends RibbonSelectButton{

    get label(){
        return getLabelForSeriesType(this.editorSettings.options.data.seriesType || "bar");
    }

    get icon(){
        return getIconForSeriesType(this.editorSettings.options.data.seriesType);
    }

    @inject
    editorSettings: EditorSettings;

    @inject
    settings: EChartSettings

    @inject
    history: ChartHistory

    set type(type: string){
        this.history.executeCommand(new ValueHistory(this.editorSettings.options.data.r_seriesType, type));
    }

    tooltip = "The type of the series to create when a new column is added."

}

TypeSelect.prototype.getContent = SeriesTypeSelect.prototype.getContent;

class ManageSeriesCheckbox extends CheckboxInput{

    @inject
    editorSettings: EditorSettings;

    get value(){
        return this.editorSettings.options.data.manageSeries;
    }

    set value(v){
        this.editorSettings.options.data.manageSeries = v;
    }

    tooltip = "If enabled, will automatically create a new series for newly added columns. When you delete a column, all series using this column as data will be deleted.";

    label = "enabled"

}

class SeriesManagement extends TripleSurface{

    @create(() => new TypeSelect())
    type: TypeSelect;

    @create(() => new ManageSeriesCheckbox())
    enabled: ManageSeriesCheckbox;

    get middle(){
        return this.type;
    }

    get top(){
        return this.enabled;
    }

}

export class DataSeriesTypeSection extends RibbonContentSection{


    @create(() => new SeriesManagement())
    series: SeriesManagement

    label = "manage series"

    get contents(){
        return [this.series];
    }

}

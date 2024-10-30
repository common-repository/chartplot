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
 
import {RibbonContentSection} from "../../base";
import {BigRibbonSelectButton} from "../../blocks";
import {IconLabelSelectListItem, SelectList} from "../../../../list/select";
import {create, init, inject} from "../../../../../../../di";
import {getIconForSeriesType, getLabelForSeriesType} from "../../data/type";
import {getIconShape, IconSet} from "../../../../icon";
import {ChartHistory} from "../../../../history";
import {ValueHistory} from "../../../../history/value";
import {TripleSurface} from "../../blocks/surface";
import {TextInput} from "../../blocks/input";
import {EChartSeriesSettings} from "../../../../echart/settings/series";
import {CheckboxInput} from "../../blocks/checkbox";
import {TooltipBlock} from "../../blocks/tooltip";

export class GeneralSettingsSection extends RibbonContentSection{

    label = "general";

    @create(() => new SeriesTypeSelect())
    type: SeriesTypeSelect;

    @create(() => new SeriesNameTriple())
    nameTriple: SeriesNameTriple;

    get contents(){
        return [this.type, this.nameTriple];
    }

}

export class SeriesTypeSelect extends BigRibbonSelectButton{

    get label(){
        const ser = this.selectedSeries;
        return getLabelForSeriesType(ser.getType());
    }

    get icon(){
        return getIconForSeriesType(this.selectedSeries.getType());
    }

    @inject
    selectedSeries: EChartSeriesSettings;

    @inject
    history: ChartHistory

    set type(type: string){
        const ser = this.selectedSeries;
        if (type === "candlestick" && ser.dataSourceType === "chart"){
            ser.dataSourceType = "table";
        }
        this.history.executeCommand(new ValueHistory(ser.r_type, type));
    }

    getContent(){
        const dropwdown = new SelectList();
        dropwdown.items.push(new IconLabelSelectListItem("Bar",getIconShape(IconSet.bar_chart)).setAction(ev => this.type = "bar"));
        dropwdown.items.push(new IconLabelSelectListItem("Line",getIconShape(IconSet.line_chart)).setAction(ev => this.type = "line"));
        dropwdown.items.push(new IconLabelSelectListItem("Area",getIconShape(IconSet.area_chart)).setAction(ev => this.type = "area"));
        dropwdown.items.push(new IconLabelSelectListItem("Pie",getIconShape(IconSet.pie_chart)).setAction(ev => this.type = "pie"));
        dropwdown.items.push(new IconLabelSelectListItem("Scatter",getIconShape(IconSet.scatter_chart)).setAction(ev => this.type = "scatter"));
        dropwdown.items.push(new IconLabelSelectListItem("Effect Scatter",getIconShape(IconSet.scatter_chart)).setAction(ev => this.type = "effectScatter"));
        dropwdown.items.push(new IconLabelSelectListItem("Candlestick",getIconShape(IconSet.chart_candlestick)).setAction(ev => this.type = "candlestick"));
        dropwdown.items.push(new IconLabelSelectListItem("Area interval",getIconShape(IconSet.chart_area)).setAction(ev => this.type = "area_interval"));
        return dropwdown;
    }

    prependTooltip = '';

    @init
    init(){
        super.init();
        this.tooltip = new TooltipBlock({title: "Series type", content: {
                tag: 'html',
                child: `${this.prependTooltip} 
The series type determines how your data will be rendered. Note that different types accept different kinds of data.
`
            }})
    }

}

export class SeriesName extends TextInput{

    label = "name";

    @inject
    selectedSeries: EChartSeriesSettings;

    @inject
    history: ChartHistory;

    get disabled(){
        return false;
    }

    get value(){
        const selected = this.selectedSeries;
        return selected.name;
    }

    set value(v){
        this.history.executeCommand(new ValueHistory(this.selectedSeries.r_name, v));
    }

    tooltip = new TooltipBlock({title: "Series name", content: {tag: "html", child: `
<p>The name of the series. Is shown in different chart components, like the legend or tooltip.</p>
<p>If left empty and the chart is using the chart table as its data source, the name of the series will be determined by the column name.</p>
    `}})

}

class SeriesSmooth extends CheckboxInput{

    label = "smooth";

    @inject
    selectedSeries: EChartSeriesSettings;

    @inject
    history: ChartHistory;

    changeValue(v){
        if (this.selectedSeries.smooth !== v){
            this.history.executeCommand(new ValueHistory(this.selectedSeries.r_smooth, v));
        }
    }

    get value(){
        return this.selectedSeries.smooth || false;
    }

    set value(v){
        this.selectedSeries.smooth = v;
    }

}

class SeriesStep extends CheckboxInput{

    label = "step";

    @inject
    selectedSeries: EChartSeriesSettings;

    @inject
    history: ChartHistory;

    changeValue(v){
        if (this.selectedSeries.step !== v){
            this.history.executeCommand(new ValueHistory(this.selectedSeries.r_step, v));
        }
    }

    get value(){
        return this.selectedSeries.step || false;
    }

    set value(v){
        this.selectedSeries.step = v;
    }

}

var lineType = {
    line: true, area: true, area_interval: true
}

export class SeriesNameTriple extends TripleSurface {

    @inject
    selectedSeries: EChartSeriesSettings;

    @create(() => new SeriesName())
    name: SeriesName;

    @create(() => new SeriesSmooth())
    smooth: SeriesSmooth;

    @create(() => new SeriesStep())
    step: SeriesStep;

    get middle(){
        if (this.selectedSeries.getType() in lineType){
            return this.smooth;
        }
        return null;
    }

    get bottom(){
        if (this.selectedSeries.getType() in lineType){
            return this.step;
        }
        return null;
    }

    @init
    init(){
        this.name.label = "name";
        this.top = this.name;
    }

}

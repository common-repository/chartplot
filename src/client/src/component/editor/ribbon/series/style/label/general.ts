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
 
import {HistoryCheckboxInput} from "../../../blocks/checkbox";
import {create, init, inject} from "../../../../../../../../di/index";
import {EChartSeriesSettings} from "../../../../../echart/settings/series/index";
import {HistoryRibbonSelectList} from "../../../blocks/index";
import {TripleSurface} from "../../../blocks/surface";
import {ChartHistory} from "../../../../../history/index";
import {SeriesLabelSettings} from "../../../../../echart/settings/series/label";
import {TooltipBlock} from "../../../blocks/tooltip";

export class SeriesGeneralLabelTriple extends TripleSurface{

    constructor(public labelSettings: SeriesLabelSettings){
        super();
    }

    isSeriesSettings = true;

    @create(function(this: SeriesGeneralLabelTriple){return new ShowCheckbox(this.labelSettings)})
    show: ShowCheckbox;

    @create(function(this: SeriesGeneralLabelTriple){return new PositionSelect(this.labelSettings)})
    position: PositionSelect;

    @create(() => new AvoidOverlap())
    avoidOverlap: AvoidOverlap;

    @inject
    series: EChartSeriesSettings;

    get middle(){
        return this.position;
    }

    get top(){
        return this.show;
    }

    get bottom(){
        if (this.isSeriesSettings && this.series.type === "pie"){
            return this.avoidOverlap;
        }
        return null;
    }

}

class ShowCheckbox extends HistoryCheckboxInput{

    constructor(public labelSettings: SeriesLabelSettings){
        super();
        this.r_value = this.labelSettings.r_show;
    }

    @inject
    series: EChartSeriesSettings

    label = "Show"

    get default(){
        return this.getDefault();
    }

    set default(v){

    }

    getDefault(){
        switch(this.series.type){
            case "pie":
                return true;
            default:
                return false;
        }
    }


    tooltip = new TooltipBlock({content: {
        tag: "html",
        child: `
<p>
Whether to render a label for the series data.
</p>
        `
    },
        title: "Show series label"

})
}

class AvoidOverlap extends HistoryCheckboxInput{

    @inject
    series: EChartSeriesSettings

    @inject
    history: ChartHistory

    get label(){
        return "avoid overlap";
    }

    @init
    init(){
        super.init();
        this.default = true;
        this.r_value = this.series.r_avoidLabelOverlap;
    }

    tooltip = new TooltipBlock({title: "Avoid label overlap", content: {
            tag: "html",
            child: `
<p>
If label overlaps should be avoided.
</p>
        `
        }})

}

class PositionSelect extends HistoryRibbonSelectList{

    constructor(public labelSettings: SeriesLabelSettings){
        super();
        this.r_value = this.labelSettings.r_position;
    }

    @inject
    series: EChartSeriesSettings;

    @inject
    history: ChartHistory;

    default = null;

    items = [{label: "Default position", value: null},
        {label: "Top", value: "top"},
        {label: "Left", value: "left"},
        {label: "Right", value: "right"},
        {label: "Bottom", value: "bottom"},
        {label: "Inside", value: "inside"},
        {label: "Inside Left", value: "insideLeft"},
        {label: "Inside Right", value: "insideRight"},
        {label: "Inside Top", value: "insideTop"},
        {label: "Inside Bottom", value: "insideBottom"},
        {label: "Inside Top Left", value: "insideTopLeft"},
        {label: "Inside Bottom Left", value: "insideBottomLeft"},
        {label: "Inside Top Right", value: "insideTopRight"},
        {label: "Inside Bottom Right", value: "insideBottomRight"}];

    tooltip = new TooltipBlock({title: "Label position", content:  {
            tag: "html",
            child: `
<p>
Position of the label relative to rendered data item.
</p>
        `
        }});

}

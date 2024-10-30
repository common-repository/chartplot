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
import {TripleSurface} from "../../blocks/surface";
import {create, init, inject} from "../../../../../../../di";
import {EChartSeriesSettings} from "../../../../echart/settings/series";
import {BackgroundColorButton} from "../../blocks/style/text";
import {HistoryNumberInput} from "../../blocks/input";
import {HistoryRibbonSelectList, ILabelAndIcon} from "../../blocks";
import {ExpandedSettings} from "../../blocks/expand/settings";
import {HistoryCheckboxInput} from "../../blocks/checkbox";
import {TooltipBlock} from "../../blocks/tooltip";
import {OpacityInput} from "../../blocks/style/opacity";

export class SeriesLineStyleSection extends RibbonContentSection{

    label = "line";


    @create(() => new SeriesStyleTriple())
    triple: SeriesStyleTriple;

    get contents(){
        return [this.triple];
    }

    @create(() => new SeriesExpandSettings())
    expand: SeriesExpandSettings;

}

class SeriesStyleTriple extends TripleSurface{

    @inject
    series: EChartSeriesSettings;

    @create(function(this: SeriesStyleTriple){
        var res = new BackgroundColorButton(this.series.lineStyle.r_color);
        res.colorInputLabel = "Line color";
        res.labelPrefix = "Color of the line";
        return res;
    })
    color: BackgroundColorButton;

    @create(function(this: SeriesStyleTriple){
        var res = new HistoryNumberInput();
        res.r_value = this.series.lineStyle.r_width;
        res.label = "width";
        res.default = 2;
        res.min = 0;
        res.isSmall = true;
        res.tooltip = new TooltipBlock({title: "Line width", content: "The width of the line"});
        return res;
    })
    width: HistoryNumberInput;

    @create(function(this: SeriesStyleTriple){
        var res = new HistoryRibbonSelectList();
        res.items = [{value: "solid"}, {value: "dashed"}, {value: "dotted"}];
        res.r_value = this.series.lineStyle.r_type;
        res.default = "solid";
        res.tooltip = new TooltipBlock({title: "Line style", content: "The style of the line"});
        return res;

    })
    type: HistoryRibbonSelectList;

    @create(function(this: SeriesStyleTriple){
        var res = new HistoryCheckboxInput();
        res.r_value = this.series.lineStyle.r_show;
        res.label = "Show";
        res.default = true;
        res.tooltip = new TooltipBlock({title: "Show line", content: "Whether to render the line"});
        return res;
    })
    show: HistoryCheckboxInput;


    get top(){
        return [this.type];
    }

    get middle(){
        var res: any[] = [this.color];
        if (this.series.type === "area"){
            res.push(this.show);
        }
        return res;
    }

    get bottom(){
        return [this.width];
    }

}

class SeriesExpandSettings extends ExpandedSettings{

    @inject
    series: EChartSeriesSettings;

    @create(function(this: SeriesExpandSettings){
        var res = new OpacityInput();
        res.itemName = "Line";
        res.r_value = this.series.lineStyle.r_opacity;
        return res;
    })
    opacity: HistoryNumberInput;

    @init
    init(){
        this.section("General").row().item(this.opacity);
    }

}

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
 
import {EChartSeriesSettings} from "../../../../echart/settings/series";
import {create, inject} from "../../../../../../../di";
import {TripleSurface} from "../../blocks/surface";
import {HistoryRibbonSelectList} from "../../blocks";
import {HistoryNumberInput} from "../../blocks/input";
import {BackgroundColorButton} from "../../blocks/style/text";
import {RibbonContentSection} from "../../base";
import {TooltipBlock} from "../../blocks/tooltip";
import {OpacityInput} from "../../blocks/style/opacity";

export class SeriesAreaStyleSection extends RibbonContentSection{

    @create(() => new SeriesAreaStyleTriple())
    triple: SeriesAreaStyleTriple;

    get contents(){
        return [this.triple];
    }

    label = "area";

}

class SeriesAreaStyleTriple extends TripleSurface{

    @inject
    series: EChartSeriesSettings;

    @create(function(this: SeriesAreaStyleTriple){
        var res = new BackgroundColorButton(this.series.areaStyle.r_color);
        res.colorInputLabel = "Area color";
        res.labelPrefix = "Color of the area";
        return res;
    })
    color: BackgroundColorButton;

    @create(function(this: SeriesAreaStyleTriple){
        var res = new HistoryRibbonSelectList();
        res.default = "auto";
        res.r_value = this.series.areaStyle.r_origin;
        res.items = [{value: "auto", label: ["Origin: ",{tag: "b", child: "Auto"}]},
            {value: "start", label: ["Origin: ",{tag: "b", child: "Start"}]},
            {value: "end", label: ["Origin: ",{tag: "b", child: "End"}]}];
        res.tooltip = new TooltipBlock({title: "Area origin", content: {
            tag: "html",
            child: `
Determines between which axis line the area will be filled.
<ul class="bullet">
<li><b>Auto: </b>Determined automatically</li>
<li><b>Start: </b>Use the axis line with the minimal value</li>
<li><b>End: </b>Use the axis line with the maximal value</li>
</ul>
            `
            }})
        return res;
    })
    origin: HistoryRibbonSelectList;

    @create(function(this: SeriesAreaStyleTriple){
        var res = new OpacityInput();
        res.itemName = "Area";
        res.r_value = this.series.areaStyle.r_opacity;
        return res;
    })
    opacity: HistoryNumberInput;

    get top(){
        return [this.color];
    }

    get middle(){
        return this.opacity;
    }

    get bottom(){
        if (this.series.getType() === "area"){
            return [this.origin];
        }
        return null;
    }

}

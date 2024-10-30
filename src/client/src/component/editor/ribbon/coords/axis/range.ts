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
 
import {NumberInput} from "../../blocks/input";
import {create, inject} from "../../../../../../../di";
import {GridAxis} from "../../../../echart/settings/coordinates/grid/axis";
import {TripleSurface} from "../../blocks/surface";
import {RibbonContentSection} from "../../base";
import {ChartHistory} from "../../../../history";
import {ValueHistory} from "../../../../history/value";
import {TooltipBlock} from "../../blocks/tooltip";
import {HistoryCheckboxInput} from "../../blocks/checkbox";

export class AxisRangeSection extends RibbonContentSection{

    label = "range"

    @create(() => new RangeTriple())
    range: RangeTriple;

    get contents(){
        return [this.range];
    }

    tooltip = new TooltipBlock({title: "Axis range", content: `
    The value range the axis will show.
    `})

}

class RangeTriple extends TripleSurface {

    @inject
    selectedAxis: GridAxis;

    @create(function(){
        var r = new HistoryCheckboxInput();
        r.default = true;
        r.r_value = this.selectedAxis.r_scale;
        r.label = "With zero";
        r.tooltip = new TooltipBlock({title: "Range with zero", content: `
        Whether to include the value 0 in the range of this axis.
        `});
        return r;
    })
    zero: HistoryCheckboxInput;

    @create(() => new MinInput())
    min: MinInput;

    @create(() => new MaxInput())
    max: MaxInput;

    get top(){
        if (this.selectedAxis.type === "value"){
            return this.zero;
        }
        return null;
    }

    get middle(){
        return this.min;
    }

    get bottom(){
        return this.max;
    }

}

class MinInput extends NumberInput{

    @inject
    selectedAxis: GridAxis;

    @inject
    history: ChartHistory;

    label = "min";

    changeValue(v){
        if (this.value !== v){
            this.history.executeCommand(new ValueHistory(this.selectedAxis.r_min, v));
        }
    }

    get value(){
        return this.selectedAxis.min;
    }

    set value(v){
        this.selectedAxis.min = v;
    }

    tooltip = new TooltipBlock({title: 'Min axis value', content: {tag: "html", child: `
    <p>
   The minimal value of the axis. If not set, will be automatically determined.
   </p>
   For categorical axes, you can set an ordinal number representing a category.
   For example, if a catergory axis has data: ['categoryA', 'categoryB', 'categoryC'], and the ordinal 2 represents 'categoryC'
    `}})

}

class MaxInput extends NumberInput{

    @inject
    selectedAxis: GridAxis;

    @inject
    history: ChartHistory;

    label = "max";

    changeValue(v){
        if (this.value !== v){
            this.history.executeCommand(new ValueHistory(this.selectedAxis.r_max, v));
        }
    }

    get value(){
        return this.selectedAxis.max;
    }

    set value(v){
        this.selectedAxis.max = v;
    }

    tooltip = new TooltipBlock({title: 'Min axis value', content: {tag: "html", child: `
    <p>
   The maximal value of the axis. If not set, will be automatically determined.
   </p>
   For categorical axes, you can set an ordinal number representing a category.
   For example, if a catergory axis has data: ['categoryA', 'categoryB', 'categoryC'], and the ordinal 2 represents 'categoryC'
    `}})

}

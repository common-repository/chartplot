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
 
import {HistoryRibbonSelectList} from "../../blocks";
import {create, define, init, inject} from "../../../../../../../di";
import {EChartSeriesSettings} from "../../../../echart/settings/series";
import {RibbonContentSection} from "../../base";
import {TripleSurface} from "../../blocks/surface";
import {HistoryNumberInput} from "../../blocks/input";
import {HistoryCheckboxInput} from "../../blocks/checkbox";
import {ExpandedSettings} from "../../blocks/expand/settings";
import {BorderColorButton, BorderType} from "../../blocks/style/border";
import {LabelLineSettings} from "../../../../echart/settings/series/labelLine";
import {TooltipBlock} from "../../blocks/tooltip";
import {OpacityInput} from "../../blocks/style/opacity";

export class RoseTypeSelect extends HistoryRibbonSelectList{

    @inject
    series: EChartSeriesSettings;

    @init
    init(){
        this.default = null;
        super.init();
        this.r_value = this.series.r_roseType;
        this.items = [{
            value: null,
            label: "Normal pie"
        },{
            value: "radius",
            label: "Rose radius"
        },{
            value: "area",
            label: "Rose area"
        }];
        this.tooltip = new TooltipBlock({title: "Rose type", content: {
            tag: "html",
            child: `
            How to render the pie chart.
            <ul class="bullet">
            <li><b>Normal pie: </b>Render the pie chart normally. </li>
            <li><b>Rose radius: </b>Render as a Nightingale chart. Use central angle to show the percentage of data, radius to show data size </li>
            <li><b>Rose area: </b>Render as a Nightingale chart. All the sectors will share the same central angle, the data size is shown only through radiuses. </li>
            </ul>
            `
            }})
    }

}

export class PieSeriesAngleSection extends RibbonContentSection{

    label = "angle";

    @create(() => new PieSeriesAngleTriple())
    triple: PieSeriesAngleTriple;

    get contents(){
        return [this.triple];
    }

}

class PieSeriesAngleTriple extends TripleSurface{

    @inject
    series: EChartSeriesSettings;

    @create(function(this: PieSeriesAngleTriple){
        var inp = new HistoryNumberInput();
        inp.r_value = this.series.r_startAngle;
        inp.min = 0;
        inp.max = 360;
        inp.default = 90;
        inp.label = "Start";
        inp.tooltip = new TooltipBlock({title: "Start angle", content: "The angle where to start drawing the pie chart. A number between 0 and 360."})
        return inp;
    })
    startAngle: HistoryNumberInput;

    @create(function(this: PieSeriesAngleTriple){
        var inp = new HistoryNumberInput();
        inp.r_value = this.series.r_minAngle;
        inp.min = 0;
        inp.max = 360;
        inp.default = 0;
        inp.label = "Min";
        inp.tooltip = new TooltipBlock({title: "Minimum angle size", content: "The minimal angle size to render. It prevents sectors from being rendered too small when the value is small"});
        return inp;
    })
    minAngle: HistoryNumberInput;

    @create(function(this: PieSeriesAngleTriple){
        var inp = new HistoryCheckboxInput();
        inp.r_value = this.series.r_clockwise;
        inp.default = true;
        inp.label = "Clockwise";
        inp.tooltip = new TooltipBlock({title: "Clockwise", content: "Whether the layout of sectors of the pie chart is clockwise."});
        return inp;
    })
    clockwise: HistoryCheckboxInput;

    get top(){
        return this.startAngle;
    }

    get middle(){
        return this.minAngle;
    }

    get bottom(){
        return this.clockwise;
    }

}

export class LabelLineSection extends RibbonContentSection{

    constructor(public labelLine: LabelLineSettings){
        super();
    }

    @define
    isUseNullDefaults = false;

    label = "label line";

    @create(function() {return new LabelLineTriple(this.labelLine)})
    triple: LabelLineTriple;

    get contents(){
        return [this.triple];
    }

    @create(function(){ return new LabelLineExpand(this.labelLine)})
    expand: LabelLineExpand;

}

class ShowCheckbox extends HistoryCheckboxInput{

    constructor(public labelLine: LabelLineSettings){
        super();
        this.r_value = this.labelLine.r_show;
    }

    @inject
    series: EChartSeriesSettings;

    @inject
    isUseNullDefaults: boolean;

    label = "Show";

    get default(){
        if (this.isUseNullDefaults){
            var s = this.series.labelLine.show;
            if (s === null){
                return true;
            }
            return s;
        }
        else
        {
            return true;
        }
    }

    set default(d){

    }

}

class LabelLineTriple extends TripleSurface{

    @inject
    isUseNullDefaults: boolean;

    constructor(public labelLine: LabelLineSettings){
        super();
    }

    @create(function(this: LabelLineTriple){
        var res = new ShowCheckbox(this.labelLine);
        res.tooltip = new TooltipBlock({title: "Show label line", content: "Whether to render the label line."})
        return res;
    })
    show: HistoryCheckboxInput;

    @create(function(this: LabelLineTriple){
        var res = new HistoryNumberInput();
        res.label = "First length";
        res.default = null;
        res.min = 0;
        res.isSmall = true;
        res.r_value = this.labelLine.r_length;
        res.tooltip = new TooltipBlock({title: "Label line first length", content: "The length of the first line."})
        return res;
    })
    length: HistoryNumberInput;

    @create(function(this: LabelLineTriple){
        var res = new HistoryNumberInput();
        res.label = "Second length";
        res.default = null;
        res.min = 0;
        res.isSmall = true;
        res.r_value = this.labelLine.r_length2;
        res.tooltip = new TooltipBlock({title: "Label line second length", content: "The length of the second line."})
        return res;
    })
    length2: HistoryNumberInput;

    get top(){
        return this.show;
    }

    get middle(){
        return this.length;
    }

    get bottom(){
        return this.length2;
    }

}

class SmoothCheckbox extends HistoryCheckboxInput{

    constructor(public labelLine: LabelLineSettings){
        super();
        this.r_value = this.labelLine.r_smooth;
    }

    @inject
    series: EChartSeriesSettings;

    @inject
    isUseNullDefaults: boolean;

    label = "Smooth";

    get default(){
        if (this.isUseNullDefaults){
            var s = this.series.labelLine.smooth
            if (s === null){
                return false;
            }
            return s;
        }
        else
        {
            return false;
        }
    }

    set default(d){

    }
}

class LabelLineExpand extends ExpandedSettings{

    constructor(public labelLine: LabelLineSettings){
        super();
    }

    @inject
    isUseNullDefaults: boolean;

    @create(function(this: LabelLineExpand){
        var res = new SmoothCheckbox(this.labelLine);
        res.tooltip = new TooltipBlock({title: "Smooth line", content: "Whether to smooth the label line."})
        return res;
    })
    smooth: HistoryCheckboxInput;

    @create(function(this: LabelLineExpand){
        var res = new BorderColorButton(this.labelLine.lineStyle.r_color);
        res.colorInputLabel = "Line color";
        res.label = "Line color";
        res.tooltipPrefix = "Color of the line. ";
        return res;
    })
    color: BorderColorButton;

    @create(function(this: LabelLineExpand){
        var res = new HistoryNumberInput();
        res.label = "Width";
        res.default = null;
        res.isSmall = true;
        res.min = 0;
        res.r_value = this.labelLine.lineStyle.r_width;
        res.tooltip = new TooltipBlock({title: "Line width", content: "The width of the label line."});
        return res;
    })
    width: HistoryNumberInput;

    @create(function(this: LabelLineExpand){
        var bt = new BorderType(this.labelLine.lineStyle.r_type);
        if (this.isUseNullDefaults){
            bt.items.unshift({
                value: null,
                label: "default"
            })
            bt.default = null;
        }
        return bt;
    })
    type: BorderType;

    @create(function(this: LabelLineExpand){
        var res = new OpacityInput();
        res.r_value = this.labelLine.lineStyle.r_opacity;
        res.itemName = "Label line"
        return res;
    })
    opacity: HistoryNumberInput;

    @init
    init(){
        var s = this.section("Line style");
        s.row().item(this.type);
        s.row().item(this.smooth);
        s.row().item(this.width);
        s.row().item(this.color);
        s.row().item(this.opacity);
    }

}

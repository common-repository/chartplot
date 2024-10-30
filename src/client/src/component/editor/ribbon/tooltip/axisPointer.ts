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
 
import {RibbonContentSection} from "../base";
import {HistoryRibbonSelectList} from "../blocks";
import {create, inject} from "../../../../../../di";
import {TooltipSettings} from "../../../echart/settings/tooltip";
import {ChartHistory} from "../../../history";
import {TripleSurface} from "../blocks/surface";
import {TooltipBlock} from "../blocks/tooltip";

export class AxisPointerSection extends RibbonContentSection{

    label = "axis pointer";

    @create(() => new FirstTriple())
    first: FirstTriple;

    get contents(){
        return [this.first];
    }

    tooltip = new TooltipBlock({title: "Axis pointer", content: "If you hover over the cartesian coordinate system with the mouse cursor, an axis pointer will show the currently highlighted data for the chosen axis.."})

}

class FirstTriple extends TripleSurface{

    @create(() => new AxisPointerType())
    type: AxisPointerType;

    @create(() => new AxisAxis())
    axis: AxisAxis;

    @create(() => new AxisPointerSnap())
    snap: AxisPointerSnap;

    get top(){
        return this.type;
    }

    get middle(){
        return this.axis;
    }

    get bottom(){
        return this.snap;
    }

}

class AxisPointerType extends HistoryRibbonSelectList {

    @inject
    tooltipSettings: TooltipSettings;

    @inject
    history: ChartHistory;

    items = [{value: null, label: [{tag: "b", child: "Auto"}, " type"]},
        {value: "line", label: [{tag: "b", child: "Line"}, " type"]},
        {value: "shadow", label: [{tag: "b", child: "Shadow"}, " type"]},
        {value: "cross", label: [{tag: "b", child: "Cross"}, " type"]},
        {value: "none", label: [{tag: "b", child: "None"}, " type"]}]

    default = null;

    get r_value(){
        return this.tooltipSettings.axisPointer.r_type;
    }

    get disabled() {
        return this.tooltipSettings.trigger !== "axis";
    }

    tooltip = new TooltipBlock({title: "Pointer type", content: {tag: "html", child: `
Determines how the pointer will be rendered.
<ul class="bullet">
<li><b>Auto: </b> Determined automatically. Normally, will be of type 'Line'.</li>
<li><b>Line: </b> Will be rendered as a single line for the selected axis.</li>
<li><b>Shadow: </b> Will be rendered as a transparent rectangle.</li>
<li><b>Cross: </b> 2 lines will be drawn for both x- and y-axis.</li>
<li><b>None: </b> No pointer will be rendered.</li>
</ul>
    `}})

}

class AxisAxis extends HistoryRibbonSelectList{

    @inject
    tooltipSettings: TooltipSettings;

    @inject
    history: ChartHistory;

    items = [{value: null, label: [{tag: "b", child: "default"}, "-axis"]},
        {value: "x", label: [{tag: "b", child: "x"}, "-axis"]},
        {value: "y", label: [{tag: "b", child: "y"}, "-axis"]}]

    default = null;

    get r_value(){
        return this.tooltipSettings.axisPointer.r_axis;
    }

    tooltip = new TooltipBlock({title: "Pointer axis", content: "The axis for which the axis pointer is shown. By default it is the categorical or time axis."})

    get disabled() {
        return this.tooltipSettings.trigger !== "axis";
    }

}

class AxisPointerSnap extends HistoryRibbonSelectList{

    @inject
    tooltipSettings: TooltipSettings;

    @inject
    history: ChartHistory;

    default = null;

    items = [{value: null, label: [{tag: "b", child: 'default'}, " snap"]},
        {value: true, label: [{tag: "b", child: 'always'}, " snap"]},
        {value: false, label: [{tag: "b", child: 'never'}, " snap"]}];

    get r_value(){
        return this.tooltipSettings.axisPointer.r_snap;
    }

    tooltip = new TooltipBlock({title: "Tooltip snap", content: {
        tag: "html",
        child: `
Whether the axis pointer should snap to the nearest data item.
<ul class="bullet">
<li><b>default: </b>Automatically determined</li>
<li><b>always: </b>Always snap to the nearest data item</li>
<li><b>never: </b>Do not snap</li>
</ul>
        `
        }})

    get disabled() {
        return this.tooltipSettings.trigger !== "axis";
    }

}

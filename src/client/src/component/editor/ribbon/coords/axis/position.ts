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
import {create, inject} from "../../../../../../../di";
import {GridAxis} from "../../../../echart/settings/coordinates/grid/axis";
import {HistoryNumberInput} from "../../blocks/input";
import {TooltipBlock} from "../../blocks/tooltip";
import {HistoryRibbonSelectList} from "../../blocks";

export class AxisPositionSection extends RibbonContentSection{

    label = "position";

    @inject
    selectedAxis: GridAxis;

    @create(function(this: AxisPositionSection){
        var r = new HistoryNumberInput();
        r.default = null;
        r.r_value = this.selectedAxis.r_offset;
        r.label = "Offset";
        r.tooltip = new TooltipBlock({title: "Axis offset", content: "Offset relative to the default position. Can be used to place multiple axes next to each other."});
        return r;
    })
    offset: HistoryNumberInput;

    @create(function(this: AxisPositionSection){
        var r = new HistoryRibbonSelectList();
        r.default = null;
        r.r_value = this.selectedAxis.r_position;
        r.items = [{value: null, label: [{tag: "b", child: "Default"}, " position"]}];
        r.tooltip = new TooltipBlock({title: 'position', content: 'The position of the axis in the coordinate system'});
        if (this.selectedAxis.coordinate === "x"){
            r.items.push({value: "bottom", label: [{tag: "b", child: "Bottom"}, " bottom"]});
            r.items.push({value: "top", label: [{tag: "b", child: "Top"}, " top"]});

        }
        else
        {
            r.items.push({value: "left", label: [{tag: "b", child: "Left"}, " left"]});
            r.items.push({value: "right", label: [{tag: "b", child: "Right"}, " right"]});
        }
        return r;
    })
    position: HistoryRibbonSelectList;

    get contents(){
        return [this.position, this.offset];
    }

}

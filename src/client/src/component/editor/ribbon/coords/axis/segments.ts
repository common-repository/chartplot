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
import {HistoryNumberInput} from "../../blocks/input";
import {GridAxis} from "../../../../echart/settings/coordinates/grid/axis";
import {TooltipBlock} from "../../blocks/tooltip";

export class AxisSegmentsSection extends RibbonContentSection{

    label = "segments";

    @inject
    selectedAxis: GridAxis;

    @create(function(this: AxisSegmentsSection){
        var r = new HistoryNumberInput();
        r.r_value = this.selectedAxis.r_splitNumber;
        r.isSmall = true;
        r.label = "segments";
        r.default = null;
        r.tooltip = new TooltipBlock({title: "Nr of segments", content: "The nr of segments the axis is split into. Note that this number serves only as a recommendation, and the true segments may be adjusted based on readability."})
        return r;
    })
    splitNumber: HistoryNumberInput;

    get contents(){
        return [this.splitNumber];
    }

}

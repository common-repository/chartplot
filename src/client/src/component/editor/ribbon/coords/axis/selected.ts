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
 
import {AxisGeneralSection} from "./general";
import {create, define} from "../../../../../../../di";
import {GridAxis} from "../../../../echart/settings/coordinates/grid/axis";
import {AxisRangeSection} from "./range";
import {AxisPositionSection} from "./position";
import {AxisSegmentsSection} from "./segments";

export class AxisSelectedPart{

    constructor(axis: GridAxis){
        this.selectedAxis = axis;
    }

    @define
    selectedAxis: GridAxis;

    @create(() => new AxisGeneralSection())
    general: AxisGeneralSection;

    @create(() => new AxisRangeSection())
    range: AxisRangeSection;

    @create(() => new AxisPositionSection())
    position: AxisPositionSection;

    @create(() => new AxisSegmentsSection())
    segments: AxisSegmentsSection;

    get contents(){
        return [this.general, this.range, this.position, this.segments];
    }


}

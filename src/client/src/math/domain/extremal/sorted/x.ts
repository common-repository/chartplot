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
 
import {IXSortedRingBuffer} from "../../../../collection/array/ring";
import {getEndX, IXIntervalData} from "../../../../datatypes/range";
import {IOptional, optional} from "../../../../../../core";
import {IPointInterval} from "../../../../geometry/interval/index";

export function calculateXDomain(data: IXSortedRingBuffer<IXIntervalData>): IOptional<IPointInterval>{
    if (data.length > 0){
        var xs = data.get(0);
        var xe = data.get(data.length - 1);
        var dat = data.findOne(xe.x);
        return optional({start: xs.x, end: getEndX(dat)});
    }
    return optional<IPointInterval>();
}

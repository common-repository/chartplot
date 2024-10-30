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
 
import {IOptional, optional} from "../../../../../../core";
import {IPointInterval} from "../../../interval/index";

export function estimateDistance(window: IPointInterval, itemSize: number, wholeSize: number): IOptional<number>{
    var height = itemSize;
    var axisDim = wholeSize;
    if (axisDim === 0 || height === 0)
    {
        return optional<number>();
    }
    var maxNr = Math.max(1, axisDim / height);
    var d = (window.end - window.start) / maxNr;
    if (d === 0)
    {
        return optional<number>();
    }
    return optional(d);
}

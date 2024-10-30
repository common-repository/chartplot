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
 
import {IPointRectangle} from "../../../../geometry/rectangle/index";
import {IIterable} from "../../../../collection/iterator/index";
import {IPoint} from "../../../../geometry/point/index";

export function calculateExtremal2d(data: IIterable<IPoint>): IPointRectangle{
    var it = data.iterator();
    if (!it.hasNext()){
        return {
            xs: 0, ys: 0, xe: 0, ye: 0
        }
    }
    var minx = Number.MAX_VALUE;
    var maxx = -Number.MAX_VALUE;
    var miny = Number.MAX_VALUE;
    var maxy = -Number.MAX_VALUE;
    while(it.hasNext()){
        var p = it.next();
        minx = Math.min(minx, p.x);
        maxx = Math.max(maxx, p.x);
        miny = Math.min(miny, p.y);
        maxy = Math.max(maxy, p.y);
    }
    return {
        xs: minx, ys: miny, xe: maxx, ye: maxy
    }
}

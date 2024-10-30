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
 
import {IPointRectangle, IRectangle} from "../../geometry/rectangle/index";
import {ITransformation} from "./matrix";

export function mapRectangle(rect: IRectangle, mapper: ITransformation){
    var p1 = mapper.transform(rect.x, rect.y);
    var p2 = mapper.transform(rect.x + rect.width, rect.y + rect.height);
    return {
        x: Math.min(p1.x, p2.x),
        y: Math.min(p1.y, p2.y),
        width: Math.abs(p1.x - p2.x),
        height: Math.abs(p1.y - p2.y)
    }
}

export function mapPointRectangle(rect: IPointRectangle, mapper: ITransformation){
    var p1 = mapper.transform(rect.xs, rect.ys);
    var p2 = mapper.transform(rect.xe, rect.ye);
    return {
        xs: Math.min(p1.x, p2.x),
        ys: Math.min(p1.y, p2.y),
        xe: Math.max(p1.x, p2.x),
        ye: Math.max(p1.y, p2.y)
    }
}

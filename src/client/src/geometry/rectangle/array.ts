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
 
import {IRectangle} from "./index";
import {IIterator} from "../../collection/iterator";

export class RectangleArrayWrapper{
    constructor(public rectangles: IRectangle[]){

    }

    public spanning(){
        var rectangles = this.rectangles;
        var xS = 0;
        var xE = 0;
        var yS = 0;
        var yE = 0;
        if (rectangles.length > 0) {
            var r = rectangles[0];
            xS = r.x;
            yS = r.y;
            xE = xS + r.width;
            yE = yS + r.height;
        }
        for (var i=1; i < rectangles.length; i++){
            var r = rectangles[i];
            var x = r.x;
            var y = r.y;
            xS = Math.min(xS, x);
            yS = Math.min(yS, y);
            xE = Math.max(xE, x + r.width);
            yE = Math.max(yE, y + r.height);
        }
        return {
            x: xS,
            y: yS,
            width: xE - xS,
            height: yE - yS
        };
    }

}

export function spanningFromCollection(it: IIterator<IRectangle>): IRectangle{
    if (it.hasNext()){
        var xs = Number.MAX_VALUE;
        var xe = -Number.MAX_VALUE;
        var ys = Number.MAX_VALUE;
        var ye = -Number.MAX_VALUE;
        while(it.hasNext()){
            var s = it.next();
            xs = Math.min(xs, s.x);
            xe = Math.max(xe, s.x + s.width);
            ys = Math.min(ys, s.y);
            ye = Math.max(ye, s.y + s.height);
        }
        return {
            x: xs,
            y: ys,
            width: xe - xs,
            height: ye - ys
        }
    }
    return {
        x: 0,
        y: 0,
        width: 10,
        height: 10
    }
}

export default function array(rect: IRectangle[]) {
    return new RectangleArrayWrapper(rect);
}

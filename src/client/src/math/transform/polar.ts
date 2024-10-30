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
 
import {IPointInterval} from "../../geometry/interval";
import {map1d} from "./index";

export const pi2 = Math.PI * 2;
export const pi05 = Math.PI * 0.5;
export const pi1 = Math.PI;
export const pi15 = Math.PI * 1.5;

export function normalizeRad(rad: number){
    var r = rad % pi2;
    if (r < 0){
        r += pi2;
    }
    return r;
}

export function radianToDegree(rad: number){
    return rad * (180 / Math.PI);
}

export function degreeToRadian(deg: number){
    return deg * (Math.PI / 180);
}

export function cartesianToPolar(x: number, y: number){

    var r = Math.sqrt(x*x + y*y)
    var angle = Math.atan2(y,x);
    return {
        radius: r,
        angle: angle
    }

}

export function polarToCartesian(angle: number, radius: number){
    return {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle)
    }
}

export function intervalToSegmentRadiusMapper(interval: IPointInterval, radiusInterval: IPointInterval){
    var mapper = map1d(interval).to(radiusInterval).create();
    return (x: number) => normalizeRad(mapper(x));
}

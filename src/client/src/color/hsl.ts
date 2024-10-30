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
 
import {IRgb} from "./rgb";

export interface IHsl{
    h: number;
    s: number;
    l: number;
}

export function toRGB(hsl: IHsl): IRgb{
    var C = (1 - Math.abs(2*hsl.l - 1)) * hsl.s;
    var X = C * (1 - Math.abs((hsl.h / 60) % 2 - 1));
    var m = hsl.l - C / 2;
    var r: number;
    var g: number;
    var b: number;
    if (hsl.h < 60){
        r = C;
        g = X;
        b = 0;
    }
    else if (hsl.h < 120)
    {
        r = X;
        g = C;
        b = 0;
    }
    else if (hsl.h < 180){
        r = 0;
        g = C;
        b = X;
    }
    else if (hsl.h < 240){
        r = 0;
        g = X;
        b = C;
    }
    else if (hsl.h < 300){
        r = X;
        g = 0;
        b = C;
    }
    else if (hsl.h < 360){
        r = C;
        g = 0;
        b = X;
    }
    r = (r + m)*255;
    g = (g + m)*255;
    b = (b + m)*255;
    return {
        r: r,
        g: g,
        b: b
    }
}

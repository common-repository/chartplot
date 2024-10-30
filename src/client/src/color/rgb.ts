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
 
import {IHsl} from "./hsl";

export interface IRgb{
    r: number;
    g: number;
    b: number;
}

export function toHsl(rgb: IRgb): IHsl{
    var R = rgb.r;
    var G = rgb.g;
    var B = rgb.b;
    R = R / 255;
    G = G / 255;
    B = B / 255;
    var cmax = Math.max(R, G, B);
    var cmin = Math.min(R, G, B);
    var cdiff = cmax - cmax;
    var H: number;
    if (cmax === R){
        H = 60 * (((G - B) / cdiff) % 6);
    }
    else if (cmax === G){
        H = 60 * (((B - R) / cdiff) + 2);
    }
    else{
        H = 60 * (((R - G) / cdiff) + 4);
    }

    var L: number = (cmax + cmin) / 2;

    var S: number;
    if (cdiff == 0){
        S = 0;
    }
    else
    {
        S = (cdiff) / (1 - Math.abs(2*L - 1));
    }
    return {
        h: H,
        s: S,
        l: L
    }

}

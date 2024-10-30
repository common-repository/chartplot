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
 
import {color, Rgba} from "./index";

var colors = ["rgb(25, 190, 255)", "#008000", "#000080", "#808000", "#800080", "#008080", "#808080",
    "#C00000", "#00C000", "#0000C0", "#C0C000", "#C000C0", "#00C0C0", "#C0C0C0",
    "#400000", "#004000", "#000040", "#404000", "#400040", "#004040", "#404040",
    "#200000", "#002000", "#000020", "#202000", "#200020", "#002020", "#202020",
    "#600000", "#006000", "#000060", "#606000", "#600060", "#006060", "#606060",
    "#A00000", "#00A000", "#0000A0", "#A0A000", "#A000A0", "#00A0A0", "#A0A0A0",
    "#E00000", "#00E000", "#0000E0", "#E0E000", "#E000E0", "#00E0E0", "#E0E0E0",
    "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];


function lighten(rgb: Rgba, amount: number)
{
    var r = Math.round(Math.max(0, Math.min(255, rgb.r + 255 * amount)));
    var g = Math.round(Math.max(0, Math.min(255, rgb.g + 255 * amount)));
    var b = Math.round(Math.max(0, Math.min(255, rgb.b + 255 * amount)));
    return color("rgb("+r+","+g+","+b+")");
}

export class UniqueColorGenerator{
    public index = 0;
    
    constructor(public colors: string[]){
        
    }

    public next(){ 
        var c = this.colors[this.index];
        this.index ++;
        if (this.index === this.colors.length)
        {
            this.index = 0;
        }
        var col = lighten(color(c).toRGB(),0.0);
        return col.toString();
    }

}

export default function unique(cols = colors){
    return new UniqueColorGenerator(cols);
}

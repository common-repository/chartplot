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
 
import {forEachIterator, IIterable, mapIterator} from "../../../collection/iterator/index";
import {HeightInterval, IRectangle, WidthInterval} from "../../rectangle/index";
import {linearizeIntervals} from "../interval/arrange";
import {spanningFromCollection} from "../../rectangle/array";

export interface IXArrangementSettings{

    valign: "center" | "top" | "bottom";
    rectangles: IIterable<IRectangle>;
    space: number;
}

var valignToArranger = {
    center: (p: number, r: IRectangle) => {
        r.y = p - r.height / 2;
    },
    top: (p: number, r: IRectangle) => {
        r.y = p;
    },
    bottom: (p: number, r: IRectangle) => {
        r.y = p - r.height;
    }
}

var valignToPointProvider = {
    center: (r: IRectangle) => r.y + r.height /2,
    top: (r: IRectangle) => r.y,
    bottom: (r: IRectangle) => r.y + r.height
}

export function arrangeRectanglesX(settings: IXArrangementSettings){
    linearizeIntervals({
        intervals: mapIterator(settings.rectangles.iterator(), m => new WidthInterval(m)),
        space: settings.space,
        start: 0
    });
    var sp = spanningFromCollection(settings.rectangles.iterator());
    var arranger = valignToArranger[settings.valign];
    var p = valignToPointProvider[settings.valign](sp);
    forEachIterator(settings.rectangles.iterator(), r => arranger(p ,r));
    return sp;
}

export interface IYArrangementSettings{
    halign: "left" | "right" | "center";
    rectangles: IIterable<IRectangle>;
    space: number;
}

var halignToArranger = {
    center: (p: number, r: IRectangle) => {
        r.x = p - r.width / 2;
    },
    left: (p: number, r: IRectangle) => {
        r.x = p;
    },
    right: (p: number, r: IRectangle) => {
        r.y = p - r.width;
    }
}

var halignToPointProvider = {
    center: (r: IRectangle) => r.x + r.width / 2,
    left: (r: IRectangle) => r.x,
    right: (r: IRectangle) => r.x + r.width
}

export function arrangeRectanglesY(settings: IYArrangementSettings){
    linearizeIntervals({
        intervals: mapIterator(settings.rectangles.iterator(), m => new HeightInterval(m)),
        space: settings.space,
        start: 0
    });
    var sp = spanningFromCollection(settings.rectangles.iterator());
    var arranger = halignToArranger[settings.halign];
    var p = halignToPointProvider[settings.halign](sp);
    forEachIterator(settings.rectangles.iterator(), r => arranger(p, r));
    return sp;
}

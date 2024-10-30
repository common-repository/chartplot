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
import {createValueConstrainer, IValueConstraintsSettings, normalizeValueModifySettings} from "../value/constrain";


/**
 * Constraints to modify a rectangle
 */
export interface IRectangleConstraints{

    /**
     * Constaints for the x-start position
     */
    xStart?: number | IValueConstraintsSettings | ((v: number) => number);
    /**
     * Constraints for the x-end position
     */
    xEnd?: number | IValueConstraintsSettings | ((v: number) => number);
    /**
     * Constraints for the y-start position
     */
    yStart?: number | IValueConstraintsSettings | ((v: number) => number);
    /**
     * Constraints for the y-end position
     */
    yEnd?: number | IValueConstraintsSettings | ((v: number) => number);
    /**
     * Constraints for the width
     */
    width?: IValueConstraintsSettings | ((v: number) => number);
    /**
     * Constraints for the height
     */
    height?: IValueConstraintsSettings | ((v: number) => number);

}

export class RectangleConstrainer{
    
    public xStart: (v: number) => number;
    public xEnd: (v: number) => number;
    public yStart: (v: number) => number;
    public yEnd: (v: number) => number;
    public width: (v: number) => number;
    public height: (v: number) => number;

    public constrainEnd(rect: IRectangle){
        var sx = this.xStart(rect.x);
        var ex  = this.xEnd(rect.x + rect.width);
        var sy = this.yStart(rect.y);
        var ey = this.yEnd(rect.y + rect.height);
        var w = ex - sx;
        var h = ey - sy;
        w = this.width(w);
        h = this.height(h);
        return {
            x: sx, y: sy, width: w, height: h
        }
    }
    
    public constrain(rect: IRectangle){
        var sx = this.xStart(rect.x);
        var ex  = this.xEnd(rect.x + rect.width);
        var sy = this.yStart(rect.y);
        var ey = this.yEnd(rect.y + rect.height);
        var w = ex - sx;
        var h = ey - sy;
        w = this.width(w);
        h = this.height(h);
        return {
            x: ex - w, y: ey - h, width: w, height: h
        }
    }

    public moveX(rect: IRectangle, x: number): number{
        if (x < rect.x){
            return this.xStart(x);
        }
        else {
            return this.xEnd(x + rect.width) - rect.width;
        }
    }

    public moveY(rect: IRectangle, y: number): number{
        if (y < rect.y){
            return this.yStart(y);
        }
        else {
            return this.yEnd(y + rect.height) - rect.height;
        }
    }

}

function normStart(val: number | IValueConstraintsSettings | ((v: number) => number)){
    if (typeof val === "number"){
        return norm({
            min: val
        })
    }
    return norm(val);
}

function normEnd(val: number | IValueConstraintsSettings | ((v: number) => number)){
    if (typeof val === "number"){
        return norm({
            max: val
        })
    }
    return norm(val); 
}

function norm(val: IValueConstraintsSettings | ((v: number) => number)){
    if (typeof val === "function"){
        return val;
    }
    return normalizeValueModifySettings(val);
}

function create(val: number | IValueConstraintsSettings | ((v: number) => number)){
    if (typeof val === "function"){
        return val;
    }
    else if (typeof val == "number"){
        return createValueConstrainer({
            max: val,
            min: val
        })
    }
    return createValueConstrainer(val);
}

export function normalizeRectangleConstraints(settings: IRectangleConstraints = {}): IRectangleConstraints{
    return {
        xStart: normStart(settings.xStart),
        yStart: normStart(settings.yStart),
        xEnd: normEnd(settings.xEnd),
        yEnd: normEnd(settings.yEnd),
        width: norm(settings.width),
        height: norm(settings.height)
    }
}

export function createRectangleConstrainer(settings: IRectangleConstraints){
    var n = normalizeRectangleConstraints(settings);
    var r = new RectangleConstrainer();
    r.xStart = create(n.xStart);
    r.xEnd = create(n.xEnd);
    r.yStart = create(n.yStart);
    r.yEnd = create(n.yEnd);
    r.width = createValueConstrainer(<IValueConstraintsSettings>n.width);
    r.height = createValueConstrainer(<IValueConstraintsSettings>n.height);
    return r;
}

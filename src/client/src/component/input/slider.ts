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
import {map1d} from "../../math/transform";
import rounder from "../../math/round";
import {variable} from "../../../../reactive";


export class SlideButton{

    public tag: string;
    public style: any;
    public r_width = variable(20);
    public r_height = variable(20);
    public r_x = variable(0);
    public r_y = variable(0);

    get y(){
        return this.r_y.value;
    }

    set y(v){
        this.r_y.value = v;
    }

    get x(){
        return this.r_x.value;
    }

    set x(v){
        this.r_x.value = v;
    }

    get height(){
        return this.r_height.value;
    }

    set height(v){
        this.r_height.value = v;
    }

    get width(){
        return this.r_width.value;
    }

    set width(v){
        this.r_width.value = v;
    }


    constructor(){
        var self = this;
        this.style = {
            position: "absolute",
            padding: "0",
            opacity: "0.8",
            background: "black",
            borderLeft: "1px solid white",
            borderRight: "1px solid white",
            margin: "0",
            get width(){
                return self.width+"px";
            },
            get height(){
                return self.height+"px";
            },
            get left(){
                return self.x+"px";
            },
            get top(){
                return self.y +"px";
            }
        }
    }

    public goToPoint(x: number, y: number){
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
    }

}

SlideButton.prototype.tag = "div";

export function getPointerPosition(source: IPointInterval, target: IPointInterval, value: number){
    return Math.max(target.start, Math.min(target.end, map1d(source).to(target).create()(value)));
}

export function createSteppingPointerPositionProvider(step: number){
    var round = rounder(step);
    return function(source: IPointInterval, target: IPointInterval, value: number){
        return round(getPointerPosition(source, target, value));
    }
}

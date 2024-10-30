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
 
import {IInterval} from "../../interval";

export interface IntervalConfig{
    horizontal: IInterval,
    vertical: IInterval
}

export class IntervalBacked{

    constructor(public widthInterval: IInterval, public heightInterval: IInterval){

    }

    get x(){
        return this.widthInterval.start;
    }

    set x(v){
        this.widthInterval.start = v;
    }

    get y(){
        return this.heightInterval.start;
    }

    set y(v){
        this.heightInterval.start = v;
    }

    get width(){
        return this.widthInterval.size;
    }

    set width(v){
        this.widthInterval.size = v;
    }

    get height(){
        return this.heightInterval.size;
    }

    set height(v){
        this.heightInterval.size = v;
    }

};

export default function interval(interval: IntervalConfig){
    return new IntervalBacked(interval.horizontal, interval.vertical);
}

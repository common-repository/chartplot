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
 
import {IFlexibleDistanceTicks, ITicks} from "./base";
import {IIterator} from "../../../collection/iterator/index";
import {SequenceGridIterator} from "./iterator";
import {log10} from "../../log";
import {rounded, RoundedSequence} from "../../sequence/index";

export class Log10Ticks implements ITicks, IFlexibleDistanceTicks{
    
    public positions: RoundedSequence = rounded(1);
    public minDistance: number = 1;

    private estimatePositions(minDistance: number){
        minDistance = Math.max(this.minDistance, minDistance);
        return Math.max(1, Math.pow(2, Math.ceil(Math.log(minDistance) / Math.LN2)));
    }

    set distance(d: number){
        this.positions.distance = this.estimatePositions(d);
    }

    get distance(){
        return this.positions.distance;
    }

    iterator(start: number, end: number): IIterator<number>{
        return new SequenceGridIterator(start, end, this);
    }

    public morePositions(){
        this.positions.distance = Math.max(1, Math.round(this.positions.distance / 2));
    }

    public lessPositions(){
        this.positions.distance = Math.round(this.positions.distance * 2);
    }
    
    /**
     * Returns the item that is nearest to the given item
     * @param e
     */
    nearest(e: number): number{
        var k = log10(e);
        var p = this.positions.nearest(k);
        var res = Math.pow(10, p);
        return res;
    }
    /**
     * Returns the nearest item that is strictly smaller than the given item
     * @param e
     */
    previous(e: number): number{
        var k = log10(e);
        var p = this.positions.previous(k);
        var res = Math.pow(10, p);
        if (p === k || res >= e){
            p = this.positions.previous(p);
        }
        else
        {
            return res;
        }
        return Math.pow(10, p);
        
    }
    /**
     * Returns the nearest item that is strictly bigger than the given item
     * @param e
     */
    next(e: number): number{
        var k = log10(e);
        var p = this.positions.next(k);
        var res = Math.pow(10, p);
        if (p === k || res <= e){
            p = this.positions.next(p);
        }
        else {
            return res;
        }
        return Math.pow(10, p);
    }
}

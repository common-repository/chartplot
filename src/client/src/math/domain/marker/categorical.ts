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
 
import {rounded, RoundedSequence} from "../../sequence/index";
import {IFlexibleDistanceTicks} from "./base";
import {SequenceGridIterator} from "./iterator";

export class DiscreteTicks implements IFlexibleDistanceTicks{

    public positions: RoundedSequence = rounded(1);
    public minDistance = Number.MIN_VALUE;

    constructor(){

    }

    public iterator(start: number, end: number){
        return new SequenceGridIterator(start, end, this.positions);
    }

    get distance(){
        return this.positions.distance;
    }

    set distance(d: number){
        this.positions.distance = this.estimatePositions(d);
    }

    public nearest(pos: number){
        return this.positions.nearest(pos);
    }

    public next(pos: number){
        return this.positions.next(pos);
    }

    public previous(pos: number){
        return this.positions.previous(pos);
    }

    public morePositions(){
        this.distance = Math.max(1, Math.round(this.positions.distance / 2));
    }

    public lessPositions(){
        this.distance = Math.round(this.positions.distance * 2);
    }

    private estimatePositions(minDistance: number){
        minDistance = Math.max(this.minDistance, minDistance);
        return Math.max(1, Math.pow(2, Math.ceil(Math.log(minDistance) / Math.LN2)));
    }

}

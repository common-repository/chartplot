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
 
import {IIterator} from "../../../collection/iterator/index";
import {base10List, Base10ListSequence, ISequence, rounded, RoundedSequence} from "../../sequence/index";
import {IFlexibleDistanceTicks} from "./base";
import {SequenceGridIterator} from "./iterator";

/**
 * A sequence of numbers used inside an axis to identify nice label positions
 */
export interface ITicks extends ISequence<number>{

    iterator(start: number, end: number): IIterator<number>;

}

/**
 * Tick positions that can be dynamically increased or decreased
 */
export interface IFlexibleTicks extends ITicks{

    /**
     * Increases the number of marker positions
     */
    morePositions(): void;
    /**
     * Decreases the number of marker positions
     */
    lessPositions(): void;

}

/**
 * Ticks positions that have a fixed distance next to each other
 */
export interface IFlexibleDistanceTicks extends IFlexibleTicks{

    /**
     * The current distance between two neighbour marker positions
     */
    distance: number;
    /**
     * The minimal distance between two neighbour marker positions. Can be null.
     */
    minDistance: number;

}

export var nice10Sequence: Base10ListSequence = base10List([1, 2, 5]);

export class FlexibleDistanceTicks implements IFlexibleDistanceTicks{

    public positions: RoundedSequence = rounded(1);
    public distanceSequence: ISequence<number> = nice10Sequence;
    private _minDistance: number = -Number.MAX_VALUE;

    set minDistance(v){
        this._minDistance = v;
        this.distance = Math.max(this.distance, this._minDistance);
    }

    get minDistance(){
        return this._minDistance;
    }

    protected setDistance(v: number): number{
        v = Math.max(v, this.minDistance);
        v = this.estimatePositions(v);
        this.positions.distance = v;
        return this.positions.distance;
    }
    
    set distance(v: number){
        this.setDistance(v);
    }
    
    get distance(){
        return this.positions.distance;
    }

    constructor(){

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

    public iterator(start: number, end: number){
        return new SequenceGridIterator(start, end, this);
    }

    public morePositions(){
        this.distance =  this.distanceSequence.previous(this.positions.distance);
    }

    public lessPositions(){
        this.distance = this.distanceSequence.next(this.positions.distance);
    }

    private estimatePositions(minDistance: number){
        var n = this.distanceSequence.next(minDistance);
        var p = this.distanceSequence.previous(n);
        if (p !== minDistance)
        {
            minDistance = n;
        }
        return minDistance;
    }

}


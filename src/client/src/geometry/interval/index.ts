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
 
export class IntervalWrapper{

    constructor(public interval: IInterval){

    }

    public isOverlappingWith(interval2: IInterval){
        var s1 = this.interval.start;
        var e1 = s1 + this.interval.size;

        var s2 = interval2.start;
        var e2 = s2 + interval2.size;

        return (s1 <= e2 && e1 >= s2);
    }

    public constrain(){
        return new ConstrainedIntervalMaker(this.interval);
    }

    public distance(ivl: IInterval){
        if (this.interval.start < ivl.start){
            return Math.max(0, ivl.start - (this.interval.start + this.interval.size));
        }
        else
        {
            return Math.max(0, this.interval.start - (ivl.start + ivl.size));
        }
    }
}

export function intervalDistance(ivl: IInterval, interval: IInterval){
    if (interval.start < ivl.start){
        return Math.max(0, ivl.start - (interval.start + interval.size));
    }
    else
    {
        return Math.max(0, interval.start - (ivl.start + ivl.size));
    }
}

export class ConstrainedIntervalMaker{

    private _minSize = 0;
    private _minLeft: number;
    private _maxRight: number;

    constructor(public interval: IInterval) {
        this.interval = interval;
        this._minSize = 0;
        this._minLeft = interval.start;
        this._maxRight = interval.start + interval.size;
    }

    public minSize(minSize: number){
        this._minSize = minSize;
        return this;
    }

    public minLeft(minLeft: number){
        this._minLeft = minLeft; 
        return this;
    }

    public maxRight(maxRight: number){
        this._maxRight = maxRight;
        return this;
    }

    public create(){
        var left = this.interval.start;
        var right = left + this.interval.size;
        left = Math.max(this._minLeft, left);
        right = Math.min(right, this._maxRight);
        var size = right - left;
        var sizeDiff = this._minSize - size;
        if (sizeDiff > 0) {
            var add = sizeDiff / 2;
            left = left - add;
            right = right + add;
        }
        return {
            start: left,
            size: right - left
        };
    }

}

export default function interval(interval: IInterval){
    return new IntervalWrapper(interval);
}

export interface IInterval{
    start: number;
    size: number;
}

/**
 * An interval determined by a start and end position
 */
export interface IPointInterval{
    /**
     * The start of this interval
     */
    start: number;
    /**
     * The end of this interval
     */
    end: number;
}

export class ReversePointInterval{
    constructor(public interval: IPointInterval)
    {
        
    }
    
    get start(){
        return this.interval.end;
    }
    
    get end(){
        return this.interval.start;
    }
}

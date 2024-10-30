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
 
import {IInterval} from "./index";
import {IIterable, IIterator} from "../../collection/iterator";

export class IntervalArrayWrapper{

    constructor(public intervals: IInterval[]){

    }

    minDistance(){
        var intervals = this.intervals;
        var dist = 9999999999;
        if (intervals.length > 1) {

            var last = intervals[0];
        }
        if (intervals.length < 2) {
            return 0;
        }
        for(var i=1; i < intervals.length; i++) {
            var c = intervals[i];
            dist = Math.min(dist, Math.abs(last.start + last.size - c.start));
            last = c;
        }
        return dist;
    }
}

export default function array(intervals: IInterval[]){
    return new IntervalArrayWrapper(intervals);
}

export function spanningFromCollection(it: IIterator<IInterval>): IInterval{
    if (it.hasNext()){
        var start = Number.MAX_VALUE;
        var end = -Number.MAX_VALUE;
        while(it.hasNext()){
            var s = it.next();
            start = Math.min(start, s.start);
            end = Math.max(end, s.start + s.size);
        }
        return {
            start: start,
            size: end - start
        }
    }
    return {
        start:0,
        size: 10
    }
}

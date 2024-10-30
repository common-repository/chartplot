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
 
import {ISequence} from "../../sequence/index";

export class SequenceGridIterator{

    constructor(public start: number, public end: number, public sequence: ISequence<number>){
        var p = this.sequence.previous(this.start);
        if (this.start - p < 0.000000000001){
            this.start = p;
        }
        else {
            this.start = this.sequence.next(p);
        }
    }

    public hasNext(){
        return this.start - this.end < 0.000000000001;
    }

    public next(){
        var s = this.start;
        this.start = this.sequence.next(s);
        return s;
    }
}


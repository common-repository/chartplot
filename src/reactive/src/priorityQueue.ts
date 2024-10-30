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
 
export class Queue<E>{

    public size = 0;
    public queue: E[] = [];

    constructor(public comparator: (a: E, b:E) => number){

    }

    public offer(e: E)
    {
        var i = this.size;
        this.size = i + 1;
        if (i == 0) {
            this.queue[0] = e;
        }
        else {
            this._siftUp(i, e);
        }
        return true;
    }
    
    public poll(){
        if (this.size === 0) {
            return null;
        }
        this.size = this.size - 1;
        var s = this.size;
        var result = this.queue[0];
        var x = this.queue[s];
        this.queue[s] = null;
        if (s != 0) {
            this._siftDown(0, x);
        }
        return result;
    }
    
    private _siftUp(k: number ,x: E){
        while (k > 0) {
            var parent = (k - 1) >>> 1;
            var e = this.queue[parent];
            if (this.comparator(x, e) >= 0) {
                break;
            }
            this.queue[k] = e;
            k = parent;
        }
        this.queue[k] = x;
    }
    
    private _siftDown(k: number, x: E){
        var half = this.size >>> 1;
        while (k < half) {
            var child = (k << 1) + 1;
            var c = this.queue[child];
            var right = child + 1;
            if (right < this.size && this.comparator(c, this.queue[right]) > 0) {
                c = this.queue[right];
                child = right;
            }
            if (this.comparator(x, c) <= 0) {
                break;
            }
            this.queue[k] = c;
            k = child;
        }
        this.queue[k] = x;
    }
};

export default function<E>(comparator: (a: E, b: E) => number)
{
    return new Queue(comparator);
};

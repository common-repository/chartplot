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
 
function compare(x1: number, x2: number){
    return x1 - x2;
}

function compareInclude(x1: number, x2: number){
    var diff = x1 - x2;
    if(diff === 0)
    {
        return -1;
    }
    return diff;
}

function compareIncludeBigger(x1: number, x2: number){
    var diff = x1 - x2;
    if(diff === 0)
    {
        return 1;
    }
    return diff;
}
export class ArrayBisectionSearcher<E>{
    
    
    constructor(public array: E[], public compareValue: (e: E) => number){
        
    }
    
    public firstSmaller(xVal: number, include: boolean = false): number{
        if (this.array.length === 0){
            return -1;
        }
        if (include){
            var comp = compareInclude;
        }
        else{
            comp = compare;
        }
        var s = 0;
        var e = this.array.length - 1;
        var sm = this._firstSmaller(xVal, s, e, comp);
        if (sm !== null){
            sm = this._firstBigger(this.compareValue(this.array[sm]), 0, sm, compareIncludeBigger);
            if (sm === null){
                return -1;
            }
        }
        else {
            return -1;
        }
        return sm;
    }

    public lastSmaller(xVal: number, include: boolean = false){
        if (this.array.length === 0){
            return -1;
        }
        if (include){
            var comp = compareInclude;
        }
        else{
            comp = compare;
        }
        var s = 0;
        var e = this.array.length - 1;
        var sm = this._firstSmaller(xVal, s, e, comp);
        if (sm === null){
            return -1;
        }
        return sm;
    }

    public firstBigger(xVal: number, include: boolean = false): number
    {
        if (this.array.length === 0){
            return 0;
        }
        if (include){
            var comp = compareIncludeBigger;
        }
        else {
            comp = compare;
        }
        var s = 0;
        var e  = this.array.length - 1;
        var sm = this._firstBigger(xVal, s, e, comp);
        if (sm === null){
            return this.array.length;
        }
        return sm;
    }

    _firstSmaller(xVal: number, s: number, e: number, comp: (e: number, n: number) => number): number{
        do{
            var mid = Math.ceil((s + e) / 2);
            var val = this.array[mid];
            var diff = comp(this.compareValue(val), xVal);
            if (diff < 0){
                s = mid;
            }
            else{
                e = mid - 1;
            }
        }while(s < e);
        diff = comp(this.compareValue(this.array[s]), xVal);
        if (diff < 0){
            return s;
        }
        return null;
    }

    public lastBigger(xVal: number, include: boolean = false): number{
        if (this.array.length === 0){
            return 0;
        }
        if (include){
            var comp = compareIncludeBigger;
        }
        else {
            comp = compare;
        }
        var s = 0;
        var e  = this.array.length - 1;
        var sm = this._firstBigger(xVal, s, e, comp);
        if (sm !== null){
            sm = this._firstSmaller(this.compareValue(this.array[sm]), sm, e, compareInclude);
            if (sm === null){
                return this.array.length;
            }
        }
        else{
            return this.array.length;
        }
        return sm;
    }

    _firstBigger(xVal: number, s: number, e: number, comp: (e: number, n: number) => number): number{
        do{
            var mid = Math.floor((s + e) / 2);
            var val = this.array[mid];
            var diff = comp(this.compareValue(val), xVal);
            if (diff > 0){
                e = mid;
            }
            else {
                s = mid + 1;
            }
        }while (s < e);
        diff = comp(this.compareValue(this.array[e]), xVal);
        if (diff > 0){
            return e;
        }
        return null;
    }
}

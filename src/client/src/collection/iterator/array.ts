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
 
import {IIterable, IIterator} from "./index";

export interface IIterableArray<E> extends Array<E>, IIterable<E>{

}

export class ArrayIterable<E> implements IIterable<E>{

    constructor(public array: E[]){

    }

    public iterator(){
        return new ArrayIterator(this.array);
    }

}

/**
 * An iterator over an array that also provides index information.
 */
export interface IArrayIterator<E> extends IIterator<E>{
    /**
     * Contains the index position in the array of the element that was returned by the last @api{next} call.
     */
    index: number;
}

export class ArrayIterator<E> implements IArrayIterator<E>{

    public index = 0;

    constructor(public array: E[]){
    }

    public hasNext(){
        return this.index < this.array.length;
    }

    public next(){
        var val = this.array[this.index];
        this.index++;
        return val;
    }
}

export function arrayIterator<E>(a: E[]){
    return array(a);
}

export default function array<E>(array: E[])
{
    return new ArrayIterator<E>(array);
}

export function iterable<E>(arr: E[]): IIterableArray<E>{
    (<any>arr).iterator = function(){
        return array(arr);
    }
    return <IIterableArray<E>><any>arr;
}



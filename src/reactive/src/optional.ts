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
 
import {IOptional} from "../../core";
import {_ReactiveNode} from "./node";

export class ReactiveOptional<E> implements IOptional<E>{

    private _value: E;
    private isPresent: boolean = false;
    public $r = new _ReactiveNode();

    get present(){
        this.$r.observed();
        return this.isPresent;
    }

    set value(v: E){
        this._value = v;
        this.isPresent = true;
        this.$r.changedDirty();
    }

    public empty(){
        if (this.isPresent){
            this.isPresent = false;
            this._value = null;
            this.$r.dirty();
        }
        this.$r.changed();
    }

    get value(){
        this.$r.observed();
        if (!this.isPresent){
            throw new Error("Optional has no value");
        }
        return this._value;
    }

}

/**
 * Creates a new reactive optional object
 * @param {E} val
 * @returns {ReactiveOptional<E>}
 */
export default function<E>(val?: E){
    var opt = new ReactiveOptional<E>();
    if (val !== void 0){
        opt.value = val;
    }
    return opt;
}

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
 
import {IHistoryCommand} from "./index";
import {IReactiveArray} from "../../../../reactive/src/array";
import {transaction} from "../../../../reactive";

export class MoveArrayItemCommand implements IHistoryCommand{

    constructor(public array: IReactiveArray<any>, public from: number, public to: number){

    }

    undo(){
        this.do();
    }

    do(){
        transaction(() => {
            const f = this.array.get(this.from);
            const t = this.array.get(this.to);
            this.array.set(this.from, t);
            this.array.set(this.to, f);
        });
    }

}

export class InsertArrayItemCommand implements IHistoryCommand{

    constructor(public array: IReactiveArray<any>, public value: any, public position: number){

    }

    do(){
        this.array.insert(this.position, this.value);
    }

    undo(){
        this.array.remove(this.position);
    }

}

export class RemoveArrayItemCommand implements IHistoryCommand{

    private old: any;

    constructor(public array: IReactiveArray<any>, public position: number){

    }

    do(){
        this.old = this.array.get(this.position);
        this.array.remove(this.position);
    }

    undo(){
        this.array.insert(this.position, this.old);
    }

}

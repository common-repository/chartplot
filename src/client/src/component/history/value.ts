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
import {IVariable} from "../../../../reactive/src/variable";

export class ValueHistory implements IHistoryCommand{

    private old: any;

    constructor(public holder: IVariable<any>, public value: any){

    }

    do(){
        this.old = this.holder.value;
        this.holder.value = this.value;
    }

    undo(){
        this.holder.value = this.old;
    }

}

export class PropertyValueHistory extends ValueHistory{

    constructor(object, property: string, value: any){
        super({
            get value(){
                return object[property];
            },

            set value(v){
                object[property] = v;
            }

        }, value);
    }

}

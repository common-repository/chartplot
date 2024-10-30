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
 
import {IVariable} from "../../../../../reactive/src/variable";
import {ObjectModel} from "../model/base";

function createTextShape(value: IVariable<string>){
    return  {
        tag: "input",
        attr: {
            type: "text",
        },
        prop: {
            get value(){
                return value.value
            }
        },
        event: {
            change: (ev) => {
                value.value = ev.target.value;
            }
        }
    }
}

namespace createTextShape{
    export function model(model: ObjectModel, property: string){
        return createTextShape(model.variable(property));
    }
}

function createNumberShape(value: IVariable<number>){

}

function createSliderShape({value, from, to, step}){

}

namespace createSliderShape{
    export function model(model: ObjectModel, property: string){
        var meta = model.getMeta(property);
        return createSliderShape({
            value: model.variable(property),
            from: meta.from,
            to: meta.to,
            step: meta.step || 1
        });
    }
}

export default {
    text: createTextShape,
    number: createNumberShape,
    slider: createSliderShape
}

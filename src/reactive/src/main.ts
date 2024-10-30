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
 
import {getReactor, Reactor} from "./reactor";
import variable, {IReactiveVariable, transformProperties} from "./variable";
import procedure, {IProcedure} from "./procedure";
import array, {IReactiveArray} from "./array";

export {transaction, unchanged, unobserved} from './reactor';

export default function reactive<E>(o: any): IReactiveArray<any> | IReactiveVariable<any> | IProcedure | any{
    if (Array.isArray(o)){
        return array<E>(o);
    }
    else if (o && typeof o === "object"){
        return transformProperties(o);
    }
    else if (typeof o === "function"){
        return procedure(o);
    }
    else
    {
        return variable<E>(o);
    }
}

export function logError(l: boolean){
    (<Reactor>getReactor()).logError = l;
}

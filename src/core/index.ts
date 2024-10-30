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
 
import * as hashMod from './src/hash';
import * as funcMod from './src/func';
import * as extendMod from './src/extend';
import * as objectMod from './src/object';

export {IIterable, IIterator} from './src/iterator';
export {cancelAnimation, requestAnimation} from './src/timer';
export {IOptional, optional} from './src/optional';
export {dummy} from './src/func';
export {Constructor, copyClass} from './src/mixin';



export {default as list, IListNode, IList } from './src/list';

export const func = funcMod;

/**
 *
 * @param args
 * @returns {any}
 */
export function extend(...args: any[]){
    return extendMod.default.apply(null, args);
}

export function hash(val){
    return hashMod.default(val);
}

export namespace hash{
    export const setHash = hashMod.set;
    export const map = hashMod.map;
    export type IHashMap<K, V> = hashMod.IHashMap<K, V>;
}

export namespace extend{
    export const deep = extendMod.deep;
    export const missing = extendMod.missing;
    export const props = extendMod.properties;
}

export const object = objectMod;

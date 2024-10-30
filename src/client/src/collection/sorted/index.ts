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
 
import {IIterable, IIterator} from "../iterator/index";

export interface KeyValue<K, E>{
    key: K;
    value: E;
}

export interface ISortedCollection<K, E> extends IIterable<KeyValue<K, E>>{

    compare: (a: K, b: K) => number;
    insert(key: K, element: E, replace?: boolean): E;
    find(key: K): E;
    remove(key: K): E;
    contains(key: K): boolean;
    biggest(): KeyValue<K, E>;
    smallest(): KeyValue<K, E>;
    firstSmaller(val: K, include?: boolean): KeyValue<K, E>;
    firstBigger(val: K, include?: boolean): KeyValue<K, E>;
    clear(): ISortedCollection<K, E>;
    iterator(start?: K, startInclude?: boolean, end?: K, endInclude?: boolean): IIterator<KeyValue<K, E>>;
    length: number;

}

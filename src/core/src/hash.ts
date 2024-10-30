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
 
var hashIds = 0;

export function hash(value: any): any
{
    if (value != null && typeof value == 'object')
    {
        if ("getHash" in value){
            return value.getHash();
        }
        else if ("_hashId" in value)
        {
            return value._hashId;
        }
        else
        {
            hashIds++;
            set(value, hashIds);
            return hashIds+"";
        }
    }
    else
    {
        return value+"";
    }
}

export default hash;

/**
 *
 * @param object
 * @param value
 */
export function set(object: any, value: any){
    object._hashId = value;
}

const s = set;
export interface IKeyValue<K, V>{
    key: K;
    value: V;
}

export interface IHashMap<K, V>{

    objects: {[s: string]: IKeyValue<K, V>};
    put(k: K, v: V);
    get(k: K): V;
    remove(k: K);
}

class HashMap<K, V> implements IHashMap<K, V>{

    public objects: {[s: string]: IKeyValue<K, V>} = {};

    constructor(){

    }

    public put(k: K, v: V){
        this.objects[hash(k)] = {key: k, value: v};
    }

    public get(k: K) {
        var v = this.objects[hash(k)];
        if (!v){
            return null;
        }
        return v.value;
    }

    public remove(k: K){
        delete this.objects[hash(k)];
    }

}

export function map<K, V>(): IHashMap<K ,V>{
    return new HashMap();
}


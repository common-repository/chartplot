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
 
import {list, IListNode, IList} from "../../../../../core";

interface LRUNode<E> extends IListNode<E>{
    key: string;
}

export class LRU<E>{
    
    public list: IList<E> = list<E>();
    public map: {[s: string]: IListNode<E>} = {};
    public capacity = 1000;

    public set(key: string, value: E){
        if (!(key in this.map)){
            if (this.list.size > this.capacity - 1){
                var nr = <LRUNode<E>>this.list.last.previous;
                nr.remove();
                delete this.map[nr.key];
                this.destroy(nr.key, nr.value);
            }
        }
        var n = <LRUNode<E>>this.list.addFirst(value);
        n.key = key;
        this.map[key] = n;
    }

    public get(key: string): E{
        var n = this.map[key];
        if (n){
            n.remove();
            this.list.addFirstNode(n);
            return n.value;
        }
        return null;
    }

    public destroy(key: string, value: E){

    }

}

export function lru<E>(){
    return new LRU<E>();
}

export default lru;

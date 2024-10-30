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
 
import {hash} from "../../../core";

export interface ICachingMapper<E, M>{
    map(vals: E[]): M[];
}

class CachingMapper<E, M>{

    public valToMapped = hash.map<E, M>();
    public onRemoved: (val: M) => void;

    constructor(public mapper: (e: E) => M){

    }

    public map(vals: E[]): M[]{
        var res: M[] = [];
        var newValToMapped = hash.map<E, M>();
        for (var i=0; i < vals.length; i++){
            var v = vals[i];
            var m = this.valToMapped.get(v);
            if (!m){
                m = this.mapper(v);
            }
            res.push(m);
            newValToMapped.put(v, m);
        }
        if (this.onRemoved){
            for (var k in this.valToMapped.objects){
                if (!(k in newValToMapped.objects)){
                    var kv = this.valToMapped.objects[k];
                    this.onRemoved(kv.value);
                }

            }
        }
        this.valToMapped = newValToMapped;
        return res;
    }

}

export interface ICachingMapperOptions<M>{
    onRemoved?: (val: M) => void;
}

export function cachingMapper<E, M>(mapper: (e: E) => M, settings: ICachingMapperOptions<M> = {}): ICachingMapper<E, M>{
    var m = new CachingMapper(mapper);
    if (settings.onRemoved){
        m.onRemoved = settings.onRemoved;
    }
    return m;
}

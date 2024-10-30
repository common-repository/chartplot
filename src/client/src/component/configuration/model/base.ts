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
 
import {variable} from "../../../../../reactive"

export class ObjectModel{

    public properties: any = {};
    private _meta: any = {};
    private _vars: any = {};

    get(property){
        if (property in this.properties){
            return this._vars[property].value;
        }
        return undefined;
    }

    set(property, value){
        if (!(property in this.properties)){
            this.properties[property] = true;
            this._vars[property] = variable(value);
            return;
        }
        this._vars[property].value = value;
    }

    variable(property){
        const self = this;
        return {
            get value(){
                return self.get(property);
            },
            set value(v){
                self.set(property, v);
            }
        }
    }

    setMeta(property, meta){
        this._meta[property] = meta;
        return this;
    }

    configure(config){
        for (var p in config){
            var v = config[p];
            if ("value" in v){
                this.set(p, v.value);
            }
            this.setMeta(p, v);
        }
        return this;
    }

    getMeta(property){
        return this._meta[property];
    }

    delete(property){
        delete this.properties[property];
    }

    find(path: string[]){
        var res = this;
        for (var i=0; i < path.length; i++){
            var p = path[i];
            res = res.get(p);
            if (!res){
                return res;
            }
        }
        return res;
    }

    toJson(){
        var res: any = {};
        for (var k in this.properties){
            var m = this.get(k);
            if (m){
                if (typeof m === "object" && "toJson" in m){
                    res[k] = m.toJson();
                    continue;
                }
                res[k] = m;
            }
        }
        return res;
    }

}

export default function(){
    return new ObjectModel();
}

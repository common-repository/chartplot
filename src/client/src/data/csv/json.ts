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
 
import {CSVDataReader} from "./read";

export type columnType = "string" | "number" | "date";

export interface IColumnTypeSettings{
    type: columnType;
    format?: string;
    required?: boolean;
}

export interface ICsvToJsonParser{

    hasHeader?: boolean;
    csv: string;
    rowToType?: {[s: string]: IColumnTypeSettings | columnType};
    rowIds?: string[];

}

var stringType = {
    type: "string"
}

export default function csvRowToJson<E>(settings: ICsvToJsonParser): E[]{
    var read = new CSVDataReader(settings.csv);
    var rowIds: string[] = [];
    var rowToType = {};
    var requiredRows = [];
    for (var key in settings.rowToType || {}){
        var rt = settings.rowToType[key];
        if (typeof rt === "string"){
            rt = {
                type: rt
            }
        }
        rowToType[key] = rt;
        if (rt.required){
            requiredRows.push(key);
        }
    }
    var i = 0;
    if (settings.hasHeader && read.hasNext()){
        var row = read.next();
        while(row.hasNext()){
            i++;
            rowIds.push(row.next());
        }
    }
    var sr = settings.rowIds || [];
    for (var k=i; k < sr.length; k++){
        rowIds.push(sr[k]);
    }
    var res: E[] = [];
    var x = 0;
    while(read.hasNext()){
        var row = read.next();
        var i = 0;
        var json: any = {
            x: x
        };
        while(row.hasNext()){
            var val = <any>row.next();
            if (val === ""){
                continue;
            }
            var key = rowIds[i];
            if (key){
                var tp = rowToType[key] || stringType;
                switch(tp.type){
                    case "number":
                        val = parseFloat(val);
                        break;
                    default:
                }
                json[key] = val;
            }
            i++;
        }
        x++;
        var canAdd = true;
        for (var i=0; i < requiredRows.length; i++){
            var rr = requiredRows[i];
            if (!(rr in json)){
                canAdd = false;
                break;
            }
        }
        if (canAdd){
            res.push(json);
        }
    }
    return res;
}

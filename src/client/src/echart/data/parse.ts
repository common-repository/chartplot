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
 
import {ITableMetaData} from "./truncate";
import {DataRowBuilder} from "../../component/echart/settings/dataset/row";
import {extend} from "../../../../core";

export class TableMetaDataParser{

    parseValue(val: string){
        var type = typeof val;
        if (type === "string"){
            if (isNaN(<any>val)){
                return val;
            }
            if (val === ""){
                return "";
            }
            return parseFloat(val);
        }
        else if (type === "number"){
            return val;
        }
        return null;
    }

    parse(data: ITableMetaData){
        if(!data || data.data.length === 0){
            ret = [];
            (<any>ret)._columnIds = [];
            (<any>ret)._colIdToCol = {};
            return ret;
        }
        var tr = data.dataCoords;
        if (!tr){
            tr = {
                startRow: 0,
                endRow: data.data.length - 1,
                startCol: 0,
                endCol: data.data[0].length - 1
            }
        }
        var values = data.data;
        var ret = [];
        var vc = data.validColumns || {};
        for (var i=tr.startRow; i <= tr.endRow; i++){
            var row = values[i];
            var rowBuilder = new DataRowBuilder();
            for (var j=tr.startCol; j <= tr.endCol; j++){
                if (vc[j] === false){
                    continue;
                }
                var val = row[j];
                var col = data.colToSpecial[j];
                if (col && col.colType && col.colType !== 'value'){
                    if (col.colType === "ignore"){
                        continue;
                    }
                    this.applyColumnSpecial(rowBuilder, val, col);
                }
                else
                {
                    var parsed = this.parseValue(val);
                    rowBuilder.value.push(parsed);
                }
            }
            var sr = data.rowToSpecial[i];
            if (sr){
                extend(rowBuilder.createObject(), sr.createEChartConfig());
            }
            ret.push(rowBuilder.toRow());
        }
        return ret;
    }

    applyColumnSpecial(rowBuilder: DataRowBuilder, value, column: any){

    }

}

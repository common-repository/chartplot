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

export interface ICSVDataSettings{
    separator?: string
}


export function truncateTable(reader: CSVDataReader, settings: ICSVDataSettings = {}){
    reader.cellSeparator = settings.separator || ",";
    const regexEmpty = /^\s*$/;
    var endRow: number;
    var startRow: number;
    var startCol: number = Number.MAX_VALUE;
    var endCol: number = 0;
    var found = false;
    OUT:
    while(reader.hasNext()) {
        var n = reader.next();
        while (n.hasNext()) {
            var val = n.next();
            if (!(regexEmpty.test(val))) {
                reader.index--;
                startRow = reader.index;
                endRow = reader.index;
                found = true;
                break OUT
            }
        }
    }
    if (!found){
        return null;
    }
    while (reader.hasNext()){
        var row = reader.next();
        while (row.hasNext()){
            var cell = row.next();
            if (!(regexEmpty.test(cell))) {
                startCol = Math.min(startCol, row.index - 1);
                endCol = Math.max(endCol, row.index - 1);
                endRow = reader.index - 1;
            }
        }
    }
    return {
        sr: startRow, er: endRow, sc: startCol, ec: endCol
    }
}

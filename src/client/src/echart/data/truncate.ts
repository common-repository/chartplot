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
 
export interface ISubtableCoords{
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
};

export function isSpecialCell(cell){
    return cell && typeof cell === "object";
}

export function truncateTable(table: any[][]): ITableMetaData{
    const regexEmpty = /^\s*$/;
    var endRow: number;
    var startRow: number;
    var startCol: number = Number.MAX_VALUE;
    var endCol: number = 0;
    var found = false;
    var rowToSpecial: {[s: number]: any} = {};
    var colToSpecial: {[s: number]: any} = {};
    OUT:
        for(var i=0; i < table.length; i++) {
            var n = table[i];
            for(var j=0; j < n.length; j++) {
                var val = n[j];
                var type = typeof val;
                if (type === "number" || (type === "string" && !(regexEmpty.test(val)))) {
                    startRow = i;
                    endRow = i;
                    found = true;
                    break OUT
                }
                else if (isSpecialCell(val)){
                    if (val.type === "row"){
                        rowToSpecial[i] = val;
                    }
                    else
                    {
                        colToSpecial[j] = val;
                    }
                }
            }
        }
    if (!found){
        return null;
    }
    var validColumns: any = {};
    for(; i < table.length; i++){
        var row = table[i];
        for(var j=0; j < n.length; j++){
            var cell = row[j];
            var type = typeof cell;
            if (type === "number" || (type === "string" && !(regexEmpty.test(cell)))) {
                startCol = Math.min(startCol, j);
                endCol = Math.max(endCol, j);
                endRow = i;
                validColumns[j] = true;
            }else if (isSpecialCell(cell)){
                if (cell.type === "row"){
                    rowToSpecial[i] = cell;
                }
                else
                {
                    colToSpecial[j] = cell;
                }
            }
        }
    }
    return {
        dataCoords: {
            startRow: startRow, endRow: endRow, startCol: startCol, endCol: endCol
        },
        data: table,
        validColumns: validColumns,
        rowToSpecial: rowToSpecial,
        colToSpecial: colToSpecial
    }
}

export interface ITableMetaData{

    dataCoords?: ISubtableCoords;
    data: any[][];
    validColumns?: {[s: number]: boolean};
    rowToSpecial: {[s: number]: any};
    colToSpecial: {[s: number]: any};

}

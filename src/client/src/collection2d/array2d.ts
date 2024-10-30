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
 
import {node} from "../../../reactive";
import stream, {IStream} from "../../../reactive/src/event";
import {SeriesDataCell} from "../component/echart/settings/series/data";
import {SeriesRowDataCell} from "../component/echart/settings/series/data/row";
import {SeriesColumnDataCell} from "../component/echart/settings/series/data/column";

export function getTableColumn<E>(table: E[][], position: number): E[]{
    const res: E[] = [];
    table.forEach(row => {
        res.push(row[position]);
    });
    return res;
}

export function addTableColumn<E>(table: E[][], col: E[], position: number){
    table.forEach((v, indx) => {
        v.splice(position, 0, col[indx]);
    });
}

export function removeTableColumn<E>(table: E[][], position: number){
    table.forEach((v, indx) => {
        v.splice(position, 1);
    });
}

export interface ITableChange<E>{

    type: "load" | "add-col" | "remove-col" | "add-row" | "remove-row" | "change";
    col?: number;
    row?: number;
    value?: any;
    colId?: number;

}

export interface IUpdateableTable<E>{

    data: E[][];
    change(changes: ITableChange<E>[]);
    getNrOfRows(): number;
    getNrOfCols(): number;
    onChange: IStream<ITableChange<E>[]>;
    getColumnId(column: number): number;
    getNextColumnId(): number;

}

export class UpdateableTable<E> implements IUpdateableTable<E>{

    $r = node();
    _data: E[][] = [];
    _columns: number[] = [];
    maxColNumber = 1;
    onChange = stream<ITableChange<E>[]>();

    get data(){
        this.$r.observed();
        return this._data;
    }

    set data(v){
        this.change([{
            type: "load",
            value: v
        }]);
    }

    get columns(){
        return this._columns;
    }

    set columns(cols: number[]){
        cols.forEach(c => {
            this.maxColNumber = Math.max(this.maxColNumber, c);
        })
        this._columns = cols;
    }

    getColumnId(column: number){
        return this._columns[column];
    }

    getColumnForId(colId: number){
        for (var i=0; i < this._columns.length; i++){
            var cid = this._columns[i];
            if (cid === colId){
                return i;
            }
        }
        return -1;
    }

    getNextColumnId(){
        this.maxColNumber++;
        return this.maxColNumber;
    }

    getNrOfRows(){
        return this.data.length;
    }

    getNrOfCols(){
        if (this.data.length === 0){
            return 0;
        }
        return this.data[0].length;
    }

    resetData(data: E[][], _columns: number[], maxColNumber: number){
        this._data = data;
        this._columns = _columns;
        this.maxColNumber = maxColNumber;
        this.onChange.fire([{
            type: "load",
            value: data
        }]);
        this.$r.changedDirty();
    }

    change(changes: ITableChange<E>[]){
        for (var i=0; i < changes.length; i++){
            const change = changes[i];
            switch(change.type){
                case "load":
                    this._data = change.value;
                    if (this.data.length > 0){
                        this._columns = [];
                        this.data[0].forEach(v => {
                            this._columns.push(this.getNextColumnId());
                        });
                    }
                    break;
                case "add-col":
                    addTableColumn(this._data, change.value, change.col);
                    const colId = change.colId || this.getNextColumnId();
                    this._columns.splice(change.col, 0, colId);
                    break;
                case "add-row":
                    this._data.splice(change.row, 0, change.value);
                    break;
                case "remove-col":
                    removeTableColumn(this._data, change.col);
                    change.colId = this._columns[change.col];
                    this._columns.splice(change.col, 1);
                    break;
                case "remove-row":
                    this._data.splice(change.row, 1);
                    break;
                case "change":
                    this._data[change.row][change.col] = change.value;
                    break;
            }
        }
        this.onChange.fire(changes);
        this.$r.changedDirty();
    }

    toJson(){
        return {
            data: this.data,
            columns: this._columns,
            maxColNumber: this.maxColNumber
        }
    }

    fromJson(c){
        this.data = c.data;
        this._columns = c.columns;
        this.maxColNumber = c.maxColNumber;
    }

}

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
 
import {variable} from "../../../../reactive";
import {extend} from "../../../../core";
import {IHtmlElementShape, IHtmlShape} from "../../../../html/src/html/node";
import {ITableChange, IUpdateableTable} from "../../collection2d/array2d";
import {SeriesDataCell} from "../echart/settings/series/data";
import {SeriesRowDataCell} from "../echart/settings/series/data/row";
import {SeriesColumnDataCell} from "../echart/settings/series/data/column";
import {factory} from "../../../../di";
import {isSpecialCell} from "../../echart/data/truncate";

declare var Handsontable;

export interface ISelection{
    srow: number;
    scol: number;
    erow: number;
    ecol: number;
}

export class DataTable{

    tag: string;
    node: IHtmlElementShape & IHtmlShape;
    table: any;
    first = true;
    private tableData: any[][];
    private externalChange = false;
    private internalChange = false;
    allowModifyColumns = true;
    attr = {
        class: "data-grid"
    }
    public r_selection = variable<ISelection>(null);

    get selection(){
        return this.r_selection.value;
    }

    set selection(v){
        this.r_selection.value = v;
    }

    constructor(public data: IUpdateableTable<any>){

    }

    getHandsomeOptions(){
        return  {};
    }

    @factory
    createRowCell(){
        return new SeriesRowDataCell();
    }

    @factory
    createColumnCell(){
        return new SeriesColumnDataCell();
    }

    selectCell(row, column){
        this.table.selectCell(row, column);
    }

    render(){
        const self = this;
        this.node.renderAttributes();
        this.node.renderProperties();
        this.node.renderStyles();
        this.node.renderEvents();
        if (!this.first){
            return;
        }
        this.table = null;
        this.externalChange = true;
        const tableData = this.data.data.map(arr => arr.slice(0)).slice(0);
        this.tableData = tableData;
        var specials = [];
        this.table = new Handsontable(this.node.element, extend({
            data: tableData,
            rowHeaders: true,
            colHeaders: true,
            undo: false,
            fillHandle: true,
            stretchH: 'all',
            contextMenu: true,
            outsideClickDeselects: false,
            allowInsertColumn: self.allowModifyColumns,
            allowRemoveColumn: self.allowModifyColumns,
            afterSelection: (row, col, row2, col2) => {
                this.selection = {
                    srow: Math.min(row, row2),
                    scol: Math.min(col, col2),
                    erow: Math.max(row, row2),
                    ecol: Math.max(col, col2)
                };
            },
            afterOnCellMouseDown: (event, coords, td) => {
            },
            afterDeselect: () => {
                this.selection = null;
            },
            beforeCopy: (data, coords) => {
                for (var i=0; i < data.length; i++){
                    var row = data[i];
                    for (var j=0; j < row.length; j++){
                        var cell = row[j];
                        if (isSpecialCell(cell)){
                            row[j] = "#@$_:"+JSON.stringify((<SeriesDataCell>cell).createConfig());
                        }
                    }
                }
            },
            beforePaste: (data, coords) => {
                /*for (var i=0; i < data.length; i++){
                    var row = data[i];
                    for (var j=0; j < row.length; j++){
                        var cell = row[j];
                        if (typeof cell === "string" && cell.indexOf("#@$_:") === 0){
                            row[j] = JSON.parse(cell.substring(5));
                        }
                    }
                }
                */
            },
            beforeChange: (changes) => {
                changes.forEach(c => {
                    var cell = c[3];
                    if (typeof cell === "string" && cell.indexOf("#@$_:") === 0){
                        var conf = JSON.parse(cell.substring(5));
                        if (conf.type === "row"){
                            var r = this.createRowCell();
                            r.applyConfig(conf);
                            c[3] = r;
                        }
                        else{
                            var col = this.createColumnCell();
                            col.applyConfig(conf);
                            c[3] = col;
                        }
                    }
                });
            },
            afterChange: (changes, source) => {
                if (this.externalChange){
                    return;
                }
                this.internalChange = true;
                this.data.change(changes.map(change => {
                    return {
                        row: change[0],
                        col: this.table.propToCol(change[1]),
                        value: change[3],
                        type: "change"
                    }
                }));
                this.internalChange = false;
            },
            afterRemoveRow: (index, amount) => {
                if (this.externalChange){
                    return;
                }
                this.internalChange = true;
                var changes:ITableChange<any>[] = [];
                for (var i=0; i < amount; i++){
                    changes.push({
                        type: "remove-row",
                        row: index
                    });
                }
                this.data.change(changes);
                this.internalChange = false;
            },
            afterRemoveCol: (index, amount) => {
                if (this.externalChange){
                    return;
                }
                this.internalChange = true;
                var changes:ITableChange<any>[] = [];
                for (var i=0; i < amount; i++){
                    changes.push({
                        type: "remove-col",
                        col: index,
                        colId: this.data.getColumnId(index + i)
                    });
                }
                this.data.change(changes);
                this.internalChange = false;
            },
            afterCreateCol: (index, amount, source) => {
                if (this.externalChange){
                    return;
                }
                this.internalChange = true;
                var changes:ITableChange<any>[] = [];
                for (var i=0; i < amount; i++){
                    changes.push({
                        type: "add-col",
                        value: new Array(this.data.getNrOfRows()),
                        col: index
                    });
                }
                this.data.change(changes);
                this.internalChange = false;
            },
            afterCreateRow: (index, amount, source) => {
                if (this.externalChange){
                    return;
                }
                this.internalChange = true;
                var changes:ITableChange<any>[] = [];
                for (var i=0; i < amount; i++){
                    changes.push({
                        type: "add-row",
                        value: new Array(this.data.getNrOfCols()),
                        row: index
                    });
                }
                this.data.change(changes);
                this.internalChange = false;
            },
            cells: (row, col) => {
                if (!this.data.data[row]){
                    return {
                        renderer: Handsontable.renderers.TextRenderer,
                        editor: "text"
                    }
                }
                return this.renderSpecialCells(row, col);
            }
        }, this.getHandsomeOptions()));
        this.externalChange = false;
        var table = this.table;
        table.addHook("beforeKeyDown", function(event: KeyboardEvent){
            self.handleKeyboardEvent(event);
        });
        this.table = table;
        this.first = false;
    }

    protected handleKeyboardEvent(event: KeyboardEvent){
        var table = this.table;
        const self = this;
        if (event.key === "ArrowDown"){
            var sel = table.getSelected();
            if (Array.isArray(sel)){
                var er = sel[0][2];
                if (er === table.getData().length - 1){
                    table.alter("insert_row", er+1);
                }
            }

        }
        else if (event.key === "ArrowRight" && self.allowModifyColumns){
            var sel = table.getSelected();
            if (Array.isArray(sel)){
                var ec = sel[0][3];
                if (ec === table.getData()[0].length - 1){
                    table.alter("insert_col", ec+1);
                }
            }
        }
        else if (event.key === "ArrowLeft" && self.allowModifyColumns){
            var sel = table.getSelected();
            if (Array.isArray(sel)){
                var ec = sel[0][3];
                if (ec === 0){
                    table.alter("insert_col", 0);
                }
            }
        }
        else if (event.key === "ArrowUp"){
            var sel = table.getSelected();
            if (Array.isArray(sel)){
                var er = sel[0][2];
                if (er === 0){
                    table.alter("insert_row", 0);
                }
            }
        }
    }

    private listener: any;

    protected renderSpecialCells(row, col){
        var v = this.data.data[row][col];
        if (isSpecialCell(v)) {
            if (v.type === "row") {
                return this.renderRowSpecialCell(v);
            }
            else if (v.type === "column") {
                return this.renderColumnSpecialCell(v);
            }
        }
        return {
            renderer: Handsontable.renderers.TextRenderer,
            editor: "text"
        }
    }

    protected renderRowSpecialCell(v){
        return {
            renderer: function (hotInstance, td, row, column, prop, value, cellProperties) {
                var name = v.name || "Settings";
                td.innerHTML = '<div style="text-align: center" ><span style="display: inline-block" class="icon icon-arrow-thick-right")></span> '+name+'</div>';
                td.style.background = '#CEC';
            },
            editor: false
        }
    }

    protected renderColumnSpecialCell(v){
        return {
            renderer: function (hotInstance, td, row, column, prop, value, cellProperties) {
                var name = v.name || "Settings";
                td.innerHTML = '<div style="text-align: center"><span style="display: inline-block" class="icon icon-arrow-thick-down")></span> '+name+'</div>';
                td.style.background = '#CEC';
            },
            editor: false
        }
    }

    onAttached(){
        this.listener = (changes: ITableChange<any>[]) => {
            if (!this.table){
                return;
            }
            if (this.internalChange){
                return;
            }
            this.externalChange = true;
            changes.forEach(change => {
                switch (change.type){
                    case "load":
                        this.table.loadData(change.value.map(s => s.slice(0)));
                        break;
                    case "add-col":
                        this.table.alter("insert_col", change.col, 1);
                        this.table.spliceCol.apply(this.table, [change.col, 0, change.value.length].concat(change.value.slice(0)));
                        break;
                    case "remove-col":
                        this.table.alter("remove_col", change.col, 1);
                        break;
                    case "add-row":
                        this.table.alter("insert_row", change.row, 1);
                        this.table.spliceRow.apply(this.table, [change.row, 0, change.value.length].concat(change.value.slice(0)));
                        break;
                    case "remove-row":
                        this.table.alter("remove_row", change.row, 1);
                        break;
                    case "change":
                        this.tableData[change.row][change.col] = change.value;
                        this.table.render();
                        break;
                }
            });
            this.externalChange = false;
        };
        this.data.onChange.observe(this.listener);
    }

    onDetached(){
        var table = this.table;
        table && table.destroy();
        this.table = null;
        this.first = true;
        this.data.onChange.unobserve(this.listener);
    }

    rerender(){
        var table = this.table;
        table && table.render();
    }

}

DataTable.prototype.tag = "div";

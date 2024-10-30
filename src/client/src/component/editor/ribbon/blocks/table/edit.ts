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
 
import {RibbonContentSection} from "../../base";
import {BigRibbonButton, MiddleRibbonButton, NormalRibbonButton} from "../../blocks";
import {getIconShape, IconSet} from "../../../../icon";
import {create, init, inject} from "../../../../../../../di";
import {DataTable} from "../../../../table/basic";
import {IUpdateableTable, UpdateableTable} from "../../../../../collection2d/array2d";
import {TextInput} from "../input";
import {TableDataChangeHistoryCommand} from "../../../../history/table";
import {ChartHistory} from "../../../../history";
import {RowColumnTable} from "../../../../table/data";

export class EditDataRibbonSection extends RibbonContentSection {

    label = "edit";

    @create(() => new AddTableColumnLeftButton())
    addColumn: AddTableColumnLeftButton;

    @create(() => new AddTableRowAboveButton())
    addRow: AddTableRowAboveButton;

    @create(() => new AddTableRowBelowButton())
    addRowBelow: AddTableRowBelowButton;

    @create(() => new AddTableColumnRightButton())
    addColumnRight: AddTableColumnRightButton;

    @create(() => new RemoveTableColumnButton())
    removeColumn: RemoveTableColumnButton;

    @create(() => new RemoveTableRowButton())
    removeRow: RemoveTableRowButton;

    @create(() => new ResetTableRowButton())
    resetTable: ResetTableRowButton;

    @create(() => new TableValueInput())
    value: TableValueInput;

    @create(() => new DeleteCellsButton())
    delete: DeleteCellsButton;


    getContents(): any[]{
        var d1 = this.tripleSurface({
            top: this.addColumn,
            middle: this.addColumnRight,
            bottom: this.removeColumn
        });
        var d2 = this.tripleSurface({
            top: this.addRow,
            middle: this.addRowBelow,
            bottom: this.removeRow
        });
        var d3 = this.tripleSurface({
            top: this.value,
            middle: this.resetTable,
            bottom: this.delete
        })
        return [d1, d2, d3];
    }

    get contents(){
        return this.getContents();
    }


}

export class AddTableColumnLeftButton extends NormalRibbonButton {

    @inject
    table: DataTable;

    @inject
    data: UpdateableTable<any>

    icon = getIconShape(IconSet.table_add_row_left)
    label = ['left']

    get disabled(){
        const sel = this.table.selection;
        return !sel || sel.srow !== sel.erow || sel.scol !== sel.ecol;
    }

    @init
    init(){
        super.init();
        this.onClick.observe(ev => {
            const nrOfCols = this.data.getNrOfRows();
            this.data.change([{
                type: "add-col",
                col: this.table.selection.scol,
                value: new Array(nrOfCols)
            }])
        });
    }

    tooltip = {
        tag: "html",
        child: `<p>Adds a new column at the left side of the currently selected cell.</p>`
    }

}

export class AddTableColumnRightButton extends NormalRibbonButton {

    @inject
    table: DataTable;

    @inject
    data: UpdateableTable<any>

    icon = getIconShape(IconSet.table_add_row_right)
    label = ['right']

    get disabled(){
        const sel = this.table.selection;
        return !sel || sel.srow !== sel.erow || sel.scol !== sel.ecol;
    }

    @init
    init(){
        super.init();
        this.onClick.observe(ev => {
            const nrOfCols = this.data.getNrOfRows();
            this.data.change([{
                type: "add-col",
                col: this.table.selection.scol+1,
                value: new Array(nrOfCols)
            }])
        });
    }

    tooltip = {
        tag: "html",
        child: `<p>Adds a new column at the right side of the currently selected cell.</p>`
    }

}

export class AddTableRowAboveButton extends NormalRibbonButton {

    @inject
    table: DataTable;

    @inject
    data: UpdateableTable<any>

    icon = getIconShape(IconSet.table_add_column_above)
    label = ['above']

    get disabled(){
        const sel = this.table.selection;
        return !sel || sel.srow !== sel.erow || sel.scol !== sel.ecol;
    }

    @init
    init(){
        super.init();
        this.onClick.observe(ev => {
            const nr = this.data.getNrOfCols();
            this.data.change([{
                type: "add-row",
                row: this.table.selection.srow,
                value: new Array(nr)
            }])
        });
    }

    tooltip = {
        tag: "html",
        child: `<p>Adds a new row at the top side of the currently selected cell.</p>`
    }
}

export class AddTableRowBelowButton extends NormalRibbonButton {

    @inject
    table: DataTable;

    @inject
    data: UpdateableTable<any>

    icon = getIconShape(IconSet.table_add_column_below)
    label = ['below']

    get disabled(){
        const sel = this.table.selection;
        return !sel || sel.srow !== sel.erow || sel.scol !== sel.ecol;
    }

    @init
    init(){
        super.init();
        this.onClick.observe(ev => {
            const nr = this.data.getNrOfCols();
            this.data.change([{
                type: "add-row",
                row: this.table.selection.srow+1,
                value: new Array(nr)
            }])
        });
    }

    tooltip = {
        tag: "html",
        child: `<p>Adds a new row at the bottom side of the currently selected cell.</p>`
    }
}

export class RemoveTableColumnButton extends NormalRibbonButton {

    @inject
    table: DataTable;

    @inject
    data: UpdateableTable<any>

    icon = getIconShape(IconSet.table_remove_columns)
    label = ['columns']

    get disabled(){
        const sel = this.table.selection;
        return !sel;
    }

    getClass(){
        return super.getClass()+" red";
    }

    @init
    init(){
        super.init();
        this.onClick.observe(ev => {
            const changes = [];
            for (var i=this.table.selection.scol; i <= this.table.selection.ecol; i++){
                changes.push({
                    type: "remove-col",
                    col: this.table.selection.scol,
                    colId: this.data.getColumnId(i)
                });
            }
            this.data.change(changes);
        });
    }

    tooltip = {
        tag: "html",
        child: `<p>Removes the currently selected columns</p>`
    }

}


export class RemoveTableRowButton extends NormalRibbonButton {

    @inject
    table: DataTable;

    @inject
    data: UpdateableTable<any>;


    icon = getIconShape(IconSet.table_remove_rows)
    label = ['rows']

    get disabled(){
        const sel = this.table.selection;
        return !sel;
    }

    getClass(){
        return super.getClass()+" red";
    }

    @init
    init(){
        super.init();
        this.onClick.observe(ev => {
            const changes = [];
            for (var i=this.table.selection.srow; i <= this.table.selection.erow; i++){
                changes.push({
                    type: "remove-row",
                    row: this.table.selection.srow
                });
            }
            this.data.change(changes);
        });
    }

    tooltip = {
        tag: "html",
        child: `<p>Removes the currently selected rows</p>`
    }
}

export class ResetTableRowButton extends NormalRibbonButton {

    @inject
    data: UpdateableTable<any>;

    reset = [["","","","",""],
        ["","","","",""],
        ["","","","",""],
        ["","","","",""],
        ["","","","",""],
        ["","","","",""],
        ["","","","",""],
        ["","","","",""],
        ["","","","",""]]

    icon = getIconShape(IconSet.reload_alt)
    label = ['reset']

    @init
    init(){
        super.init();
        this.onClick.observe(ev => {
            this.data.change([{
                type: "load",
                value: this.reset
            }]);
        });
    }

    tooltip = {
        tag: "html",
        child: `<p>Resets the table</p>`
    }
}

export class TableValueInput extends TextInput{

    @inject
    data: UpdateableTable<any>;

    @inject
    table: DataTable;

    get disabled(){
        const sel = this.table.selection;
        return !sel || sel.srow !== sel.erow || sel.scol !== sel.ecol;
    }

    get value(){
        if (this.disabled){
            return "";
        }
        var sel = this.table.selection;
        var r = this.data.data[sel.srow]
        if (!r){
            return "";
        }
        return r[sel.scol];
    }

    set value(v){
        if (!this.disabled){
            if (this.value !== v){
                var sel = this.table.selection;
                this.data.change([{
                    type: "change",
                    col: sel.scol,
                    row: sel.srow,
                    value: v
                }]);
            }
        }
    }

    tooltip = {
        tag: "html",
        child: `<p>The value of the currently selected cell. Can be changed here or directly inside the table.</p>`
    }

}

export class DeleteCellsButton extends NormalRibbonButton{

    @inject
    data: UpdateableTable<any>;

    @inject
    table: DataTable;

    label = "delete";
    icon = getIconShape(IconSet.bin);

    @inject
    history: ChartHistory;

    getClass(){
        return super.getClass()+" red";
    }

    @init
    init(){
        super.init();
        this.onClick.observe(ev => {
            var changes = [];
            let sel = this.table.selection;
            if (sel){
                for (var i=sel.srow; i <= sel.erow; i++){
                    for (var j=sel.scol; j <= sel.ecol; j++){
                        changes.push({
                            type: "change",
                            col: j,
                            row: i,
                            value: ""
                        });
                    }
                }
                this.data.change(changes);
            }

        });
    }

    get disabled(){
        var sel = this.table.selection;
        if (sel){
            return false;
        }
        return true;
    }

    tooltip = {
        tag: "html",
        child: `<p>Delete the currently selected cells.</p>`
    }

}

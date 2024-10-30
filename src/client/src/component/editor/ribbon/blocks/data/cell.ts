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
 
import {NormalRibbonButton} from "../index";
import {getIconShape, IconSet} from "../../../../icon";
import {IUpdateableTable} from "../../../../../collection2d/array2d";
import {RowColumnTable} from "../../../../table/data";
import {create, factory, init, inject} from "../../../../../../../di";
import {ChartHistory} from "../../../../history";
import {TableDataChangeHistoryCommand} from "../../../../history/table";
import {TripleSurface} from "../surface";
import {SeriesRowDataCell} from "../../../../echart/settings/series/data/row";
import {SeriesColumnDataCell} from "../../../../echart/settings/series/data/column";
import {TooltipBlock} from "../tooltip";

export class ModifyTableCellsTriple extends TripleSurface{

    constructor(public data: IUpdateableTable<any>, public table: RowColumnTable){
        super();
    }

    @create(function(this: ModifyTableCellsTriple){
        return new CreateRowCellButton(this.data, this.table);
    })
    row: CreateRowCellButton

    @create(function(this: ModifyTableCellsTriple){
        return new CreateColumnCellButton(this.data, this.table);
    })
    col: CreateColumnCellButton

    get top(){
        return this.row;
    }

    get middle(){
        return this.col;
    }

}

export class CreateRowCellButton extends NormalRibbonButton{

    constructor(public data: IUpdateableTable<any>, public table: RowColumnTable){
        super();
    }

    label = "row";
    icon = getIconShape(IconSet.arrow_thick_right);

    @inject
    history: ChartHistory;

    @factory
    createRowCell(){
        return new SeriesRowDataCell();
    }

    @init
    init(){
        super.init();
        this.onClick.observe(ev => {
            this.history.executeCommand(new TableDataChangeHistoryCommand(this.data, this.createRowCell(), this.table.selection.srow, this.table.selection.scol));
        });
    }

    get disabled(){
        var sel = this.table.selection;
        if (sel){
            if (sel.scol === sel.ecol && sel.srow === sel.erow){
                return false;
            }
        }
        return true;
    }

    tooltip = new TooltipBlock({title: "Create row cell", content: {
            tag: 'html',
            child: `
<p>Transforms the currently selected cell into a row settings cell. Allows you to specify settings specific to this row, like changing the color of the shape rendering the data on this row.</p>
        `
        }})

}

export class CreateColumnCellButton extends NormalRibbonButton{

    constructor(public data: IUpdateableTable<any>, public table: RowColumnTable){
        super();
    }

    label = "column";
    icon = getIconShape(IconSet.arrow_thick_down);

    @inject
    history: ChartHistory;

    @factory
    createColumnCell(){
        return new SeriesColumnDataCell();
    }

    @init
    init(){
        super.init();
        this.onClick.observe(ev => {
            this.history.executeCommand(new TableDataChangeHistoryCommand(this.data, this.createColumnCell(), this.table.selection.srow, this.table.selection.scol));
        });
    }

    get disabled(){
        var sel = this.table.selection;
        if (sel){
            if (sel.scol === sel.ecol && sel.srow === sel.erow){
                return false;
            }
        }
        return true;
    }

    tooltip = new TooltipBlock({title: "Create column cell", content: {
            tag: 'html',
            child: `
<p>Transforms the currently selected cell into a column settings cell. Allows you to specify settings specific to this column.</p>
        `
        }});

}

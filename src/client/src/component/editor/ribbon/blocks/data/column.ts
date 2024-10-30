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
 
import {RibbonSelectButton} from "../index";
import {LabelSelectListItem, SelectList} from "../../../../list/select";
import {IUpdateableTable} from "../../../../../collection2d/array2d";
import {RowColumnTable} from "../../../../table/data";
import {inject} from "../../../../../../../di";
import {ChartHistory} from "../../../../history";
import {TableDataChangeHistoryCommand} from "../../../../history/table";
import {SeriesColumnDataCell} from "../../../../echart/settings/series/data/column";
import {ValueHistory} from "../../../../history/value";

export class ColumnTypeSelect extends RibbonSelectButton{

    constructor(public cell: SeriesColumnDataCell){
        super();
    }

    types = [{name: "Value", value: "value"}, {name: "Name", value: "name"}];
    default = "value";

    @inject
    history: ChartHistory;

    get label(){
        return this.cell.colType || "value";
    }

    getContent(){
        var sel = new SelectList();
        this.types.forEach(t => {
            sel.items.push(new LabelSelectListItem(t.name).setAction(ev => {
                this.history.executeCommand(new ValueHistory(this.cell.r_colType, t.value));
            }));
        });
        return sel;
    }

}

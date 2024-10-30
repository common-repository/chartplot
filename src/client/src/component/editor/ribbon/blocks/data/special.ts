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
 
import {TextInput} from "../input";
import {IUpdateableTable} from "../../../../../collection2d/array2d";
import {inject} from "../../../../../../../di";
import {ChartHistory} from "../../../../history";
import {TableDataChangeHistoryCommand} from "../../../../history/table";
import {RowColumnTable} from "../../../../table/data";
import {SeriesDataCell} from "../../../../echart/settings/series/data";
import {ValueHistory} from "../../../../history/value";

export class SpecialCellNameInput extends TextInput{

    constructor(public cell: SeriesDataCell){
        super();
    }

    label = "name";

    @inject
    history: ChartHistory;

    get value(){
        return this.cell.name || "";
    }

    set value(v){
        if (v !== this.cell.name){
            this.history.executeCommand(new ValueHistory(this.cell.r_name, v));
        }
    }

}

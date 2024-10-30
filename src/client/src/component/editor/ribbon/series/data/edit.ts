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
 
import {RowColumnTable} from "../../../../table/data";
import {EChartSeriesSettings} from "../../../../echart/settings/series";
import {EditDataRibbonSection} from "../../blocks/table/edit";
import {create, factory, inject} from "../../../../../../../di";
import {Editor} from "../../../index";
import {ModifyTableCellsTriple} from "../../blocks/data/cell";

export class SeriesDataEditSection extends EditDataRibbonSection {

    @inject
    editor: Editor

    @inject
    table: RowColumnTable

    @inject
    series: EChartSeriesSettings

    @factory
    createCellsModify(){
        return new ModifyTableCellsTriple(this.series.data, this.table);
    }

    @create(function(this: SeriesDataEditSection){
        return this.series.changeableData;
    })
    data;

    getContents(){
        var res = super.getContents();
        var sel = this.table.selection;
        res.push(this.createCellsModify());
        return res;
    }

}

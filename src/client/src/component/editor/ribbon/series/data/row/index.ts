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
 
import {RowColumnTable} from "../../../../../table/data";
import {SpecialCellNameInput} from "../../../blocks/data/special";
import {EChartSeriesSettings} from "../../../../../echart/settings/series";
import {RibbonContentSection} from "../../../base";
import {TripleSurface} from "../../../blocks/surface";
import {create, inject} from "../../../../../../../../di";
import {SeriesRowDataCell} from "../../../../../echart/settings/series/data/row";
import {TooltipBlock} from "../../../blocks/tooltip";

export class SeriesDataRowSection extends RibbonContentSection{

    @create(() => new FirstTriple())
    first: FirstTriple;

    @inject
    table: RowColumnTable;

    @inject
    series: EChartSeriesSettings;

    @create(function(this: SeriesDataRowSection){
        var s = this.table.selection;
        return this.series.data.data[s.srow][s.scol];
    })
    row: SeriesRowDataCell;

    get contents(){
        return [this.first];
    }

    label = "row"

}

class FirstTriple extends TripleSurface{

    @inject
    table: RowColumnTable;

    @inject
    series: EChartSeriesSettings;

    @inject
    row: SeriesRowDataCell;

    @create(function(this: FirstTriple){
        var r = new SpecialCellNameInput(this.row);
        r.tooltip = new TooltipBlock({title: "Row name", content: "A name for this row setting cell. Will be shown in the table, but has no function otherwise."})
        return r;
    })
    name: SpecialCellNameInput;


    get top(){
        return this.name;
    }

}

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
import {RowColumnTable} from "../../../../table/data";
import {create, define, inject} from "../../../../../../../di";
import {EChartSeriesSettings} from "../../../../echart/settings/series";
import {SpecialCellNameInput} from "../../blocks/data/special";
import {TripleSurface} from "../../blocks/surface";
import {ColumnTypeSelect} from "../../blocks/data/column";
import {SeriesColumnDataCell} from "../../../../echart/settings/series/data/column";
import {TooltipBlock} from "../../blocks/tooltip";

export class SeriesDataColumnSection extends RibbonContentSection{

    constructor(cell: SeriesColumnDataCell){
        super();
        this.cell = cell;
    }

    @inject
    table: RowColumnTable;

    @inject
    series: EChartSeriesSettings;

    @create(() => new FirstTriple())
    first: FirstTriple;

    @define
    cell: SeriesColumnDataCell;

    get contents(){
        return [this.first];
    }

    label = "column"

}

class FirstTriple extends TripleSurface{

    @inject
    cell: SeriesColumnDataCell;

    @create(function(this: FirstTriple){
        var r = new SpecialCellNameInput(this.cell);
        r.tooltip = new TooltipBlock({title: "Column name", content: "A name for this column setting cell. Will be shown in the table, but has no function otherwise."})
        return r;
    })
    name: SpecialCellNameInput;

    @inject
    series: EChartSeriesSettings;

    @create(function(this: FirstTriple){
        var type = new ColumnTypeSelect(this.cell);
        if (this.series.type === "scatter" || this.series.type === "effectScatter"){
            type.types.push({name: "Radius", value: "radius"});
        }
        type.types.push({name: "Ignore", value: "ignore"});
        type.tooltip = new TooltipBlock({title: "Column type", content: {
            tag: "html",
            child: `
The column type.
<ul class="bullet">
<li><b>Value: </b> This column represents series data. This is the default column type if a column has not settings defined.</li>
<li><b>Name: </b> This column represents the name of the data in each row. Useful for e.g. pie charts, to define the label of each data value.</li>
<li><b>Radius: </b> This column represents the radius of the rendered data item in each row. Generally used in scatter charts to be rendered as bubble charts.</li>
<li><b>Ignore: </b> This column will be ignored.</li>
</ul>
            `
            }});
        return type;
    })
    colType: ColumnTypeSelect;


    get top(){
        return this.name;
    }

    get middle(){
        return this.colType;
    }

}

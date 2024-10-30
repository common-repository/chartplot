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
 
import {ChartDataSelectRowTable} from "../../../../echart/view/dataset";
import {create, init, inject} from "../../../../../../../di";
import {GridAxis} from "../../../../echart/settings/coordinates/grid/axis";
import {RibbonContentSection, RibbonTab} from "../../base";
import {RibbonOptions} from "../../../settings/options/ribbon";
import {EditorSettings} from "../../../settings";
import {RowColumnTable} from "../../../../table/data";
import {procedure} from "../../../../../../../reactive";
import {IProcedure} from "../../../../../../../reactive/src/procedure";
import {Editor} from "../../../index";
import {DataSourceSelect} from "../../blocks/data/source";
import {CategoriesDataEditSection} from "./data/edit";
import {AxisRibbonTab} from "./index";
import {TooltipBlock} from "../../blocks/tooltip";
import {DataTableHolder} from "../../../../table/holder";

export class AxisCategoriesTab extends RibbonTab{

    name = "Categories"

    @inject
    editorSettings: EditorSettings;

    @inject
    editor: Editor

    @inject
    axis: GridAxis;

    @create(function(this: AxisCategoriesTab){
        return new AxisFocusedDatasetTable(this.editorSettings.chart.dataset.sourceTable);
    })
    chartTable: AxisFocusedDatasetTable;

    @create(function(this: AxisCategoriesTab){
        return new CategoriesTable(this.axis.changeableData);
    })
    table: CategoriesTable;

    @create(() => new SourceSection())
    source: SourceSection;

    @create(() => {
        var res = new CategoriesDataEditSection();
        return res;
    })
    edit: CategoriesDataEditSection;

    tooltip = new TooltipBlock({title: "Axis categories", content: "Settings for the categories that axis will show."})

    private _proc: IProcedure[] = [];

    get contents(){
        switch(this.axis.dataSource){
            case "table":
                return [this.source, this.edit];
            default:
                return [this.source];

        }
    }

    @create(function(this: AxisCategoriesTab){
        var secs = this.editor.menu.ribbon.sections.get(0);
        return <AxisRibbonTab>secs.tabs.get(0);
    })
    axisTab: AxisRibbonTab;

    activate(){
        this.axisTab.activate();
        this._proc.push(procedure(p => {
            if (this.axis.dataSource === "table"){
                this.editor.content.activateDataSplit(new DataTableHolder(this.table));
            }
            else if (this.axis.dataSource === "chart"){
                this.editor.content.activateDataSplit(new DataTableHolder(this.chartTable));
            }
            else
            {
                this.editor.content.activateDataSplit(null);
            }
        }));
        this._proc.push(procedure(() => {
            this.axis.columnId;
            this.chartTable.rerender();
        }));
    }

    deactivate(){
        this.axisTab.deactivate();
        this._proc.forEach(p => p.cancel());
        this.editor.content.activateDataSplit(null);
    }

    additionalIndexes = [RibbonOptions.COORDINATE_RIBBON_INDEX, RibbonOptions.COORDINATE_AXES]

    @init
    init(){
        this.edit.resetTable.reset = [[""],[""],[""],[""],[""],[""],[""]];
    }


}

class SourceSection extends RibbonContentSection{

    label = "source";

    @create(() => new CategoriesSourceSelect())
    select: CategoriesSourceSelect;

    get contents(){
        return [this.select];
    }

}

class CategoriesSourceSelect extends DataSourceSelect{

    @inject
    axis: GridAxis

    get dataSourceType(){
        return this.axis.dataSource;
    }

    set dataSourceType(t){
        this.axis.dataSource = t;
    }

    hasAuto(){
        return true;
    }

    hasExternal(){
        return false;
    }

    tooltip = new TooltipBlock({title: "Data source", content:{tag: "html", child: `
    Where to get the categories from.
    <ul class="bullet">
        <li><b>Auto: </b>The categories will be automatically determined based on chart data and series.</li>
        <li><b>Table: </b>Manually input the categories into the table below.</li>
        <li><b>Chart: </b>The categories will be taken from the chart data table. Click on the column header in the table below to select what column to use for categories.</li>
    </ul>
    `}})

}

class CategoriesTable extends RowColumnTable{

    allowModifyColumns = false;

}

export class AxisFocusedDatasetTable extends ChartDataSelectRowTable {

    @inject
    axis: GridAxis;

    get columnSettings(){
        return this.axis;
    }

}

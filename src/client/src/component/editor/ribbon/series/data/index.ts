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
 
import {RibbonTab} from "../../base";
import {create, factory, inject} from "../../../../../../../di";
import {EChartSeriesSettings} from "../../../../echart/settings/series";
import {EditorSettings} from "../../../settings";
import {SeriesDataSourceSection} from "./source";
import {Editor} from "../../../index";
import {procedure} from "../../../../../../../reactive";
import {IProcedure} from "../../../../../../../reactive/src/procedure";
import {SeriesFocusedDatasetTable} from "../../../../echart/view/dataset";
import {SeriesDataEditSection} from "./edit";
import {HistoryUpdateableTable} from "../../../../history/table";
import {SeriesImportSection} from "./import";
import {ChartHistory} from "../../../../history";
import {RibbonOptions} from "../../../settings/options/ribbon";
import {SeriesDataColumnSection} from "./column";
import {SeriesDataRowSection} from "./row";
import {SeriesRowColumnTable} from "./table";
import {TooltipBlock} from "../../blocks/tooltip";
import {isSpecialCell} from "../../../../../echart/data/truncate";
import {DataTableHolder} from "../../../../table/holder";

export class SeriesDataRibbonTab extends RibbonTab{

    @inject
    editorSettings: EditorSettings;

    @inject
    editor: Editor;

    @inject
    history: ChartHistory;

    @create(() => new SeriesDataSourceSection())
    source: SeriesDataSourceSection;

    @create(() => new SeriesDataEditSection())
    edit: SeriesDataEditSection

    @create(() => new SeriesImportSection())
    import: SeriesImportSection;

    @create(() => new SeriesDataRowSection())
    row: SeriesDataRowSection;

    @factory
    createRow(){
        return new SeriesDataRowSection();
    }

    @factory
    createColumn(){
        var s = this.table.selection;
        return new SeriesDataColumnSection(this.series.data.data[s.srow][s.scol]);
    }

    name = "Data"

    tooltip = new TooltipBlock({title: "Series data", content: {
            tag: "html",
            child: `
            Data settings for this series. 
        `
        }})

    protected getContents(){
        switch(this.series.dataSourceType){
            case "chart":
                return [this.source];
            default:
                var res: any[] = [this.source, this.import, this.edit];
                const sel = this.table.selection;
                if (sel && sel.scol === sel.ecol && sel.srow === sel.erow){
                    var row = this.table.data.data[sel.srow];
                    if (row){
                        var cell = row[sel.scol];
                        if (isSpecialCell(cell)){
                            if (cell.type === "column"){
                                res.push(this.createColumn());
                            }
                            else {
                                res.push(this.createRow());
                            }
                        }
                    }
                }
                return res;
        }
    }

    get contents(){
        return this.getContents();
    }

    @inject
    series: EChartSeriesSettings;

    @create(function(this: SeriesDataRibbonTab){
        return new SeriesRowColumnTable(this.series.changeableData);
    })
    table: SeriesRowColumnTable;

    @create(function(this: SeriesDataRibbonTab){
        return new SeriesFocusedDatasetTable(new HistoryUpdateableTable(this.editorSettings.chart.dataset.sourceTable, this.history));
    })
    chartTable: SeriesFocusedDatasetTable;

    private _proc: IProcedure[] = [];

    activate(){
        this._proc.push(procedure(p => {
            this.splitEditorContent();
        }));
    }

    protected splitEditorContent(){
        if (this.series.dataSourceType === "table"){
            this.editor.content.activateDataSplit(new DataTableHolder(this.table));
        }
        else if (this.series.dataSourceType === "chart"){
            this.editor.content.activateDataSplit(new DataTableHolder(this.chartTable));
        }
        else
        {
            this.editor.content.activateDataSplit(null);
        }
    }

    additionalIndexes = [RibbonOptions.SERIES_RIBBON_INDEX]

    deactivate(){
        this._proc.forEach(p => p.cancel());
        this.editor.content.activateDataSplit(null);
        this._proc = [];
    }

}

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
 
import {RowColumnTable} from "../../../table/data";
import {IUpdateableTable} from "../../../../collection2d/array2d";
import {inject} from "../../../../../../di";
import {EChartSeriesSettings} from "../../settings/series";
import {EditorSettings} from "../../../editor/settings";
import {ChartHistory} from "../../../history";
import {ValueHistory} from "../../../history/value";
import {IReactiveVariable} from "../../../../../../reactive/src/variable";

export class EChartDatasetTable extends RowColumnTable{

    constructor(data: IUpdateableTable<any>){
        super(data);
    }

}

declare var Handsontable: any;

export interface ISettingsWithColumnId{

    r_columnId: IReactiveVariable<number>;

}

export abstract class ChartDataSelectRowTable extends EChartDatasetTable{

    abstract columnSettings: ISettingsWithColumnId;

    @inject
    editorSettings: EditorSettings;

    @inject
    history: ChartHistory;

    getHandsomeOptions(){
        const self = this;
        const renderer = this.firstRowRenderer.bind(this);
        return {
            contextMenu: false,
            cells: function(row, column, prop){
                return {
                    renderer: renderer
                }
            },
            selectionMode: "single",
            afterOnCellMouseDown: (event, coords, td) => {
                this.selectColumn(event, coords, td);
            }
        };
    }

    selectColumn(event, coords, td){
        if (coords.row === -1 && coords.col >= 0){
            this.history.executeCommand(new ValueHistory(this.columnSettings.r_columnId, this.editorSettings.chart.dataset.sourceTable.getColumnId(coords.col)));
        }
    }

    firstRowRenderer(instance, td, row, col, prop, value, cellProperties){
        const self = this;
        const colId = self.editorSettings.chart.dataset.sourceTable.getColumnId(col);
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        if (colId === self.columnSettings.r_columnId.value){
            return;
        }
        td.style.fontWeight = 'bold';
        td.style.background = '#EEE';
        td.style.opacity = 0.5;
    }

}

export class SeriesFocusedDatasetTable extends ChartDataSelectRowTable {

    @inject
    series: EChartSeriesSettings;

    get columnSettings(){
        return this.series;
    }

    firstRowRenderer(instance, td, row, col, prop, value, cellProperties){
        const self = this;
        var colId = self.editorSettings.chart.dataset.getParsedColumnForId(self.editorSettings.chart.dataset.sourceTable.getColumnId(col));
        const si = self.editorSettings.chart.dataset.getSeriesInfoByColumnIndex(colId);
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        if (si){
            var pi = self.editorSettings.chart.dataset.getParsedColumnForId(self.columnSettings.r_columnId.value);
            if (pi >= si.startIndex && pi <= si.endIndex){
                return;
            }
        }
        td.style.fontWeight = 'bold';
        td.style.background = '#EEE';
        td.style.opacity = 0.5;
    }

    selectColumn(event, coords, td){
        if (coords.row === -1 && coords.col >= 0){
            var colIndx = this.editorSettings.chart.dataset.getParsedColumnForId(this.editorSettings.chart.dataset.sourceTable.getColumnId(coords.col));
            const si = this.editorSettings.chart.dataset.getSeriesInfoByColumnIndex(colIndx);
            if (si){
                this.history.executeCommand(new ValueHistory(this.columnSettings.r_columnId, si.colId));
            }
        }
    }

}

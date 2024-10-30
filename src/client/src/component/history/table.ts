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
 
import {ChartHistory, HistoryCommandGroup, IHistoryCommand} from "./index";
import {getTableColumn, ITableChange, IUpdateableTable, UpdateableTable} from "../../collection2d/array2d";
import {factory, inject} from "../../../../di";
import {EChartSettings} from "../echart/settings";
import {IParsedSeries} from "../echart/settings/dataset";
import {InsertArrayItemCommand, RemoveArrayItemCommand} from "./array";
import {EditorSettings} from "../editor/settings";

export class TableDataLoadHistoryCommand implements IHistoryCommand{

    private old: any[][];
    private _columnIds: number[];
    private maxNumber: number;

    constructor(public source: IUpdateableTable<any>, public change: any[][]){

    }

    undo(){
        (<UpdateableTable<any>>this.source).resetData(this.old, this._columnIds, this.maxNumber);
    }

    do(){
        this.old = this.source.data;
        this._columnIds = (<UpdateableTable<any>>this.source)._columns;
        this.maxNumber = (<UpdateableTable<any>>this.source).maxColNumber;
        this.source.change([{
            type: "load",
            value: this.change
        }]);
    }

}

export class TableDataChangeHistoryCommand implements IHistoryCommand{

    private old: any;

    constructor(public source: IUpdateableTable<any>, public change: any, public row: number, public col: number){

    }

    undo(){
        this.source.change([{
            type: "change",
            row: this.row,
            col: this.col,
            value: this.old
        }]);
    }

    do(){
        this.old = this.source.data[this.row][this.col];
        this.source.change([{
            type: "change",
            row: this.row,
            col: this.col,
            value: this.change
        }]);
    }
}

export class TableDataAddColumnCommand implements IHistoryCommand{

    private colId: number;


    constructor(public source: IUpdateableTable<any>, public col: any[], public position: number){
        this.colId = this.source.getNextColumnId();
    }

    undo(){
        this.source.change([{
            type: "remove-col",
            col: this.position
        }]);
    }

    do() {
        this.source.change([{
            type: "add-col",
            col: this.position,
            value: this.col,
            colId: this.colId
        }]);
        this.colId = this.source.getColumnId(this.position);
    }

}

export class TableDataRemoveColumnCommand implements IHistoryCommand{

    private col: any[];


    constructor(public source: IUpdateableTable<any>, public position: number, private colId: number){

    }

    undo(){
        this.source.change([{
            type: "add-col",
            col: this.position,
            value: this.col,
            colId: this.colId
        }]);
    }

    do(){
        this.col = getTableColumn(this.source.data, this.position);
        this.source.change([{
            type: "remove-col",
            col: this.position
        }]);
    }

}

export class TableDataAddRowCommand implements IHistoryCommand{

    constructor(public source: IUpdateableTable<any>, public row: any[], public position: number){

    }

    undo(){
        this.source.change([{
            type: "remove-row",
            row: this.position
        }]);
    }

    do(){
        this.source.change([{
            type: "add-row",
            row: this.position,
            value: this.row
        }]);
    }

}

export class TableDataRemoveRowCommand implements IHistoryCommand{

    private row: any[];

    constructor(public source: IUpdateableTable<any>, public position: number){

    }

    undo(){
        this.source.change([{
            type: "add-row",
            row: this.position,
            value: this.row
        }]);
    }

    do(){
        this.row = this.source.data[this.position];
        this.source.change([{
            type: "remove-row",
            row: this.position
        }]);
    }

}

export class HistoryUpdateableTable<E> implements IUpdateableTable<E>{

    constructor(public table: IUpdateableTable<E>, public history: ChartHistory){

    }

    change(changes: ITableChange<E>[]){
        this.executeCommand(new HistoryCommandGroup(changes.map(change => {
            switch(change.type){
                case "add-col":
                    return new TableDataAddColumnCommand(this.table, change.value, change.col);
                case "add-row":
                    return new TableDataAddRowCommand(this.table, change.value, change.row);
                case "change":
                    return new TableDataChangeHistoryCommand(this.table, change.value, change.row, change.col);
                case "load":
                    return new TableDataLoadHistoryCommand(this.table, change.value);
                case "remove-col":
                    return new TableDataRemoveColumnCommand(this.table, change.col, change.colId);
                case "remove-row":
                    return new TableDataRemoveRowCommand(this.table, change.row);
            }
        })));
    }

    getNextColumnId(){
        return this.table.getNextColumnId();
    }

    getColumnId(cid: number){
        return this.table.getColumnId(cid);
    }

    protected executeCommand(command: IHistoryCommand){
        this.history.executeCommand(command);
    }

    getNrOfCols(){
        return this.table.getNrOfCols();
    }

    getNrOfRows(){
        return this.table.getNrOfRows();
    }

    get onChange(){
        return this.table.onChange;
    }

    get data(){
        return this.table.data;
    }

}

export class DatasetHistoryUpdateableTable<E> extends HistoryUpdateableTable<E>{

    constructor(table, history){
        super(table, history);
    }

    @factory
    createUpdateSeriesCommand(command: IHistoryCommand){
        return new UpdateSeriesAfterTableCommand(command);
    }

    protected executeCommand(command: IHistoryCommand){
        super.executeCommand(this.createUpdateSeriesCommand(command));
    }
}

export class UpdateSeriesAfterTableCommand implements IHistoryCommand{

    @inject
    settings: EChartSettings;

    @inject
    editorSettings: EditorSettings;

    private isDone = false;
    private doCommands: IHistoryCommand[] = [];

    constructor(public tableUploadHistory: IHistoryCommand){

    }

    do(){
        this.tableUploadHistory.do();
        if (!this.isDone){
            this.processParsedSeries();
            this.isDone = true;
        }
        this.doCommands.forEach(dc => dc.do());
    }

    undo(){
        this.doCommands.slice().reverse().forEach(dc => dc.undo());
        this.tableUploadHistory.undo();
    }

    private processParsedSeries(){
        if (!this.editorSettings.options.data.manageSeries){
            return;
        }
        const pd = this.settings.dataset.parsedData;
        if (!pd){
            return;
        }

        const colidToSeries = {

        };
        const datasetSeries = this.settings.series.seriesCollection.values.filter(dsc => {
            return dsc.dataSourceType === "chart" && dsc.columnId != null;
        });
        datasetSeries.forEach(dss => {
            colidToSeries[dss.columnId] = dss;
        });
        var insertIndex = this.settings.series.seriesCollection.length;
        var ps = this.settings.dataset.getParsedSeries();
        ps.forEach((ps, i) => {
            if (!(ps.colId in colidToSeries)){
                var ecs = this.settings.series.createSeries();
                ecs.name = "";
                ecs.columnId = ps.colId;
                ecs.type = this.editorSettings.options.data.seriesType;
                ecs.dataSourceType = "chart";
                this.doCommands.push(new InsertArrayItemCommand(this.settings.series.seriesCollection, ecs, insertIndex));
                insertIndex++;
            }
            else
            {
                delete colidToSeries[ps.colId];
            }
        });
        let toDelete: number[] = [];
        for (var indx in colidToSeries){
            const nindx = parseInt(indx);
            var vals = this.settings.series.seriesCollection.values;
            for (var i=0; i < vals.length; i++){
                var ser = vals[i];
                if (ser.dataSourceType === "chart" && ser.columnId === nindx){
                    toDelete.push(i);
                }
            }
        }
        toDelete.sort((a, b) => b - a);
        toDelete.forEach(del => {
            this.doCommands.push(new RemoveArrayItemCommand(this.settings.series.seriesCollection, del));
        });
    }

}

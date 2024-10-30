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
 
import {IEChartSettingsComponent} from "../base";
import {node, variable} from '../../../../../../reactive';
import {EChartDatasetTable} from "../../view/dataset";
import * as di from '../../../../../../di';
import {create} from '../../../../../../di';
import {table} from "../../../configuration/view/upload";
import {IHtmlShape} from "../../../../../../html/src/html/node";
import {helpCard} from "../../../shape/help";
import {removeEmptyProperties} from "../../../../../../core/src/object";
import {UpdateableTable} from "../../../../collection2d/array2d";
import {DatasetHistoryUpdateableTable} from "../../../history/table";
import {ChartHistory} from "../../../history";
import {ITableMetaData, truncateTable} from "../../../../echart/data/truncate";
import {DataRowBuilder} from "./row";
import {TableMetaDataParser} from "../../../../echart/data/parse";

declare var $;

export interface IParsedSeries{
    name?: string;
    colId: number;
    startIndex: number;
    endIndex: number;
}


export class SourceView{

    @di.inject
    dataset: EChartDatasetSettings;

    @di.factory
    createTable(){
        return new EChartDatasetTable(this.createUpdateableTable());
    }

    @di.inject
    history: ChartHistory

    @di.create(function(this: SourceView) {
        var dataset = this.dataset;
        return {
            tag: "div",
            child: {
                tag: "div",
                child: [{tag: "div", child: ["Upload or insert your data into the table above. ", {
                        tag: "a", attr: {href: "#datasourceHelp", "data-toggle": "collapse"}, child: "Show more"
                    }]},
                    {
                        tag: "div",
                        onAttached: function() {
                            $(this.node.element).collapse({
                                toggle: false
                            });
                        },
                        attr: {
                            class: "collapse",
                            id: "datasourceHelp"
                        },
                        child: helpCard({content: [{
                                tag: "p", child: "You can define data for your series here using following format:"
                            },{tag: "div", attr: {class: "card"}, child: {
                                    tag: "div", attr: {class: "card-body"}, child: {
                                        tag: "img", attr: {
                                            src: "/public/img/help/editor/datasource.png"
                                        },
                                        style: {
                                            maxWidth: "100%"
                                        }
                                    }
                                }},{
                                tag: "p",
                                child: "For each column, the first row defines the name of the series, and the following rows define the data of the series. The first column defines the name of the categories"
                            },{
                                tag: "button",
                                attr: {
                                    class: "btn btn-primary btn-sm"
                                },
                                child: "Load example data",
                                event: {
                                    click: (ev) => {
                                        ev.preventDefault();
                                        dataset.source = [["", "Series 1", "Series 2", "Series 3"],
                                            ["Category 1", 2, 6, 1],
                                            ["Category 2", 6, 4, 4],
                                            ["Category 3", 7, 3, 5]];
                                    }
                                }
                            }]})
                    }]
            }
        }
    })
    tableHelp : IHtmlShape;

    uploadHelp = {
        tag: "div",
        child: [{
            tag: "div",
            child: ["Upload a file containing your data. ",{
                tag: "a", attr: {href: "#datasourceUploadHelp", "data-toggle": "collapse"}, child: "Show more"
            }]
        }]
    }

    @di.factory
    createUpdateableTable(){
        return new DatasetHistoryUpdateableTable(this.dataset.sourceTable, this.history);
    }

    @di.factory
    createUpload(){
        return table(this.createUpdateableTable());
    }

}

export class EChartDatasetSettings implements IEChartSettingsComponent{

    public sourceTable = new UpdateableTable<any>();
    @create(function(this: EChartDatasetSettings){
        return new DatasetHistoryUpdateableTable(this.sourceTable, this.history);
    })
    public changeableSourceTable: DatasetHistoryUpdateableTable<any>;
    public r_sourceHeader = variable(true);
    @di.inject
    history: ChartHistory;

    public colIdToSeriesInfo: {[s: number]: IParsedSeries};

    get sourceHeader(){
        return this.r_sourceHeader.value;
    }

    set sourceHeader(v){
        this.r_sourceHeader.value = v;
    }

    get source(){
        return this.sourceTable.data;
    }

    set source(v){
        this.sourceTable.data = v;
    }

    private tableParser = new TableMetaDataParser();

    fromTable(data: ITableMetaData): any{
        if(!data || data.data.length === 0){
            ret = [];
            (<any>ret)._columnIds = [];
            (<any>ret)._colIdToCol = {};
            return ret;
        }
        var ret = this.tableParser.parse(data);
        var tr = data.dataCoords;
        var vc = data.validColumns;
        var colIds = [];
        var colIdToCol = {};
        for (var j=tr.startCol; j <= tr.endCol; j++) {
            if (!vc[j]) {
                continue;
            }
            colIds.push(this.sourceTable.getColumnId(j));
            colIdToCol[colIds[colIds.length - 1]] = colIds.length - 1;
        }
        (<any>ret)._columnIds = colIds;
        (<any>ret)._colIdToCol = colIdToCol;
        this._parsedData = ret;
        var ps = this.getParsedSeries();
        this.colIdToSeriesInfo = {};
        ps.forEach(p => {
            this.colIdToSeriesInfo[p.colId] = p;
        });
        return ret;
    }

    getParsedSeries(){
        var pd = this._parsedData;
        var ps: IParsedSeries[] = [];
        const colIds = (<any>pd)._columnIds;
        var columnInfos = [];
        var maxIndex = 0;
        if (pd.length > 0){
            var header = pd[0];
            for (var i=1; i < header.length; i++){
                const id = (<any>pd)._colIdToCol[colIds[i]];
                var head = header[i];
                maxIndex = Math.max(maxIndex, id);
                if (head){
                    columnInfos.push({
                        index: id,
                        column: colIds[i],
                        header: head
                    });
                }
            }
        }
        columnInfos.sort((a,b) => a.index - b.index);
        for (var i=0; i < columnInfos.length; i++){
            var ci = columnInfos[i];
            var ni = columnInfos[i+1];
            if (ni){
                var endIndex = ni.index - 1;
            }
            else
            {
                endIndex = maxIndex;
            }
            ps.push({
                name: ci.header,
                colId: ci.column,
                startIndex: ci.index,
                endIndex: endIndex
            });
        }
        return ps;
    }

    getParsedDataColumnIds(): number[]{
        this.$dataChange.observed();
        return (<any>this.parsedData)._columnIds;
    }

    getParsedColumnForId(id: number): number {
        this.$dataChange.observed();
        return (<any>this.parsedData)._colIdToCol[id];
    }

    getFirstColumnIndex(): number{
        return this.tableAndMeta.dataCoords.startCol;
    }

    getSeriesInfoForColumnId(id: number){
        this.$dataChange.observed();
        return this.colIdToSeriesInfo[id];
    }

    getSeriesInfoByColumnIndex(index: number){
        this.$dataChange.observed();
        for (var p in this.colIdToSeriesInfo){
            var si = this.colIdToSeriesInfo[p];
            if (index >= si.startIndex && index <= si.endIndex){
                return si;
            }
        }
        return null;
    }

    createDataRowBuilder(){
        return new DataRowBuilder();
    }

    applyValue(builder: DataRowBuilder, value: any){
        builder.value.push(value);
    }

    parseValue(val: string){
        var type = typeof val;
        if (type === "string"){
            if (isNaN(<any>val)){
                return val;
            }
            if (val === ""){
                return "";
            }
            return parseFloat(val);
        }
        else if (type === "number"){
            return val;
        }
        return null;
    }


    applyConfig(c: any){
        if (c.source) {
            this.sourceTable.fromJson(c.source);
        }
        else{
            this.sourceTable.data = [["","","","",""],
                ["","","","",""],
                ["","","","",""],
                ["","","","",""],
                ["","","","",""],
                ["","","","",""],
                ["","","","",""],
                ["","","","",""],
                ["","","","",""]]
        }
    }

    createConfig(){
        return removeEmptyProperties({
            source: this.sourceTable.toJson()
        })
    }

    createEChartConfig(){
        return removeEmptyProperties({
           // source: this.parsedData
        });
    }

    @di.create(() => new SourceView())
    sourceView: SourceView;

    private _tableAndMeta: ITableMetaData;
    private _parsedData: any[][];
    private $dataChange = node()

    get tableAndMeta(){
        if (this.recalcTable){
            this._tableAndMeta = truncateTable(this.source);
            this.recalcTable = false;
        }
        this.$dataChange.observed();
        return this._tableAndMeta;
    }

    get parsedData(){
        if (this.recalcParsed){
            this._parsedData = this.fromTable(this.tableAndMeta);
            this.recalcParsed = false;
        }
        this.$dataChange.observed();
        return this._parsedData;
    }

    private recalcTable = false;
    private recalcParsed = false;

    @di.init
    init(){
        this.sourceTable.onChange.observe(o => {
            this.recalcTable = true;
            this.recalcParsed = true;
            this.$dataChange.changedDirty();
        });
    }


}

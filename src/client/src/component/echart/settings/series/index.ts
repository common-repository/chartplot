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
 
import {AbstractChartSettings, IChartSettingsComponent, IEChartSettingsComponent} from "../base";
import * as di from '../../../../../../di';
import {component, create, factory, init, inject} from '../../../../../../di';
import {array, ICancellable, procedure, transaction, variable} from '../../../../../../reactive';
import {EChartDatasetSettings} from "../dataset";
import {removeEmptyProperties} from "../../../../../../core/src/object";
import {EChartSettings} from "../index";
import {ChartHistory} from "../../../history";
import {InsertArrayItemCommand} from "../../../history/array";
import {UpdateableTable} from "../../../../collection2d/array2d";
import {HistoryUpdateableTable} from "../../../history/table";
import {getIconForSeriesType} from "../../../editor/ribbon/data/type";
import {IFocusableElement} from "../../../editor/settings/options/chart";
import {Ribbon, TabSection} from "../../../editor/ribbon";
import {SeriesDataRibbonTab} from "../../../editor/ribbon/series/data";
import {EditorProblems} from "../../../editor/error";
import {Editor} from "../../../editor";
import {RibbonOptions} from "../../../editor/settings/options/ribbon";
import {GridSettings} from "../coordinates/grid";
import {PixelPercentValue} from "../position";
import {SeriesLabelSettings} from "./label";
import {SeriesLabelRibbonTab} from "../../../editor/ribbon/series/style";
import {SeriesAreaStyle, SeriesItemStyle, SeriesLineStyle} from "./style";
import {ColumnConfig} from "../dataset/column";
import {ConfigBuilder} from "../util";
import {LabelLineSettings} from "./labelLine";
import {SeriesDataCell} from "./data";
import {SeriesColumnDataCell} from "./data/column";
import {SeriesRowDataCell} from "./data/row";
import {getIconShape, IconSet} from "../../../icon";
import {DataStyleTab} from "../../../editor/ribbon/series/data/row/style";
import {TooltipSettings} from "../tooltip";
import {GridAxis} from "../coordinates/grid/axis";
import {ITableMetaData, truncateTable} from "../../../../echart/data/truncate";
import {SeriesTableDataParser} from "./data/table";
import {HashMap} from "../../../../collection/hash";
import {extend} from "../../../../../../core";

export const axisTypes = {
    line: true,
    bar: true,
    area: true,
    scatter: true,
    candlestick: true,
    effectScatter: true,
    area_interval: true,
    bar_interval: true
}

export class EChartSeriesCollectionSettings implements IEChartSettingsComponent{

    @di.inject
    dataset: EChartDatasetSettings;

    @di.inject
    history: ChartHistory;

    @di.define
    public seriesCollection: array.IReactiveArray<EChartSeriesSettings> = array<EChartSeriesSettings>([]);

    createConfig(){
        return this.seriesCollection.values.map(s => s.createConfig());
    }

    createEChartConfig(){
        var res = [];
        this.seriesCollection.values.forEach((s, indx) => {
            s.seriesCollectionIndex = indx;
            s.createEChartConfig(res);
        });
        var vals = this.seriesCollection.values;
        var barIndexes = {};
        return res;
    }

    applyConfig(c){
        this.seriesCollection.clear();
        if (c){
            c.forEach(ser => {
                var ecs = this.createSeries();
                ecs.applyConfig(ser);
                this.seriesCollection.push(ecs);
            });
        }
    }

    @di.factory
    createSeries(){
        var ser = new EChartSeriesSettings();
        ser.name = "Series "+this.seriesCollection.values.length;
        return ser;
    }

    getRelativeIndexOfSeries(series: EChartSeriesSettings){
        return this.seriesCollection.values.filter(s => s.type === series.type).indexOf(series);
    }

    getChartIndexForSeries(series: EChartSeriesSettings){
        var sers = this.seriesCollection.values;
        var indx = 0;
        for (var i=0; i < sers.length; i++){
            var s = sers[i];
            if (s.isValid()){
                if (sers[i] === series){
                    return indx;
                }
                indx++;
            }
        }
        return -1;
    }

    getSettingsCollectionIndexFromChartIndex(index: number){
        var sers = this.seriesCollection.values;
        for (var i=0; i < sers.length; i++){
            var s = sers[i];
            if (s.isValid()){
                if (index === 0){
                    return i;
                }
                if (s.getType() === "interval_area"){
                    i++;
                }
                index--;
            }
        }
        return -1;
    }

    addNewSeries(index: number){
        const newIndex = Math.max(0, Math.min(index, this.seriesCollection.length));
        this.history.executeCommand(new InsertArrayItemCommand(this.seriesCollection, this.createSeries(), newIndex));
        return newIndex;
    }

    @init
    init(){
        this.seriesCollection.onUpdateSimple({
            remove: (val) => {
                val.deactivate();
            },
            add: (val) => {
                val.activate();
            }
        })
    }

}

export type SeriesDataSourceType = "chart" | "table" | "link" | "auto";


class SelectedData implements IChartSettingsComponent{

    public r_row = variable(-1);

    get row(){
        return this.r_row.value;
    }

    set row(v){
        this.r_row.value = v;
    }

    public r_column = variable(-1);

    get column(){
        return this.r_column.value;
    }

    set column(v){
        this.r_column.value = v;
    }

    createConfig(){
        return {
            row: this.row,
            column: this.column
        }
    }

    applyConfig(c){
        if ("row" in c){
            this.row = c.row;
        }
        else {
            this.row = -1;
        }
        if ("column" in c){
            this.column = c.column;
        }
        else
        {
            this.column = -1;
        }
    }

}

@component("series")
export class EChartSeriesSettings extends AbstractChartSettings implements IFocusableElement{

    public r_columnId = variable<number>(null);

    get columnId(){
        return this.r_columnId.value;
    }

    set columnId(v){
        this.r_columnId.value = v;
    }

    @factory
    createSettings(){
        var s = new EChartSeriesSettings();
        return s;
    }

    public r_name = variable("");
    public r_type = variable("");
    @create(() => new SeriesLabelSettings())
    label: SeriesLabelSettings;
    labelLine = new LabelLineSettings();

    data: UpdateableTable<any> = new UpdateableTable<any>();
    @create(() => new TooltipSettings())
    tooltip: TooltipSettings;

    builder = new ConfigBuilder();

    public r_valid = variable<boolean>(null);

    private _selectedData = new SelectedData();

    get selectedData(){
        return this._selectedData;
    }

    get valid(){
        return this.r_valid.value;
    }

    set valid(v){
        this.r_valid.value = v;
    }

    @inject
    history: ChartHistory;

    @inject
    editor: Editor

    public r_tableAndMeta = variable<ITableMetaData>(null);

    get tableAndMeta(){
        return this.r_tableAndMeta.value;
    }

    set tableAndMeta(v){
        this.r_tableAndMeta.value = v;
    }
    public r_parsedData = variable<any[][]>([]);

    get parsedData(){
        return this.r_parsedData.value;
    }

    set parsedData(v){
        this.r_parsedData.value = v;
    }
    @create(function(this: EChartSeriesSettings){
        return new HistoryUpdateableTable(this.data, this.history);
    })
    public changeableData: HistoryUpdateableTable<any>;
    public columnToConfig = new HashMap<number, ColumnConfig>();

    @create(() => new SeriesLineStyle())
    lineStyle: SeriesLineStyle;

    @create(() => new SeriesAreaStyle())
    areaStyle: SeriesAreaStyle;

    barWidth = new PixelPercentValue();
    barMinWidth = new PixelPercentValue();
    barMaxWidth = new PixelPercentValue();

    public r_clockwise = variable<boolean>(null);

    get clockwise(){
        return this.r_clockwise.value;
    }

    set clockwise(v){
        this.r_clockwise.value = v;
    }

    public r_roseType = variable<string>(null);

    get roseType(){
        return this.r_roseType.value;
    }

    set roseType(v){
        this.r_roseType.value = v;
    }

    public r_stillShowZeroSum = variable<boolean>(null);

    get stillShowZeroSum(){
        return this.r_stillShowZeroSum.value;
    }

    set stillShowZeroSum(v){
        this.r_stillShowZeroSum.value = v;
    }

    public r_symbol = variable<string>(null);

    public r_symbolColor = variable<string>("white");

    get symbolColor(){
        return this.r_symbolColor.value;
    }

    set symbolColor(v){
        this.r_symbolColor.value = v;
    }

    get symbol(){
        return this.r_symbol.value;
    }

    set symbol(v){
        if (v === "default"){
            v = null;
        }
        this.r_symbol.value = v;
    }

    public r_symbolSize = variable<number>(null);

    get symbolSize(){
        return this.r_symbolSize.value;
    }

    set symbolSize(v){
        this.r_symbolSize.value = v;
    }

    public r_symbolRotate = variable<number>(null);

    get symbolRotate(){
        return this.r_symbolRotate.value;
    }

    set symbolRotate(v){
        this.r_symbolRotate.value = v;
    }

    public r_showSymbol = variable<boolean>(null);

    get showSymbol(){
        return this.r_showSymbol.value;
    }

    set showSymbol(v){
        this.r_showSymbol.value = v;
    }

    public r_showAllSymbol = variable<boolean>(null);

    get showAllSymbol(){
        return this.r_showAllSymbol.value;
    }

    set showAllSymbol(v){
        this.r_showAllSymbol.value = v;
    }

    public r_step = variable<boolean>(null);

    get step(){
        return this.r_step.value;
    }

    set step(v){
        this.r_step.value = v;
    }

    public r_smooth = variable(<boolean>null);

    get smooth(){
        return this.r_smooth.value;
    }

    set smooth(v){
        this.r_smooth.value = v;
    }

    public r_stackEnabled = variable(null);

    get stackEnabled(){
        return this.r_stackEnabled.value;
    }

    set stackEnabled(v){
        this.r_stackEnabled.value = v;
    }

    public r_stack = variable<string>(null);

    get stack(){
        return this.r_stack.value;
    }

    set stack(v){
        this.r_stack.value = v;
    }

    public r_dataSourceType = variable<SeriesDataSourceType>("table");

    get dataSourceType(){
        return this.r_dataSourceType.value;
    }

    set dataSourceType(v){
        this.r_dataSourceType.value = v;
    }

    @inject
    settings: EChartSettings

    get type(){
        return this.r_type.value;
    }

    set type(v){
        this.r_type.value = v;
    }

    get name(){
        return this.r_name.value;
    }

    set name(v){
        this.r_name.value = v;
    }

    public r_coordinateIndex = variable(null);

    get coordinateIndex(){
        return this.r_coordinateIndex.value || 0;
    }

    set coordinateIndex(v){
        this.r_coordinateIndex.value = v;
    }

    public r_xAxisIndex = variable(null);

    get xAxisIndex(){
        return this.r_xAxisIndex.value || 0;
    }

    set xAxisIndex(v){
        this.r_xAxisIndex.value = v;
    }

    public r_yAxisIndex = variable(null);

    get yAxisIndex(){
        return this.r_yAxisIndex.value || 0;
    }

    set yAxisIndex(v){
        this.r_yAxisIndex.value = v;
    }

    public r_startAngle = variable(null);

    get startAngle(){
        return this.r_startAngle.value || 0;
    }

    set startAngle(v){
        this.r_startAngle.value = v;
    }

    public r_minAngle = variable(null);

    get minAngle(){
        return this.r_minAngle.value || 0;
    }

    set minAngle(v){
        this.r_minAngle.value = v;
    }

    public r_avoidLabelOverlap = variable<boolean>(null);

    get avoidLabelOverlap(){
        return this.r_avoidLabelOverlap.value === null ? true : this.r_avoidLabelOverlap.value;
    }

    set avoidLabelOverlap(v){
        this.r_avoidLabelOverlap.value = v;
    }

    insideRadius = new PixelPercentValue();
    outsideRadius = new PixelPercentValue();
    centerX = new PixelPercentValue();
    centerY = new PixelPercentValue();
    @create(() => new SeriesItemStyle())
    itemStyle: SeriesItemStyle;

    seriesCollectionIndex: number;

    getType(){
        let type = this.type;
        if (!type){
            type = "bar";
        }
        return type;
    }

    getIcon(){
        return getIconForSeriesType(this.getType());
    }

    getName(){
        if (this.name){
            return this.name;
        }
        if (this.dataSourceType === "chart"){
            var si = this.settings.dataset.getSeriesInfoForColumnId(this.columnId);
            if (si){
                return si.name || "";
            }
        }
        return "";
    }

    createConfig(){
        return this.builder.createConfig(removeEmptyProperties({
            name: this.name,
            type: this.type,
            columnId: this.columnId,
            dataSourceType: this.dataSourceType,
            coordinateIndex: this.coordinateIndex,
            xAxisIndex: this.xAxisIndex,
            yAxisIndex: this.yAxisIndex,
            centerX: this.centerX.createConfig(),
            centerY: this.centerY.createConfig(),
            innerRadius: this.insideRadius.createConfig(),
            outerRadius: this.outsideRadius.createConfig(),
            label: this.label.createConfig(),
            avoidLabelOverlap: this.r_avoidLabelOverlap.value,
            data: this.serializeData(),
            itemStyle: this.itemStyle.createConfig(),
            stack: this.stack,
            stackEnabled: this.stackEnabled,
            smooth: this.smooth,
            step: this.step,
            symbol: this.symbol,
            symbolSize: this.symbolSize,
            showSymbol: this.showSymbol
        }));
    }

    serializeData(){
        var data = this.data.data;
        var res = [];
        for (var i=0; i < data.length; i++){
            var d = data[i];
            var row = [];
            res.push(row);
            for (var j=0; j < d.length; j++){
                var v: any = d[j];
                if (v instanceof SeriesDataCell){
                    row.push(v.createConfig());
                }
                else
                {
                    row.push(v);
                }
            }
        }
        return res;
    }

    @factory
    createRowCell(){
        return new SeriesRowDataCell();
    }

    @factory
    createColumnCell(){
        return new SeriesColumnDataCell();
    }


    deserializeData(data: any[][]){
        var res = [];
        for (var i=0; i < data.length; i++){
            var d = data[i];
            var row = [];
            res.push(row);
            for (var j=0; j < d.length; j++) {
                var v: any = d[j];
                if (v && typeof v === "object"){
                    var cell: SeriesDataCell;
                    if (v.type === "row"){
                        cell = this.createRowCell();
                    }
                    else {
                        cell = this.createColumnCell();
                    }
                    cell.applyConfig(v);
                    row.push(cell);
                }
                else {
                    row.push(v);
                }
            }
        }
        this.data.data = res;
    }

    applyConfig(c){
        this.name = c.name || "";
        this.type = c.type || "";
        this.columnId = "columnId" in c ? c.columnId : null;
        if (c.dataSourceType){
            this.dataSourceType = c.dataSourceType;
        }
        if ("coordinateIndex" in c){
            this.coordinateIndex = c.coordinateIndex;
        }
        if ("xAxisIndex" in c){
            this.xAxisIndex = c.xAxisIndex
        }
        if ("yAxisIndex" in c){
            this.yAxisIndex = c.yAxisIndex;
        }
        if (c.centerX){
            this.centerX.applyConfig(c.centerX);
        }
        if (c.centerY){
            this.centerY.applyConfig(c.centerY);
        }
        if (c.innerRadius){
            this.insideRadius.applyConfig(c.innerRadius);
        }
        if (c.outerRadius){
            this.outsideRadius.applyConfig(c.outerRadius);
        }
        if (c.label){
            this.label.applyConfig(c.label);
        }
        if ("avoidLabelOverlap" in c){
            this.avoidLabelOverlap = c.avoidLabelOverlap;
        }
        if (c.data){
            this.deserializeData(c.data);
        }
        if (c.itemStyle){
            this.itemStyle.applyConfig(c.itemStyle);
        }
        if (c.stack){
            this.stack = c.stack;
        }
        if ("stackEnabled" in c){
            this.stackEnabled = c.stackEnabled;
        }
        if ("smooth" in c){
            this.smooth = c.smooth;
        }
        if ("step" in c){
            this.step = c.step;
        }
        this.symbol = c.symbol || null;
        if ("symbolSize" in c){
            this.symbolSize = c.symbolSize;
        }
        if ("showSymbol" in c){
            this.showSymbol = c.showSymbol;
        }
        this.builder.applyConfig(c);
    }

    createEChartConfig(result: any[]){
        var valid = true;
        if (!this.hasData()){
            this.problems.provideProblem({
                type: "error",
                message: ["Missing data for series '"+this.getName()+"' ",{
                    tag: "a",
                    child: "Click here",
                    attr: {
                        href: "javascript:void(0)"
                    },
                    event: {
                        click: () => {
                            transaction(() => {
                                const index = this.settings.series.seriesCollection.values.indexOf(this);
                                this.editor.editorSettings.options.ribbon.selectedTab = RibbonOptions.SERIES_DATA_RIBBON_INDEX;
                                this.editor.editorSettings.options.chart.editMode = "series";
                                this.editor.editorSettings.options.series.selected = index;
                            });
                        }
                    }
                }, " to define data"]
            });
            valid = false;
        }
        if(this.isCategoricalNeeded() && !this.hasGrid()){
            if (this.settings.coordinates.isGridNeeded()){
                valid = false;
            }
            else {
                this.problems.provideProblem({
                    type: "error",
                    message: ["Series '"+this.getName()+"' does not have a valid coordinate system. ",{
                        tag: "a",
                        child: "Click here",
                        attr: {
                            href: "javascript:void(0)"
                        },
                        event: {
                            click: () => {
                                transaction(() => {
                                    const index = this.settings.series.seriesCollection.values.indexOf(this);
                                    this.editor.editorSettings.options.ribbon.selectedTab = RibbonOptions.SERIES_RIBBON_INDEX;
                                    this.editor.editorSettings.options.chart.editMode = "series";
                                    this.editor.editorSettings.options.series.selected = index;
                                });
                            }
                        }
                    }, " to select a coordinate system."]
                });
            }
            valid = false;
        }
        else if (this.isCategoricalNeeded()){
            if(!this.hasXAxis()){
                this.problems.provideProblem({
                    type: "error",
                    message: ["Series '"+this.getName()+"' does not have a valid x-axis. ",{
                        tag: "a",
                        child: "Click here",
                        attr: {
                            href: "javascript:void(0)"
                        },
                        event: {
                            click: () => {
                                transaction(() => {
                                    const index = this.settings.series.seriesCollection.values.indexOf(this);
                                    this.editor.editorSettings.options.ribbon.selectedTab = RibbonOptions.SERIES_RIBBON_INDEX;
                                    this.editor.editorSettings.options.chart.editMode = "series";
                                    this.editor.editorSettings.options.series.selected = index;
                                });
                            }
                        }
                    }, " to select a x-axis."]
                });
                valid = false;
            }
            if(!this.hasYAxis()){
                this.problems.provideProblem({
                    type: "error",
                    message: ["Series '"+this.getName()+"' does not have a valid y-axis. ",{
                        tag: "a",
                        child: "Click here",
                        attr: {
                            href: "javascript:void(0)"
                        },
                        event: {
                            click: () => {
                                transaction(() => {
                                    const index = this.settings.series.seriesCollection.values.indexOf(this);
                                    this.editor.editorSettings.options.ribbon.selectedTab = RibbonOptions.SERIES_RIBBON_INDEX;
                                    this.editor.editorSettings.options.chart.editMode = "series";
                                    this.editor.editorSettings.options.series.selected = index;
                                });
                            }
                        }
                    }, " to select a y-axis."]
                });
                valid = false;
            }
        }


        if (!valid){
            return;
        }

        let type = this.getType();
        let res: any = {
            name: this.getName(),
            type: type,
            seriesCollectionIndex: this.seriesCollectionIndex
        };
        this.createEChartData(res);
        if (this.isCategoricalNeeded()){
            const coord = this.settings.coordinates.coordinates.get(this.coordinateIndex);
            const xAx = (<GridSettings> coord).axes.getXAxisByIndex(this.xAxisIndex);
            const yAx = (<GridSettings> coord).axes.getYAxisByIndex(this.yAxisIndex);
            res.xAxisIndex = this.settings.coordinates.getRelativeIndexForAxis(xAx);
            res.yAxisIndex = this.settings.coordinates.getRelativeIndexForAxis(yAx);
        }
        res.label = this.label.createEChartConfig();
        res.itemStyle = this.itemStyle.createEChartConfig();
        switch(type){
            case "bar":
            case "line":
            case "area":
                if (this.stackEnabled){
                    res.stack = this.stack || "chartplot_default";
                }
                break;
        }
        res.tooltip = this.tooltip.createEChartConfig();
        switch(type){
            case "scatter":
            case "effect_scatter":
                res.lineStyle = this.lineStyle.createEChartConfig();
                this.applySymbolSettings(res);
                break;
            case "line":
                res.smooth = this.smooth;
                res.step = this.step;
                res.lineStyle = this.lineStyle.createEChartConfig();
                this.applySymbolSettings(res);
                break;
            case "area":
                res.type = "line";
                res.smooth = this.smooth;
                res.step = this.step;
                res.lineStyle = this.lineStyle.createEChartConfig();
                res.areaStyle = extend(this.areaStyle.createEChartConfig(), {show: true});
                this.applySymbolSettings(res);
                break;
            case "bar":
                var c = this.getCoordinateSystem();
                if (c && c.type === "grid"){
                    (<GridSettings>c).bar.builder.createConfig(res);
                    res.barGap = (<GridSettings>c).bar.barGap.getEchartValue();
                    res.barCategoryGap = (<GridSettings>c).bar.barCategoryGap.getEchartValue();
                }
                break;
            case "pie":
                res.center = [this.centerX.getEchartValue(), this.centerY.getEchartValue()];
                res.radius = [this.insideRadius.getEchartValue(), this.outsideRadius.getEchartValue()];
                res.avoidLabelOverlap = this.avoidLabelOverlap;
                res.roseType = this.roseType;
                res.clockwise = this.clockwise;
                res.stillShowZeroSum = this.stillShowZeroSum;
                res.minAngle = this.minAngle;
                res.startAngle = this.startAngle;
                res.labelLine = this.labelLine.createEChartConfig();
                break;
            case "candlestick":
                res.barWidth = this.barWidth.getEchartValue();
                res.barMinWidth = this.barMinWidth.getEchartValue();
                res.barMaxWidth = this.barMaxWidth.getEchartValue();
                break;
            case "area_interval":
                var stack = "__interval_"+this.seriesCollectionIndex;
                var bottom: any = {
                    data: [],
                    type: "line",
                    intervalSide: "bottom",
                    name: res.name,
                    xAxisIndex: res.xAxisIndex,
                    yAxisIndex: res.yAxisIndex,
                    stack: stack,
                    lineStyle: {
                        opacity: 0
                    },
                    itemStyle: res.itemStyle,
                    smooth: this.smooth,
                    step: this.step,
                    tooltip: res.tooltip,
                    seriesCollectionIndex: this.seriesCollectionIndex

                };
                var top: any = {
                    data: [],
                    type: "line",
                    name: res.name,
                    intervalSide: "top",
                    xAxisIndex: res.xAxisIndex,
                    yAxisIndex: res.yAxisIndex,
                    stack: stack,
                    lineStyle: {
                        opacity: 0
                    },
                    itemStyle: res.itemStyle,
                    areaStyle: extend( this.areaStyle.createEChartConfig(), {
                        show: true
                    }),
                    smooth: this.smooth,
                    step: this.step,
                    tooltip: res.tooltip,
                    seriesCollectionIndex: this.seriesCollectionIndex
                };
                top.itemStyle.opacity = 0;
                bottom.itemStyle.opacity = 0;
                if (res.externalData){
                    bottom.externalData = res.externalData;
                }
                else
                {
                    for(var i=0; i < res.data.length; i++){
                        var d = res.data[i];
                        if (d.length === 1 || typeof d=== "number"){
                            this.problems.provideProblem({
                                type: "error",
                                message: ["Series '"+this.getName()+"' data is invalid. You need to define the first and second value for interval series. ",{
                                    tag: "a",
                                    child: "Click here",
                                    attr: {
                                        href: "javascript:void(0)"
                                    },
                                    event: {
                                        click: () => {
                                            transaction(() => {
                                                const index = this.settings.series.seriesCollection.values.indexOf(this);
                                                this.editor.editorSettings.options.ribbon.selectedTab = RibbonOptions.SERIES_DATA_RIBBON_INDEX;
                                                this.editor.editorSettings.options.chart.editMode = "series";
                                                this.editor.editorSettings.options.series.selected = index;
                                            });
                                        }
                                    }
                                }, " to correct the data."]
                            });
                            return;
                        }
                        else {
                            if (d.length !== 0){
                                if (Array.isArray(d)){
                                    var vals: number[] = d;
                                }
                                else {
                                    vals = d.value;
                                }
                                if (d.length > 2){
                                    var isNumber1 = typeof vals[1] === "number";
                                    var isNumber2 = typeof vals[2] === "number";
                                    var number1 = vals[1];
                                    var number2 = vals[2];
                                    var category = vals[0];
                                }
                                else {
                                    var isNumber1 = typeof vals[0] === "number";
                                    var isNumber2 = typeof vals[1] === "number";
                                    var number1 = vals[0];
                                    var number2 = vals[1];
                                }
                            }
                            if (d.length === 0 || !isNumber1 && !isNumber2){
                                bottom.data.push(null);
                                top.data.push(null);
                            }
                            else
                            {
                                if (!isNumber1 || !isNumber2){
                                    this.problems.provideProblem({
                                        type: "error",
                                        message: ["Series '"+this.getName()+"' data is invalid. The first and second value for interval series must be numbers. ",{
                                            tag: "a",
                                            child: "Click here",
                                            attr: {
                                                href: "javascript:void(0)"
                                            },
                                            event: {
                                                click: () => {
                                                    transaction(() => {
                                                        const index = this.settings.series.seriesCollection.values.indexOf(this);
                                                        this.editor.editorSettings.options.ribbon.selectedTab = RibbonOptions.SERIES_DATA_RIBBON_INDEX;
                                                        this.editor.editorSettings.options.chart.editMode = "series";
                                                        this.editor.editorSettings.options.series.selected = index;
                                                    });
                                                }
                                            }
                                        }, " to correct the data."]
                                    });
                                    return;
                                }
                                if (d.length > 2){
                                    bottom.data.push([category, number1]);
                                    top.data.push([category, number2 - number1]);
                                }
                                else
                                {
                                    bottom.data.push(number1);
                                    top.data.push(number2 - number1);
                                }
                            }
                        }

                    }
                }
                result.push(removeEmptyProperties(bottom));
                result.push(removeEmptyProperties(top));
                return;
        }
        result.push(removeEmptyProperties(res));
    }

    protected createEChartData(res){
        if (this.dataSourceType === "chart" && this.columnId != null){
            const datasetIndex = this.settings.dataset.getParsedColumnForId(this.columnId);
            var seriesInfo = this.settings.dataset.getSeriesInfoForColumnId(this.columnId);
            if (!seriesInfo){
                res.data = [];
            }
            else
            {
                var parsed = this.settings.dataset.parsedData;
                var data = [];
                var col = datasetIndex;
                var xAxis = <GridAxis>this.getXAxis();
                var yAxis = <GridAxis>this.getYAxis();
                var addDataCat = false;
                var firstColIndex;
                if (xAxis && yAxis){
                    if (xAxis.type !== "category" && yAxis.type !== "category"){

                        firstColIndex = this.settings.dataset.getFirstColumnIndex()
                        if (typeof firstColIndex === "number"){
                            addDataCat = true;
                        }
                    }
                }
                if (seriesInfo.startIndex === seriesInfo.endIndex){
                    for (var i=1; i < parsed.length; i++){
                        if (!addDataCat) {
                            data.push(parsed[i][col]);
                        }
                        else
                        {
                            data.push([parsed[i][firstColIndex], parsed[i][col]])
                        }
                    }
                }
                else {
                    for (var i=1; i < parsed.length; i++){
                        var row = [];
                        if (addDataCat){
                            row.push(parsed[i][firstColIndex]);
                        }
                        for (var j=seriesInfo.startIndex; j <= seriesInfo.endIndex; j++){
                            row.push(parsed[i][j]);
                        }
                        data.push(row);
                    }
                }
                res.data = data;
            }
        }
        else if (this.dataSourceType === "table")
        {
            res.data = this.parsedData;
        }
    }

    public applySymbolSettings(res: any){
        if (this.showSymbol === false){
            if (!res.itemStyle){
                res.itemStyle = {};
            }
            res.itemStyle.opacity = 0;
        }
        res.symbol = this.symbol;
        res.symbolSize = this.symbolSize;
        /*
        var baseColor = this.itemStyle.color || this.settings.getColorFromPalette(this.datasetIndex);
        var symbolColor = this.symbolColor || this.settings.getColorFromPalette(this.datasetIndex);
        if (res.label){
            if (!res.label.color){
                res.label.color = baseColor;
            }
        }
        if (res.lineStyle && !res.lineStyle.color){
            res.lineStyle.color = baseColor;
        }
        if (res.itemStyle){
            res.itemStyle.color = symbolColor || baseColor;
        }
        if (res.itemStyle && !res.itemStyle.borderColor){
            res.itemStyle.borderColor = baseColor;
        }
        if (res.areaStyle && !res.areaStyle.color){
            res.areaStyle.color = baseColor;
        }*/
    }

    isCategoricalNeeded(){
        return this.getType() in axisTypes;
    }

    get datasetIndex(){
        return this.settings.dataset.getParsedColumnForId(this.columnId);
    }

    isValid(){
        return this.valid;
    }

    hasData(): boolean{
        return this.dataSourceType === "chart" && this.datasetIndex != void 0
            || this.dataSourceType === "table" && this.parsedData.length > 0;
    }

    getCoordinateSystem(){
        const grid = this.settings.coordinates.coordinates.get(this.coordinateIndex);
        return grid;
    }

    hasGrid(){
        const grid = this.settings.coordinates.coordinates.get(this.coordinateIndex);
        return grid && grid.type === "grid";
    }

    hasXAxis(){
        return this.hasGrid() && (<GridSettings>this.settings.coordinates.coordinates.get(this.coordinateIndex)).axes.getXAxisByIndex(this.xAxisIndex) != null;
    }

    getXAxis(){
        if (!this.hasGrid()){
            return null;
        }
        return (<GridSettings>this.settings.coordinates.coordinates.get(this.coordinateIndex)).axes.getXAxisByIndex(this.xAxisIndex);
    }

    getYAxis(){
        if (!this.hasGrid()){
            return null;
        }
        return (<GridSettings>this.settings.coordinates.coordinates.get(this.coordinateIndex)).axes.getYAxisByIndex(this.yAxisIndex);
    }

    hasYAxis(){
        return this.hasGrid() && (<GridSettings>this.settings.coordinates.coordinates.get(this.coordinateIndex)).axes.getYAxisByIndex(this.yAxisIndex) != null;
    }

    isValidCoordinate(){
        return this.isCategoricalNeeded()
    }

    dataParser = new SeriesTableDataParser();

    fromTable(data: ITableMetaData): any{
        if(!data || data.data.length === 0){
            return [];
        }
        var ret = this.dataParser.parse(data);
        var tr = data.dataCoords;
        var vc = data.validColumns;
        var colIds = [];
        for (var j=tr.startCol; j <= tr.endCol; j++) {
            if (!vc[j]) {
                continue;
            }
            colIds.push(this.data.getColumnId(j));
        }
        (<any>ret)._columnIds = colIds;
        return ret;
    }

    @di.inject
    problems: EditorProblems;

    @di.init
    init(){
        this.data.change([{
            type: "load",
            value: [["", ""], ["", ""], ["", ""], ["", ""], ["", ""]]
        }])
        this.r_tableAndMeta.listener(v => {
            v.value = truncateTable(this.data.data);
        });
        this.r_parsedData.listener(v => {
            v.value = this.fromTable(this.tableAndMeta);
        });
        this.r_valid.listener(v => {
            var hasData = this.hasData();
            var validCategorical = !this.isCategoricalNeeded() || this.hasGrid() && this.hasXAxis() && this.hasYAxis();
            v.value = hasData && validCategorical;
        });
        this.centerX.defaultPixelPercent = "percent";
        this.centerX.defaultValue = 50;
        this.centerY.defaultPixelPercent = "percent";
        this.centerY.defaultValue = 50;
        this.insideRadius.defaultPixelPercent = "percent";
        this.insideRadius.defaultValue = 0;
        this.outsideRadius.defaultPixelPercent = "percent";
        this.outsideRadius.defaultValue = 75;

        this.barMinWidth.defaultPixelPercent = "percent";
        this.barWidth.defaultPixelPercent = "percent";
        this.barMaxWidth.defaultPixelPercent = "percent";
        this.builder.config("lineStyle", this.lineStyle);
        this.builder.value("roseType", this.r_roseType);
        this.builder.value("clockwise", this.r_clockwise);
        this.builder.value("stillShowZeroSum", this.r_stillShowZeroSum);
        this.builder.config("labelLine", this.labelLine);
        this.builder.config("areaStyle", this.areaStyle);
        this.builder.config("barMinWidth", this.barMinWidth);
        this.builder.config("barWidth", this.barWidth);
        this.builder.config("barMaxWidth", this.barMaxWidth);
        this.builder.config("selectedData", this.selectedData);
        this.builder.value("symbolColor", this.r_symbolColor, "white");
        this.builder.config("tooltip", this.tooltip);
    }

    activate(){

    }

    deactivate(){

    }

    @factory
    createSeriesDataTab(){
        return new SeriesDataRibbonTab();
    }

    @factory
    createSeriesLabelTab(){
        var lbl = new SeriesLabelRibbonTab();
        lbl.marginRight = "2rem";
        return lbl;
    }

    @factory
    createSeriesDataStyleTab(dataTab: SeriesDataRibbonTab, row: SeriesRowDataCell){
        var ds = new DataStyleTab(dataTab, row);
        ds.marginRight = "5rem";
        return ds;
    }

    private focusCancel: ICancellable[] = [];

    private lastAdded: TabSection;

    activateFocus(ribbon: Ribbon){
        var section = new TabSection();
        section.name = [this.getIcon(), " ", this.getName()];
        var dataTab = this.createSeriesDataTab();
        section.tabs.push(dataTab);
        section.tabs.push(this.createSeriesLabelTab());
        ribbon.sections.push(section);
        this.lastAdded = section;
        this.focusCancel.push(procedure(() => {
            if (ribbon.sections.length === 2){
                ribbon.sections.remove(1);
            }
            if (this.selectedData){
                var r = this.data.data[this.selectedData.row];
                if (r){
                    var val = r[this.selectedData.column];
                    if (val instanceof SeriesRowDataCell){
                        section = new TabSection();
                        section.name = [getIconShape(IconSet.table_add_column_below), " ", val.name || "Settings"];
                        section.tabs.push(this.createSeriesDataStyleTab(dataTab, val));
                        ribbon.sections.push(section);
                    }
                }
            }
        }));
    }

    deactivateFocus(ribbon: Ribbon){
        this.focusCancel.forEach(fc => fc.cancel());
        if (ribbon.sections.length === 2){
            ribbon.sections.remove(1);
        }
        this.focusCancel = [];
        ribbon.sections.remove(ribbon.sections.indexOf(this.lastAdded));
    }

}

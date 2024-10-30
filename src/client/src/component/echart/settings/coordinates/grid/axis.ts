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
 
import {AbstractChartSettings, IEChartSettingsComponent} from "../../base";
import {array, procedure, variable} from "../../../../../../../reactive/index";
import {removeEmptyProperties} from "../../../../../../../core/src/object";
import {component, create, factory, init, inject} from "../../../../../../../di/index";
import {EditorSettings} from "../../../../editor/settings/index";
import {ChartHistory} from "../../../../history/index";
import {getIconShape, IconSet} from "../../../../icon/index";
import {IFocusableElement} from "../../../../editor/settings/options/chart";
import {Ribbon} from "../../../../editor/ribbon/index";
import {GridSettings} from "./index";
import {InsertArrayItemCommand} from "../../../../history/array";
import {EChartSettings} from "../../index";
import {TabSection} from "../../../../editor/ribbon";
import {AxisCategoriesTab} from "../../../../editor/ribbon/coords/axis/data";
import {UpdateableTable} from "../../../../../collection2d/array2d";
import {ConfigBuilder} from "../../util";
import {HistoryUpdateableTable} from "../../../../history/table";
import {IProcedure, Procedure} from "../../../../../../../reactive/src/procedure";
import {AxisLineSettings} from "./axisLine";
import {AxisLabel} from "./axisLabel";
import {AxisStyleTab} from "../../../../editor/ribbon/coords/axis/style";

export type AxisCoordinate = "x" | "y";

export class GridAxisCollection{

    @inject
    editorSettings: EditorSettings;

    @inject
    history: ChartHistory;

    axes = array<GridAxis>();

    applyConfig(c: any){
        this.axes.clear();
        c.forEach(ax => {
            const axis = this.createAxis(ax.coordinate);
            axis.applyConfig(ax);
            this.axes.push(axis);
        });
    }

    createConfig(){
        return this.axes.values.map(ax => {
            return ax.createConfig();
        });
    }

    createEChartConfig(coord: AxisCoordinate){
        var res = this.axes.values.filter(a => a.coordinate === coord).map(ax => {
            return ax.createEChartConfig();
        });
        return res;
    }

    @factory
    createAxis(coord: AxisCoordinate){
        var ax = new GridAxis(coord);
        return ax;
    }

    addNewAxis(coord: AxisCoordinate, indx: number){
        const ax = this.createAxis(coord);
        ax.name = coord+"-Axis "+(this.axes.length + 1)
        const ni = Math.max(0, Math.min(this.axes.length, indx));
        this.history.executeCommand(new InsertArrayItemCommand(this.axes, ax, ni));
        return ni;
    }

    getXAxisByIndex(index: number){
        return this.axes.values.filter(a => a.coordinate === "x")[index];
    }

    getYAxisByIndex(index: number){
        return this.axes.values.filter(a => a.coordinate === "y")[index];
    }

    getRelativeIndexForAxis(axis: GridAxis): number {
        var indx = 0;
        const comps = this.axes.values;
        for (var i=0; i < comps.length; i++){
            const c = comps[i];
            if (c === axis){
                return indx;
            }
            if (c.coordinate === axis.coordinate){
                indx++;
            }
        }
        return -1;
    }

    getNrOfXAxes(){
        return this.axes.values.filter(a => a.coordinate === "x").length;
    }

    getNrOfYAxes(){
        return this.axes.values.filter(a => a.coordinate === "y").length;
    }

}

var typeToIcon = {
    value: getIconShape(IconSet.arrow_up_right),
    category: getIconShape(IconSet.categorical_axis),
    time: getIconShape(IconSet.clock),
    log: getIconShape(IconSet.logarithmic_axis)
}


@component("axis")
export class GridAxis extends AbstractChartSettings implements IEChartSettingsComponent, IFocusableElement{

    constructor(public coordinate: AxisCoordinate){
        super();
    }

    @inject
    history: ChartHistory;

    @factory
    createSettings(){
        return new GridAxis(this.coordinate);
    }

    public r_type = variable<string>(null);
    public r_name = variable<string>(null);
    public r_show = variable(null);
    public r_columnId = variable<number>(null);
    public r_dataSource = variable(null);
    public data = new UpdateableTable();
    @create(function(this: GridAxis){
        var r = new HistoryUpdateableTable(this.data, this.history);
        return r;
    })
    public changeableData: HistoryUpdateableTable<any>;
    public r_parsedData = variable<string[]>([]);
    public r_min = variable(null);
    public r_max = variable(null);
    axisLine = new AxisLineSettings();
    axisLabel = new AxisLabel();
    builder = new ConfigBuilder();
    public r_scale = variable(null);
    public r_position = variable<string>(null);
    public r_offset = variable<number>(null);
    public r_splitNumber = variable<number>(null);
    public r_minInterval = variable<number>(null);

    get minInterval(){
        return this.r_minInterval.value;
    }

    set minInterval(v){
        this.r_minInterval.value = v;
    }

    get splitNumber(){
        return this.r_splitNumber.value;
    }

    set splitNumber(v){
        this.r_splitNumber.value = v;
    }

    get offset(){
        return this.r_offset.value;
    }

    set offset(v){
        this.r_offset.value = v;
    }

    get position(){
        return this.r_position.value;
    }

    set position(v){
        this.r_position.value = v;
    }

    get scale(){
        return this.r_scale.value;
    }

    set scale(v){
        this.r_scale.value = v;
    }

    get max(){
        return this.r_max.value;
    }

    set max(v){
        this.r_max.value = v;
    }

    get min(){
        return this.r_min.value;
    }

    set min(v){
        this.r_min.value = v;
    }

    get parsedData(){
        return this.r_parsedData.value;
    }

    set parsedData(v){
        this.r_parsedData.value = v;
    }

    get dataSource(){
        return this.r_dataSource.value || "auto";
    }

    set dataSource(v){
        this.r_dataSource.value = v;
    }

    get columnId(){
        return this.r_columnId.value;
    }

    set columnId(v){
        this.r_columnId.value = v;
    }

    get show(){
        return this.r_show.value  === null ? true : this.r_show.value;
    }

    set show(v){
        this.r_show.value = v;
    }

    get name(){
        return this.r_name.value;
    }

    set name(v){
        this.r_name.value = v;
    }

    @inject
    grid: GridSettings;

    @inject
    settings: EChartSettings

    getIcon(){
        switch(this.coordinate){
            case "y":
                return getIconShape(IconSet.y_axis);
            case "x":
                return getIconShape(IconSet.x_axis);
        }
    }

    getTypeIcon(){
        return typeToIcon[this.type];
    }

    getName(){
        return this.name || "no name";
    }

    get type(){
        return this.r_type.value || "value";
    }

    set type(v){
        this.r_type.value = v;
    }

    applyConfig(c: any){
        if (c.type){
            this.type = c.type;
        }
        if ("show" in c){
            this.show = c.show;
        }
        if ("columnId" in c){
            this.columnId = c.columnId;
        }
        if (c.data){
            this.data.fromJson(c.data);
        }
        else
        {
            this.data.data = [[""],[""],[""],[""],[""],[""],[""],[""]];
        }
        if(c.dataSource){
            this.dataSource = c.dataSource;
        }
        if ("min" in c){
            this.min = c.min;
        }
        if ("max" in c){
            this.max = c.max;
        }
        this.builder.applyConfig(c);
    }

    createConfig(){
        var config = removeEmptyProperties({
            type: this.type,
            coordinate: this.coordinate,
            show: this.show,
            columnId: this.columnId,
            dataSource: this.dataSource,
            data: this.data.toJson(),
            min: this.min,
            max: this.max
        });
        return this.builder.createConfig(config);
    }

    parseData(){
        var d = this.data.data;
        var s = -1;
        var e = -2;
        for (var i=0; i < d.length; i++){
            var v = d[i][0];
            if (v || typeof v === "number"){
                if (s === -1){
                    s = i;
                }
                e = i;
            }
        }
        var res: any[] = [];
        for (var i=s; i <= e; i++){
            res.push(d[i]);
        }
        return res;

    }

    private parseDataForCol(index: number){
        var data = [];
        var parsed = this.settings.dataset.parsedData;
        if (parsed){
            for (var i=1; i < parsed.length; i++){
                data.push(parsed[i][index]+"");
            }
        }
        return data;
    }

    getChartDataIndex(){
        return this.settings.dataset.getParsedColumnForId(this.columnId);
    }

    createEChartConfig(){
        var res: any = {
            type: this.type,
            show: this.r_show.value,
            min: this.min,
            max: this.max
        };
        if (this.type === "category"){
            if (this.dataSource === "auto"){
                var d = this.parseDataForCol(0);
                if (d.length === 0){
                    d = null;
                }
                res.data = d;
            }
            else if (this.dataSource === "chart"){
                var indx = this.settings.dataset.getParsedColumnForId(this.columnId);
                if (typeof indx === "number"){
                    res.data = this.parseDataForCol(indx);
                }
                else
                {
                    res.data = [];
                }
            }
            else
            {
                res.data = this.parsedData;
            }
        }
        else if (this.type === "value"){
            if (this.scale !== null){
                res.scale = !this.scale;
            }
        }
        res.axisLine = this.axisLine.createConfig();
        res.axisLabel = this.axisLabel.createConfig();
        res.offset = this.offset;
        res.position = this.position;
        res.splitNumber = this.splitNumber;
        res.minInterval = this.minInterval;
        return removeEmptyProperties(res);
    }

    @factory
    createCategoriesTab(){
        var cat =  new AxisCategoriesTab();
        return cat;
    }

    @factory
    createStyleTab(){
        var r = new AxisStyleTab();
        return r;
    }

    private lastAdded: TabSection;
    private styleTab: AxisStyleTab;
    private categoriesTab: AxisCategoriesTab;
    private proc: IProcedure;

    activateFocus(ribbon: Ribbon){
        this.styleTab = this.createStyleTab();
        var section = new TabSection();
        this.lastAdded = section;
        section.name = [this.getIcon(), " ", this.name || "no name"];
        section.tabs.push(this.styleTab);
        this.proc = procedure(() => {
            section.tabs.remove(section.tabs.values.indexOf(this.categoriesTab));
            if (this.type === "category"){
                this.categoriesTab = this.createCategoriesTab();
                section.tabs.push(this.categoriesTab);
                this.styleTab.marginRight = "";
            }
            else
            {
                this.styleTab.marginRight = "4rem";
            }
        });
        ribbon.sections.push(section);
    }

    private removeSections(ribbon: Ribbon){
        ribbon.sections.remove(ribbon.sections.indexOf(this.lastAdded));
        this.lastAdded = null;
    }

    deactivateFocus(ribbon: Ribbon){
        if (this.proc){
            this.proc.cancel();
            this.removeSections(ribbon);
            this.proc = null;
        }
    }

    @init
    init(){
        this.r_parsedData.listener(v => {
            v.value = this.parseData();
        });
        this.builder.value("name", this.r_name);
        this.builder.config("axisLine", this.axisLine);
        this.builder.value("scale", this.r_scale)
        this.builder.value("position", this.r_position);
        this.builder.value("offset", this.r_offset);
        this.builder.config("axisLabel", this.axisLabel);
        this.builder.value("splitNumber", this.r_splitNumber);
        this.builder.value("minInterval", this.r_minInterval);
    }

}

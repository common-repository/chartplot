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
import {array, transaction} from "../../../../../../reactive";
import * as di from "../../../../../../di";
import {factory, inject} from "../../../../../../di";
import {EditorSettings} from "../../../editor/settings";
import {AxisCoordinate, GridAxis} from "./grid/axis";
import {InsertArrayItemCommand} from "../../../history/array";
import {ChartHistory, HistoryCommandGroup, IHistoryCommand} from "../../../history";
import {IFocusableElement} from "../../../editor/settings/options/chart";
import {GridSettings} from "./grid";
import {EditorProblems} from "../../../editor/error";
import {RibbonOptions} from "../../../editor/settings/options/ribbon";
import {Editor} from "../../../editor";

export interface ICoordinateSettings extends IEChartSettingsComponent, IFocusableElement{

    type: string;
    icon: any;
    name: string;

}

export interface IAxisInformation {

}

export class CoordinateCollectionSettings implements IEChartSettingsComponent{

    coordinates = array<ICoordinateSettings>();

    @inject
    editorSettings: EditorSettings;

    @inject
    editor: Editor

    @inject
    history: ChartHistory;

    @di.inject
    problems: EditorProblems;

    createConfig(): any{
        return this.coordinates.values.map(g => g.createConfig());
    }

    @factory
    createGrid(){
        var gs = new GridSettings();
        return gs;
    }

    applyConfig(config: any){
        this.coordinates.clear();
        config.forEach(gc => {
            let coord: ICoordinateSettings;
            switch(gc.type){
                case "grid":
                    coord = this.createGrid();
                    break;
            }
            coord.applyConfig(gc);
            this.coordinates.push(coord);
        });
    }

    createEChartConfig(): any{
        var res = this.coordinates.values.map(g => g.createEChartConfig());
        return res;
    }

    createEChartGridConfig(): any{
        if (this.isGridNeeded()){
            this.problems.provideProblem({
                type: "error",
                message: ["Some series need a cartesian coordinate system. ",{
                    tag: "a",
                    child: "Click here",
                    attr: {
                        href: "javascript:void(0)"
                    },
                    event: {
                        click: () => {
                            transaction(() => {
                                const index = this.addNewGrid(this.editor.editorSettings.options.coordinates.selected + 1);
                                this.editor.editorSettings.options.ribbon.selectedTab = RibbonOptions.COORDINATE_RIBBON_INDEX;
                                this.editor.editorSettings.options.coordinates.selected = index;
                                this.editor.editorSettings.options.chart.editMode = "coordinate";
                            });
                        }
                    }
                }, " to create a new cartesian coordinate system"]
            });
            return {};
        }
        var res: any = {};
        res.grid = this.coordinates.values.filter(g => g.type === "grid").map(g => g.createEChartConfig());

        const xAxes = [];
        var gridIndex = 0;
        this.coordinates.forEach(g => {
            if (g.type === "grid"){
                (<GridSettings>g).axes.createEChartConfig("x").forEach(xax => {
                    xax.gridIndex = gridIndex;
                    xAxes.push(xax);
                });
                gridIndex++;
            }
        });
        res.xAxis = xAxes;

        gridIndex = 0;
        const yAxes = [];
        this.coordinates.forEach(g => {
            if (g.type === "grid"){
                (<GridSettings>g).axes.createEChartConfig("y").forEach(yax => {
                    yax.gridIndex = gridIndex;
                    yAxes.push(yax);
                });
                gridIndex++;
            }
        });
        res.yAxis = yAxes;
        return res;
    }

    isGridNeeded(){
        return this.editorSettings.chart.isCategoricalNeeded() && this.coordinates.values.filter(f => f.type === "grid").length === 0;
    }

    addNewGrid(indx: number){
        const grid = this.createGrid();
        grid.applyConfig({
            name: "Cartesian "+(this.coordinates.length + 1),
            axes: [{
                coordinate: "x",
                type: "category",
                name: "X-Axis 1"
            },{
                coordinate: "y",
                name: "Y-Axis 1"
            }]
        });
        var ni = Math.max(0, Math.min(indx, this.coordinates.length));
        this.history.executeCommand(new InsertArrayItemCommand(this.coordinates, grid, ni));
        return ni;
    }

    addGridCoordinateIfNeeded(command: IHistoryCommand){
        if (this.editorSettings.chart.isCategoricalNeeded() && this.coordinates.length === 0){
            const grid = this.createGrid();
            grid.applyConfig({
                axes: [{
                    coordinate: "x",
                    type: "category"
                },{
                    coordinate: "y"
                }]
            })
            return new HistoryCommandGroup([command, new InsertArrayItemCommand(this.coordinates, grid,this.coordinates.length)]);
        }
        return command;
    }

    getAxisAtIndex(index: number, type: AxisCoordinate){
        let indx = 0;
        for (var i=0; i < this.coordinates.length; i++){
            const coord = this.coordinates.get(i);
            if (coord.type === "grid"){
                const axes = (<GridSettings>coord).axes.axes.values;
                for (var j=0; j < axes.length; j++){
                    var ax = axes[j];
                    if (ax.coordinate !== type){
                        continue;
                    }
                    if (indx === index){
                        return axes[j];
                    }
                    indx++;
                }
            }
        }
    }

    getGridForAxisIndex(index: number, type: AxisCoordinate){
        let indx = 0;
        for (var i=0; i < this.coordinates.length; i++){
            const coord = this.coordinates.get(i);
            if (coord.type === "grid"){
                const axes = (<GridSettings>coord).axes.axes.values;
                for (var j=0; j < axes.length; j++){
                    var ax = axes[j];
                    if (ax.coordinate !== type){
                        continue;
                    }
                    if (indx === index){
                        return coord;
                    }
                    indx++;
                }
            }
        }
    }

    getRelativeIndexForAxis(axis: GridAxis){
        let indx = 0;
        for (var i=0; i < this.coordinates.length; i++){
            const coord = this.coordinates.get(i);
            if (coord.type === "grid"){
                const relIndx = (<GridSettings>coord).axes.getRelativeIndexForAxis(axis);
                if (relIndx === -1){
                    indx += axis.coordinate === "x" ? (<GridSettings>coord).axes.getNrOfXAxes() : (<GridSettings>coord).axes.getNrOfYAxes();
                }
                else
                {
                    indx += relIndx;
                    return indx;
                }
            }
        }
        return -1;
    }

    getRelativeIndexForCoordinate(coordinate: ICoordinateSettings): number {
        var indx = 0;
        const comps = this.coordinates.values;
        for (var i=0; i < comps.length; i++){
            const c = comps[i];
            if (c === coordinate){
                return indx;
            }
            if (c.type === coordinate.type){
                indx++;
            }
        }
        return -1;
    }

    getGridAtIndex(index: number): GridSettings{
        return <GridSettings>this.coordinates.values.filter(c => c.type === "grid")[index];
    }

}

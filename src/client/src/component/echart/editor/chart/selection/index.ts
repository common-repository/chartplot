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
 
import *as di from "../../../../../../../di";
import {IStream} from "../../../../../../../reactive/src/event";
import {ChartPreview} from "../index";
import {procedure, unobserved, variable} from "../../../../../../../reactive";
import {EChartComponentIndex} from "../elements";
import {IUnifiedChartEvent, UnifyingChartInteractionEvents} from "../interaction";
import {ISelectedComponent} from "../elements/base";
import {EditorSettings} from "../../../../editor/settings";
import {GridAxis} from "../../../settings/coordinates/grid/axis";
import {GridSettings} from "../../../settings/coordinates/grid";
import color from "../../../../../color";
import {darkSelectionColor, lightSelectionColor} from "./color";

export class EChartComponentClickSelection{


    constructor(public chartComponentIndex: EChartComponentIndex, public selection: ChartSelectionComponent){

    }

    public hovered: ISelectedComponent;

    hover(ev: IUnifiedChartEvent){
        const x = ev.chartX;
        const y = ev.chartY;
        var selected = this.chartComponentIndex.select(x, y);
        var csel = this.selection.selected;
        if (csel){
            var indx = selected.indexOf(csel);
            if (indx > -1){
                if (csel.priority >= selected[0].priority){
                    this.hovered = csel;
                    return;
                }
            }
        }
        this.hovered = selected[0];
    }

    click(ev: IUnifiedChartEvent){
        return this.hovered;
    }

    out(){
        this.hovered = null;
    }

    clear(){
        this.out();
        this.selection.selected = null;
    }
}



function hoverShape(sel: ISelectedComponent, color: string){
    return {
        tag: "svg",
        style: {
            left: sel.xs-10+"px",
            top: sel.ys-10+"px",
            width: (sel.xe - sel.xs+19)+"px",
            height: (sel.ye - sel.ys+19)+"px",
            pointerEvents: "none",
            position: "absolute"
        },
        child: [{
            tag: "rect",
            get attr(){
                return {
                    x: "8",
                    y: "8",
                    width: (sel.xe - sel.xs+4)+"",
                    height: (sel.ye - sel.ys+4)+"",
                    style: `stroke: ${lightSelectionColor}; fill: none;stroke-width: 2; opacity: 0.4;`,
                }
            }
        },{
            tag: "rect",
            get attr(){
                return {
                    x: "8",
                    y: "8",
                    width: (sel.xe - sel.xs+4)+"",
                    height: (sel.ye - sel.ys+4)+"",
                    style: `stroke: ${darkSelectionColor}; fill: none;stroke-width: 2;stroke-dasharray: 5 5; opacity: 0.4;`,
                }
            }
        }]
    }
}

function selectShape(selComp: ISelectedComponent, color: string){
    return {
        tag: "svg",
        get style(){
            var sel = selComp.preview || selComp;
            return {
                left: sel.xs-10+"px",
                top: sel.ys-10+"px",
                width: (sel.xe - sel.xs+19)+"px",
                height: (sel.ye - sel.ys+19)+"px",
                pointerEvents: "none",
                position: "absolute"
            }
        },
        get child(){
            var r: any[] = [{
                tag: "rect",
                get attr(){
                    var sel = selComp.preview || selComp;
                    return {
                        x: "8",
                        y: "8",
                        width: (sel.xe - sel.xs+4)+"",
                        height: (sel.ye - sel.ys+4)+"",
                        style: `stroke: ${lightSelectionColor}; fill: none;stroke-width: 2;`,
                    }
                }
            },{
                tag: "rect",
                get attr(){
                    var sel = selComp.preview || selComp;
                    return {
                        x: "8",
                        y: "8",
                        width: (sel.xe - sel.xs+4)+"",
                        height: (sel.ye - sel.ys+4)+"",
                        style: `stroke: ${darkSelectionColor}; fill: none;stroke-width: 2;stroke-dasharray: 5 5;`,
                    }
                }
            }];
            if (selComp.shapes){
                r = r.concat(selComp.shapes());
            }
            return r;
        }
    }
}

var empty = [];

export class ChartSelectionComponent{

    @di.inject
    onResize: IStream<any>;

    @di.inject
    chartPreview: ChartPreview;

    @di.inject
    unifiedChartInteractionEvents: UnifyingChartInteractionEvents;

    @di.inject
    editorSettings: EditorSettings;

    public r_selector = variable<EChartComponentClickSelection>(null);

    get selector(){
        return this.r_selector.value;
    }

    set selector(v){
        this.r_selector.value = v;
    }

    public r_hoveredSelection = variable<ISelectedComponent[]>([]);

    get hoveredSelection(){
        return this.r_hoveredSelection.value;
    }

    set hoveredSelection(v){
        this.r_hoveredSelection.value = v;
    }

    public r_selected = variable<ISelectedComponent>(null);

    public r_highlighted = variable<ISelectedComponent>(null);

    get highlighted(){
        return this.r_highlighted.value;
    }

    set highlighted(v){
        this.r_highlighted.value = v;
    }

    get selected(){
        return this.r_selected.value;
    }

    set selected(v){
        this.r_selected.value = v;
    }

    public r_shapes = variable([]);

    get shapes(){
        return this.r_shapes.value;
    }

    set shapes(v){
        this.r_shapes.value = v;
    }

    @di.factory
    createEChartComponentIndex(chart){
        return new EChartComponentIndex(chart);
    }

    getSelectColor(){
        var bg = this.editorSettings.chart.backgroundColor;
        if (!bg){
            if (this.editorSettings.options.chart.theme === "dark"){
                return "rgb(177, 205, 253)";
            }
            return "rgb(77, 115, 153)";
        }
        if (color(bg).toHSL().l > 50){
            return "rgb(77, 115, 153)";
        }
        return "rgb(177, 205, 253)";
    }

    @di.init
    init(){
        this.r_selected.listener(val => {
            if (!this.selector){
                val.value = null;
                return;
            }
            const focused = this.editorSettings.options.chart.editMode;
            if (focused){
                switch(focused){
                    case "component":
                        const comp = this.editorSettings.chart.components.components.get(this.editorSettings.options.components.selected);
                        if (!comp){
                            val.value = null;
                            return;
                        }
                        let relIndex = this.editorSettings.chart.components.getRelativeIndexForComponent(comp);
                        val.value = this.selector.chartComponentIndex.getComponent(comp.type, relIndex);
                        return;
                    case "coordinate":
                        let coord = this.editorSettings.chart.coordinates.coordinates.get(this.editorSettings.options.coordinates.selected);
                        if (!coord){
                            val.value = null;
                            return;
                        }
                        switch(coord.type){
                            case "grid":
                                val.value = this.selector.chartComponentIndex.getComponent("grid", this.editorSettings.chart.coordinates.getRelativeIndexForCoordinate(coord));
                                return;
                        }
                        break;
                    case "axis":
                        coord = this.editorSettings.chart.coordinates.coordinates.get(this.editorSettings.options.coordinates.selected);
                        if (!coord){
                            val.value = null;
                            return;
                        }
                        const axis = <GridAxis>(<GridSettings> coord).axes.axes.get(this.editorSettings.options.coordinates.axes.selected);
                        if (!axis){
                            val.value = null;
                            return;
                        }
                        relIndex = this.editorSettings.chart.coordinates.getRelativeIndexForAxis(axis);
                        val.value = this.selector.chartComponentIndex.getComponent(axis.coordinate === "x" ? "xAxis" : "yAxis", relIndex);
                        return;
                    case "series":
                        const series = this.editorSettings.chart.series.seriesCollection.get(this.editorSettings.options.series.selected);
                        if (!series){
                            val.value = null;
                            return;
                        }
                        val.value = this.selector.chartComponentIndex.getComponent("series", this.editorSettings.chart.series.getChartIndexForSeries(series));
                        return;
                    case "chart":
                        val.value = this.selector.chartComponentIndex.getComponent("chart", 0);
                        return;
                }
            }
            val.value = null;
        });
        var lastSelected = null;
        this.unifiedChartInteractionEvents.unifiedEvent.observe(ev => {
            if (this.editorSettings.temporary.modus !== "normal"){
                return;
            }
            if (!this.selector){
                return;
            }
            let selected: any = null;
            switch(ev.type){
                case "down":
                    const sel = this.selector.click(ev);
                    selected = sel;
                    break;
                case "move":
                    this.selector.hover(ev);
                    break;
                case "out":
                    this.selector.out();
                    break;
            }
            if (lastSelected && this.selected !== lastSelected){
                lastSelected.deactivate && lastSelected.deactivate();
            }
            if (selected === null){

            }
            else if (selected){
                selected.activate();
                this.hoveredSelection = empty;
            }
            lastSelected = this.selected;
            if (this.selector.hovered){
                if (this.selector.hovered === this.selected){
                    this.hoveredSelection = empty;
                }
                else if (this.hoveredSelection && this.hoveredSelection[0] !== this.selector.hovered){
                    this.hoveredSelection = [this.selector.hovered];
                }
                else
                {
                    this.hoveredSelection = this.hoveredSelection;
                }
            }
            else {
                this.hoveredSelection = empty;
            }
        });
        var proc = procedure.timeout(() => {
            var chart = this.chartPreview.chart;
            if (chart){
                this.hoveredSelection = empty;
                this.selector = new EChartComponentClickSelection(unobserved(() => this.createEChartComponentIndex(chart)), this);
            }
        }, 10);
        this.onResize.observe(v => {
            proc.changedDirty();
        });

        var lastShapeSelected: any = {};

        procedure(() => {
            if (this.editorSettings.temporary.modus !== "normal"){
                return;
            }
            if (this.editorSettings.options.view.modus !== "edit"){
                this.shapes = [];
                return;
            }
            if (this.selected){
                if (this.selected !== lastShapeSelected.selected){
                    var s = selectShape(this.selected, this.getSelectColor());
                    lastShapeSelected = {selected: this.selected, shape: s};
                }
                else {
                    s = lastShapeSelected.shape;
                }
                this.shapes = [s];
            }
            else {
                lastShapeSelected = {};
                this.shapes = [];
            }
            var sel = this.hoveredSelection;
            this.shapes = this.shapes.concat(sel.map(s => hoverShape(s, this.getSelectColor())));
        });
        this.chartPreview.onFinished.observe(of => {
            proc.changedDirty();
        });
        var lastHighlighted: ISelectedComponent = null;
        procedure(() => {
            var sel = this.selected;
            if (sel !== lastHighlighted){
                if (lastHighlighted){
                    lastHighlighted.unhighlight && lastHighlighted.unhighlight();
                }
                if (sel){
                    sel.highlight && sel.highlight();
                }
            }
            lastHighlighted = sel;
            this.highlighted = sel;
        });
    }

}

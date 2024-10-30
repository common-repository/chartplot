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
 
import {IHtmlRenderContext} from "../../../../../../html/src/html/node/context";
import * as di from "../../../../../../di";
import {factory, inject} from "../../../../../../di";
import {event, ICancellable, procedure, variable} from "../../../../../../reactive";
import {default as stream, IStream} from "../../../../../../reactive/src/event";
import {IVariable} from "../../../../../../reactive/src/variable";
import {ChartSelectionComponent} from "./selection";
import {ResizableSurfaceComponent} from "./components";
import {ResizeComponents} from "../resize";
import {UnifyingChartInteractionEvents} from "./interaction";
import {EChartSettings} from "../../settings";
import {EditorMenu} from "../../../editor/menu";
import {Toolbar} from "../../../editor/toolbar";
import {EditorSettings} from "../../../editor/settings";
import {ChartEventCatcher} from "./event";
import {Editor} from "../../../editor";
import {noChanges} from "../../../../../../reactive/src/procedure";
import {EChartProcessor} from "../../settings/process";

declare var echarts: any;

export class EChartObject{

    tag: "custom" = "custom";
    inited = false;
    public r_chart = variable(null);
    timeout: any;

    get chart(){
        return this.r_chart.value;
    }

    set chart(v){
        this.r_chart.value = v;
    }

    constructor(public options: any, public processor: EChartProcessor){
        this.resizer = function(){
            if (this.chart){
                this.chart.resize();
            }
        }.bind(this);
    }

    @di.inject
    onResize: IStream<any>;
    resizer;
    observed: boolean;

    onFinished: IStream<void> = stream();

    @di.inject
    editorSettings: EditorSettings;

    onAttached(){

    }

    onDetached(){
        if (this.timeout){
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        if (this.chart){
            this.chart.dispose();
            this.chart = null;
        }
        if (this.observed){
            this.onResize.unobserve(this.resizer);
            this.observed = false;
        }
        this.inited = false;
    }

    refresh(){
        this.chart.repaint();
    }

    getIdToPosition(){
        var idToPosition = {};
        this.chart._componentsViews.forEach(cv => {
            if (cv._model){
                var id = cv._model.id;
                const pos = cv.group.position;
                const dims = cv.group.getBoundingRect();
                idToPosition[id] = {
                    x: pos[0],
                    y: pos[1],
                    width: dims.width,
                    height: dims.height
                }
            }
        });
        return idToPosition;
    }

    render(ctx: IHtmlRenderContext){
        if (this.inited){
            return;
            //this.onDetached();
        }
        setTimeout(() => {
            this.chart = echarts.init(ctx.element, this.editorSettings.options.chart.theme);
            try{
                this.chart.setOption(this.options);
                this.processor.start(this.chart);
                this.onResize.observe(this.resizer);
                this.chart.on('finished', () => {
                    this.onFinished.fire(null);
                });
                this.observed = true;
            }
            catch (e) {
                console.error(e);
            }
        }, 0);
        this.inited = true;
    }

}


export function icon(settings){
    return {
        tag: "i",
        attr: {
            class: "fa fa-"+settings.icon
        }
    }
}

declare var $;

export interface IChartPreviewEvent{

    name: string;
    event: Event

}

export class ChartPreview {

    node: any;

    @inject
    editor: Editor;

    @di.inject
    settings: EChartSettings

    @di.inject
    cancels: ICancellable[]

    @di.inject
    onResize: IStream<any>;

    onFinished: IStream<any> = stream();

    @di.inject
    resizeComponents: ResizeComponents

    @di.create(function(this: ChartPreview){
        return event();
    })
    onEvent: IStream<IChartPreviewEvent>;

    @di.create
    preview: variable.IVariable<EChartObject>;

    @di.create(function(this: ChartPreview){
        return new UnifyingChartInteractionEvents();
    })
    unifiedChartInteractionEvents: UnifyingChartInteractionEvents;

    @di.create(function(this: ChartPreview){
        return new ChartSelectionComponent();
    })
    chartSelection: ChartSelectionComponent;

    @di.inject
    editorSettings: EditorSettings

    @di.create(() => new ChartEventCatcher())
    eventCatcher: ChartEventCatcher;

    private chartDiv: any;

    get chart(){
        var eo =  this.preview.value;
        if (!eo){
            return null;
        }
        return eo.chart;
    }

    getShapeDimensions(){
        return this.chartDiv.getShapeDimensions();
    }


    create_preview() {
        var res = variable<EChartObject>(null);
        return res;
    }

    private lastSettings: any;

    @factory
    createProcessor(){
        return new EChartProcessor();
    }

    start(){
        var handle: any = null;
        var proc = procedure.timeout(() => {
            var ui = this.editorSettings.temporary.updateImmediate;
            if (!ui){
                var proc = this.createProcessor();
                var ch = proc.process(this.settings.createEChartConfig());
                this.lastSettings = ch;
                const self = this;
                (function(){
                    const pp = proc;
                    if (handle){
                        clearTimeout(handle);
                    }
                    handle = setTimeout(() => {
                        handle = null;
                        self.updateChart(self.lastSettings, pp);
                    }, 300);
                })();

            }
            else
            {
                noChanges(() => {
                    this.editorSettings.temporary.updateImmediate = false;
                });
                if (handle){
                    clearTimeout(handle);
                    handle = null;
                }
                var proc = this.createProcessor();
                ch = proc.process(this.settings.createEChartConfig());
                this.lastSettings = ch;
                this.updateChart(ch, proc);
            }
        }, 1);
        this.cancels.push(proc);
    }

    private updateChart(ch, proc: EChartProcessor){
        var res = this.preview;
        var chartObject: EChartObject;
        this.editorSettings.options.chart.theme;
        if (ch) {
            chartObject = this.createEChart(ch, proc);
            chartObject.onFinished.observe(f => this.onFinished.fire(null));
        }
        else {
            chartObject = null;
        }
        res.value = chartObject;
    }

    @di.create(function (this: ChartPreview) {
        var res = variable(20);
        this.onResize.observe(e => {
            if (this.chartShape.node) {
                var rect = (<Element>this.chartShape.node.element).getBoundingClientRect();
                res.value = rect.height;
            }
        });
        return res;
    })
    public r_containerHeight: IVariable<number>;

    get containerHeight() {
        return this.r_containerHeight.value;
    }

    set containerHeight(v) {
        this.r_containerHeight.value = v;
    }

    @di.factory
    createEChart(settings, processor: EChartProcessor) {
        return new EChartObject(settings, processor);
    }

    @di.create(function (this: ChartPreview) {
        const self = this;
        var chartHolder = {
            tag: "div",
            style: {
                width: "100%",
                height: "100%",
                position: "relative"
            },
            attr: {
                class: "chart-holder"
            },
            get child(){
                return [self.chartDiv, {
                    tag: "div",
                    get child(){
                        return self.chartSelection.shapes
                    }
                }];
            }
        }
        var surface = new ResizableSurfaceComponent([chartHolder]);
        procedure(() => {
            switch(self.menu.ribbon.view.canvasSize.dimension.dimension.activeScreen){
                case "mobile":
                    surface.fixedScreen(320, 480);
                    break;
                case "tablet":
                    surface.fixedScreen(480, 800);
                    break;
                case "desktop":
                    surface.fixedScreen(1280, 1024);
                    break;
                case "fullscreen":
                    surface.fullscreen();
                    break;
                case "custom":
                    surface.fixedScreen(self.menu.ribbon.view.canvasSize.dimension.width.value || 400, self.menu.ribbon.view.canvasSize.dimension.height.value || 300);
                    break;
                default:
                    surface.maxScreen(800, 600);
            }
            self.resizeComponents.triggerResize();
        });
        surface.tdContent = self.eventCatcher;
        return surface;
    })
    chartShape: ResizableSurfaceComponent;

    @di.inject
    toolbar: Toolbar

    @di.inject
    menu: EditorMenu

    @di.create(function (this: ChartPreview) {
        const self = this;
        return {
            tag: "div",
            attr: {
                class: "card-chart"
            },
            style: {
                width: "100%",
                height: "100%",
                position: "relative",
                get overflow() {
                    switch (self.menu.ribbon.view.canvasSize.dimension.dimension.activeScreen) {
                        case "mobile":
                        case "desktop":
                        case "tablet":
                        case "custom":
                            return "auto";
                    }
                    return "hidden";
                }
            },
            get child(){
                var res: any[] = [self.chartShape];
                return res;
            }
        }
    })
    shape

    @di.init
    init(){
        this.chartSelection;
        const self = this;
        this.chartDiv = {
            tag: "div",
            style: {
                width: "100%",
                height: "100%",
                position: "relative"
            },
            getShapeDimensions(){
                if (this.node){
                    return (<HTMLElement>this.node.element).getBoundingClientRect();
                }
                return {
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0
                }
            },
            get child(){
                return self.preview.value
            }
        };
    }

}

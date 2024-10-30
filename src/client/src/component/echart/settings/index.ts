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
 
import {IEChartSettingsComponent} from "./base";
import * as di from '../../../../../di';
import {create, factory, init, inject} from '../../../../../di';
import {EChartDatasetSettings} from "./dataset";
import {EChartSeriesCollectionSettings} from "./series";
import {ChartTemplateSettings} from "./template";
import {removeEmptyProperties} from "../../../../../core/src/object";
import {CoordinateCollectionSettings} from "./coordinates";
import {IVariable} from "../../../../../reactive/src/variable";
import {array, variable} from "../../../../../reactive";
import {ComponentCollectionSettings} from "./components";
import {Ribbon, TabSection} from "../../editor/ribbon";
import {DataRibbonTab} from "../../editor/ribbon/data";
import {getIconShape, IconSet} from "../../icon";
import {IReactiveArray} from "../../../../../reactive/src/array";
import {Editor} from "../../editor";
import {ChartAxisPointerSettings} from "./axisPointer";
import {ConfigBuilder} from "./util";
import {extend} from "../../../../../core";

export class EChartSettings implements IEChartSettingsComponent{

    @di.create(() => new EChartDatasetSettings())
    dataset: EChartDatasetSettings;

    @di.create(() => new EChartSeriesCollectionSettings())
    series: EChartSeriesCollectionSettings;

    @di.create(() => new ChartTemplateSettings())
    template: ChartTemplateSettings;

    @di.create(() => new CoordinateCollectionSettings())
    coordinates: CoordinateCollectionSettings;

    @di.create(() => new ComponentCollectionSettings())
    components: ComponentCollectionSettings;

    @inject
    editor: Editor;

    public color: IReactiveArray<string> = array();

    builder = new ConfigBuilder();

    @create(() => new ChartAxisPointerSettings())
    axisPointer: ChartAxisPointerSettings;

    public r_backgroundColor = variable(null);

    get backgroundColor(){
        return this.r_backgroundColor.value;
    }

    set backgroundColor(v){
        this.r_backgroundColor.value = v;
    }

    applyConfig(c: any){
        this.dataset.applyConfig(c.dataset || {});
        this.series.applyConfig(c.series || []);
        this.coordinates.applyConfig(c.coordinates || []);
        this.template.applyConfig(c.template || {});
        this.components.applyConfig(c.components || []);
        this.color.values = c.color || ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
        this.backgroundColor = c.backgroundColor || null;
        this.builder.applyConfig(c);
    }

    getColorFromPalette(index: number){
        return this.color.get(index % this.color.length);
    }

    createConfig(){
        return this.builder.createConfig(removeEmptyProperties({
            dataset: this.dataset.createConfig(),
            series: this.series.createConfig(),
            template: this.template.createConfig(),
            coordinates: this.coordinates.createConfig(),
            components: this.components.createConfig(),
            color: this.color.values,
            backgroundColor: this.backgroundColor
        }));
    }

    createEChartConfig(){
        this.editor.problems.clear();
        return removeEmptyProperties(extend({
            dataset: this.dataset.createEChartConfig(),
            series: this.series.createEChartConfig(),
            color: this.color.values,
            tooltip: {
                show: true
            },
            backgroundColor: this.backgroundColor,
            axisPointer: this.axisPointer.createEChartConfig()
        }, this.coordinates.createEChartGridConfig(), this.components.createEChartConfig()))
    }

    r_categoricalNeeded: IVariable<boolean>;

    isCategoricalNeeded(){
        return this.r_categoricalNeeded.value;

    }

    @factory
    createDateTab(){
        var data = new DataRibbonTab()
        data.marginRight = "5rem";
        return data;
    }

    @init
    init(){
        this.r_categoricalNeeded = variable(false).listener(val => {
            var needed = false;
            this.series.seriesCollection.forEach(sc => {
                needed = needed || sc.isCategoricalNeeded();
            });
            val.value = needed;
        });
        this.builder.config("axisPointer", this.axisPointer);
    }

    activateFocus(ribbon: Ribbon){
        var section = new TabSection();
        section.name = [getIconShape(IconSet.chartplot_logo), " chart"];
        section.tabs.push(this.createDateTab());
        ribbon.sections.push(section);
    }

    deactivateFocus(ribbon: Ribbon){
        ribbon.sections.values = [];
    }

}

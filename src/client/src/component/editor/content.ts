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
 
import {procedure, variable} from '../../../../reactive';
import {IHtmlShapeTypes} from "../../../../html/src/html/node";
import {HorizontalSplitComponent} from "../echart/editor/split";
import {factory, init, inject} from "../../../../di";
import {ChartPreview} from "../echart/editor/chart";
import {EChartSettings} from "../echart/settings";
import {EChartDatasetTable} from "../echart/view/dataset";
import {EditorSettings} from "./settings";
import {Editor} from "./index";
import {AxisRibbonTab} from "./ribbon/coords/axis";

export class ChartSettingsContent{

    split: HorizontalSplitComponent;

    @inject
    chartPreview: ChartPreview;

    @inject
    settings: EChartSettings;

    get child(){
        return this.split;
    }

    @factory
    createHorizontalSplit(){
        return new HorizontalSplitComponent();
    }

    public r_table = variable<EChartDatasetTable>(null);

    get table(){
        return this.r_table.value;
    }

    set table(v){
        this.r_table.value = v;
    }

    activateListSplit(content: IHtmlShapeTypes){
        this.split.left = content;
    }

    activateDataSplit(content: IHtmlShapeTypes = null){
        this.split.bottom = content;
    }

    @inject
    editorSettings: EditorSettings;

    @inject
    editor: Editor;

    @init
    init(){
        this.split = this.createHorizontalSplit();
        this.split.main = this.chartPreview.shape;
        var table = this.settings.dataset.sourceView.createTable();
        this.table = table;
        procedure((v) => {
            const focused = this.editorSettings.options.chart.editMode;
            if (focused){
                switch(focused){
                    case "series":
                        this.editor.content.activateListSplit(this.editor.menu.ribbon.series.collection.section);
                        return;
                    case "coordinate":
                        this.editor.content.activateListSplit(this.editor.menu.ribbon.coordinates.collection.section);
                        return;
                    case "axis":
                        var secs = this.editor.menu.ribbon.sections.get(0);
                        if (secs && secs.tabs.get(0)){
                            var at = <AxisRibbonTab>secs.tabs.get(0);
                            if (! (at instanceof AxisRibbonTab)){
                                break;
                            }
                            this.editor.content.activateListSplit(at.collection.section);
                            return;
                        }
                        else
                        {
                            break;
                        }
                    case "component":
                        this.editor.content.activateListSplit(this.editor.menu.ribbon.component.collection.section);
                        return;
                }
            }
            this.editor.content.activateListSplit(null);
        });

    }

}

export class EditorContent{

    tag: "div";
    attr: any;

    public r_child = variable<IHtmlShapeTypes>("");

    get child(){
        return this.r_child.value;
    }

    set child(v){
        this.r_child.value = v;
    }

}

EditorContent.prototype.tag = "div";
EditorContent.prototype.attr = {
    class: "content"
}

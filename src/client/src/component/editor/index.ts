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
 
import * as di from '../../../../di';
import {component, define} from '../../../../di';
import {EditorMenu} from "./menu";
import {ChartSettingsContent} from "./content";
import {RightToolbar, Toolbar} from "./toolbar";
import {ChartHistory} from "../history";
import {EChartEditorBase} from "../echart/editor/base";
import {array, transaction, variable} from "../../../../reactive";
import {IHtmlShapeTypes} from "../../../../html/src/html/node";
import {EditorProblems} from "./error";
import {ChartIntro} from "./intro";

@component("editor")
export class Editor extends EChartEditorBase{

    tag: "div";
    attr: any;

    @define
    public shapes = array<IHtmlShapeTypes>();

    @di.create(() => new EditorMenu())
    menu: EditorMenu;

    @di.create(() => new ChartSettingsContent())
    content: ChartSettingsContent;

    @di.create(() => new Toolbar())
    toolbar: Toolbar;

    @di.create(() => new RightToolbar())
    rightToolbar: RightToolbar;

    @di.create(() => new ChartHistory())
    history: ChartHistory;

    @di.create(() => new EditorProblems())
    problems: EditorProblems;

    @di.create(() => new ChartIntro())
    intro: ChartIntro;

    get child(){
        if (this.isIntro){
            return this.intro;
        }
        return (<IHtmlShapeTypes[]>[this.menu, this.menu.ribbon.content, this.content.split]).concat(this.shapes.values);
    }

    public r_isIntro = variable(true);

    get isIntro(){
        return this.r_isIntro.value;
    }

    set isIntro(v){
        this.r_isIntro.value = v;
    }

    start(){
        this.chartPreview.start();
    }

    import(config){
        transaction(() => {
            this.editorSettings.applyConfig(config);
        });
    }

    constructor(){
        super();
        const self = this;
        this.attr = {
            id: "chartplot-editor",
            get class(){
                if (self.menu.rightToolbar.maximize.isMaximized){
                    return "chartplot-editor maximized";
                }
                return "chartplot-editor"
            }
        }
    }

}

Editor.prototype.tag = "div";

Editor.prototype.attr = {
    class: "chartplot-editor",

}

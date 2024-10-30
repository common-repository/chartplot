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
 
import * as di from "../../../../../di";
import {globalResize, ResizeComponents} from "./resize";
import {ChartPreview} from "./chart";
import {EChartSettings} from "../settings";
import {EditorSettings} from "../../editor/settings";
import {PopupStack, RibbonSinglePopupSystem, SinglePopupSystem} from "../../popup";

export class EChartEditorBase{

    @di.create(function(this: EChartEditorBase){
        return this.editorSettings.chart
    })
    settings: EChartSettings

    @di.create(() => new EditorSettings())
    editorSettings: EditorSettings

    @di.define
    cancels = []

    @di.create(function(this: EChartEditorBase){
        return new ResizeComponents();
    })
    resizeComponents: ResizeComponents;

    @di.create(function(this: EChartEditorBase){
        return this.resizeComponents.onResize;
    })
    onResize

    @di.init
    init(){
        globalResize(this.cancels, this.resizeComponents.triggerResize);
    }

    cancel(){
        this.cancels.forEach(c => c.cancel());
    }

    @di.create(function(this: EChartEditorBase){
        return new ChartPreview();
    })
    chartPreview: ChartPreview

    @di.create(() => new RibbonSinglePopupSystem())
    popupSystem: RibbonSinglePopupSystem

    @di.create(() => new PopupStack())
    popupStack: PopupStack;

}

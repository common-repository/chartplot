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
 
import {AbstractSelectedComponent, createStandardIndexer} from "./base";
import {EChartSettings} from "../../../settings";
import *as di from "../../../../../../../di";
import {EditorSettings} from "../../../../editor/settings";
import {RibbonOptions} from "../../../../editor/settings/options/ribbon";
import {Editor} from "../../../../editor";
import {EChartPositionUtils} from "../../../settings/position";

export class GridComponent extends AbstractSelectedComponent{

    priority = 5;

    @di.inject
    settings: EChartSettings;

    @di.inject
    editorSettings: EditorSettings;

    @di.inject
    editor: Editor

    constructor(){
        super();
    }

    getModel(model: EChartSettings){
        var index = this.component.__ecComponentInfo.index;
        return model.coordinates.getGridAtIndex(index);
    }

    activate() {
        this.editorSettings.options.ribbon.selectedTab = RibbonOptions.COORDINATE_RIBBON_INDEX;
        this.editorSettings.options.coordinates.selected = this.settings.coordinates.coordinates.values.indexOf(this.getModel(this.settings));
        this.editorSettings.options.chart.editMode = "coordinate";
    }

    init(component){
        this.component = component;
        const model = this.getModel(this.settings);
        if (!model){
            return false;
        }
        const dim = this.editor.content.chartPreview.getShapeDimensions();
        const self = this;
        EChartPositionUtils.applyDynamicSquareConfigSide({
            size: dim.width,
            pos: model.xPosDefault,
            componentSide: {
                get end(){
                    return self.xe;
                },
                set end(v){
                    self.xe = v;
                },
                get start(){
                    return self.xs;
                },
                set start(v){
                    self.xs = v;
                }
            },
            offset: 20
        });
        EChartPositionUtils.applyDynamicSquareConfigSide({
            size: dim.height,
            pos: model.yPosDefault,
            componentSide: {
                get end(){
                    return self.ye;
                },
                set end(v){
                    self.ye = v;
                },
                get start(){
                    return self.ys;
                },
                set start(v){
                    self.ys = v;
                }
            },
            offset: 40
        });
        return true;
    }


}

GridComponent.prototype.type = "grid";

export const indexGrid = createStandardIndexer(() => new GridComponent())

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
import {GridAxis} from "../../../settings/coordinates/grid/axis";

export class XAxisComponent extends AbstractSelectedComponent{

    priority = -100;

    @di.inject
    settings: EChartSettings;

    @di.inject
    editorSettings: EditorSettings;

    constructor(){
        super();
    }

    getModel(model: EChartSettings): GridAxis{
        var index = this.component.__ecComponentInfo.index;
        return model.coordinates.getAxisAtIndex(index, "x");
    }

    activate() {
        this.editorSettings.options.ribbon.selectedTab = RibbonOptions.COORDINATE_AXES;
        var ax = this.getModel(this.settings);
        this.editorSettings.options.coordinates.selected = this.settings.coordinates.coordinates.values.indexOf(ax.grid) || 0;
        this.editorSettings.options.coordinates.axes.selected = this.getModel(this.settings).grid.axes.axes.values.indexOf(this.getModel(this.settings)) || 0;
        this.editorSettings.options.chart.editMode = "axis";
    }


    calculateBoundingRect(component){
        let ca = component.childAt(0);
        if (!ca){
            return null;
        }
        ca = ca.childAt(0);
        if (!ca){
            return null;
        }
        var xs = Number.MAX_VALUE;
        var xe = -Number.MAX_VALUE;
        var ys = Number.MAX_VALUE;
        var ye = -Number.MAX_VALUE;
        var type = "line";
        ca.children().forEach(c => {
            if (c.type !== "line"){
                type = c.type;
            }
        });
        ca.children().forEach(c => {
            if (c.type === type){
                var br = c.getBoundingRect();
                const pos = c.transformCoordToGlobal(br.x, br.y);
                xs = Math.min(xs, pos[0]);
                xe = Math.max(xe, pos[0] + br.width);
                ys = Math.min(ys, pos[1]);
                ye = Math.max(ye, pos[1] + br.height);
            }
        });
        if (xs === Number.MAX_VALUE){
            return ca.getBoundingRect();
        }
        return {
            x: xs, y: ys, width: xe - xs, height: ye - ys
        };
    }

}

XAxisComponent.prototype.type = "xAxis";

export const indexXAxis = createStandardIndexer(() => new XAxisComponent());

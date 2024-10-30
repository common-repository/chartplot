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
 
import {IPointRectangle} from "../../../../../geometry/rectangle";
import {SelectedLegendItem} from "./legend";
import {transaction, variable} from "../../../../../../../reactive";
import {IHtmlShapeTypes} from "../../../../../../../html/src/html/node";
import array from "../../../../../../../reactive/src/array";

export interface ISelectedComponent extends IPointRectangle{

    component: any;
    type: string;
    activate();
    init(component);
    priority: number;
    preview?: IPointRectangle;
    highlight?();
    unhighlight?();
    shapes?(): IHtmlShapeTypes[];
    resetPriority?();

}

export abstract class AbstractSelectedComponent implements ISelectedComponent{

    xs: number;
    ys: number;
    xe: number;
    ye: number;
    priority = 0;

    component: any;
    type: any;
    abstract activate();
    abstract settings: any;
    abstract getModel(settings: any): any;


    public r_preview = variable<IPointRectangle>(null);

    get preview(){
        return this.r_preview.value;
    }

    set preview(v){
        this.r_preview.value = v;
    }

    init(component){
        const br = this.calculateBoundingRect(component);
        if (!br || isNaN(br.x) || isNaN(br.y) || isNaN(br.width) || isNaN(br.height)){
            this.xs = 0;
            this.ys = 0;
            this.xe = 0;
            this.ye = 0;
        }
        else
        {
            const pos = component.transformCoordToGlobal(br.x, br.y);
            this.xs = pos[0];
            this.ys = pos[1];
            this.xe = pos[0] + br.width;
            this.ye = pos[1] + br.height;
        }
        this.component = component;
        return true;
    }

    protected calculateBoundingRect(component){
        return component.getBoundingRect();
    }

}

export function createStandardIndexer(createComponent: () => ISelectedComponent){
    return function (component){
        var comp = createComponent();
        return [comp];
    }
}

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
 
import {createValueConstrainer, IValueConstraintsSettings, normalizeValueModifySettings} from "../value/constrain";
import {IPoint} from "./index";

/**
 * Defines the possible values this point can have
 */
export interface IPointConstraints{
    /**
     * Constraints of the x-value
     */
    x?: IValueConstraintsSettings;
    /**
     * Constraints of the y-value 
     */
    y?: IValueConstraintsSettings;
}

export function normalizePointConstraints(constraints: IPointConstraints = {}): IPointConstraints{
    return {
        x: normalizeValueModifySettings(constraints.x),
        y: normalizeValueModifySettings(constraints.y)
    }
}

export class PointConstrainer{

    public constrainX: (x: number) => number;
    public constrainY: (y: number) => number;

    public constrain(pt: IPoint){
        return {
            x: this.constrainX(pt.x),
            y: this.constrainY(pt.y)
        }
    }
}

export function createPointConstrainer(settings: IPointConstraints): PointConstrainer {
    var pc = new PointConstrainer();
    pc.constrainX = createValueConstrainer(settings.x);
    pc.constrainY = createValueConstrainer(settings.y);
    return pc;
}

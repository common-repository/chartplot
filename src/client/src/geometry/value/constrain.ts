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
 
/**
 * Min and max settings of a value
 */
export interface IValueConstraintsSettings{
    /**
     * Min value
     */
    min?: number;
    /**
     * Max value
     */
    max?: number;
}

export function normalizeValueModifySettings(minMax: IValueConstraintsSettings): IValueConstraintsSettings{
    if (!minMax){
        return {
            min: -Number.MAX_VALUE,
            max: Number.MAX_VALUE
        }
    }
    var res: IValueConstraintsSettings = {
        min: -Number.MAX_VALUE,
        max: Number.MAX_VALUE
    };
    if ("min" in minMax){
        Object.defineProperty(res, "min", Object.getOwnPropertyDescriptor(minMax, "min"));
    }
    if ("max" in minMax){
        Object.defineProperty(res, "max", Object.getOwnPropertyDescriptor(minMax, "max"));
    }
    return res;
}

export function createValueConstrainer(settings: IValueConstraintsSettings){
    var norm = normalizeValueModifySettings(settings);
    return function(x: number){
        return Math.min(norm.max, Math.max(norm.min, x));
    }
}

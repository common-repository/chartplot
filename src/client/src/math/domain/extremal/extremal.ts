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
 
import {extend} from "../../../../../core";
import {resizeIntervalByOrigin} from "../../../geometry/interval/resize";
import {IPointInterval} from "../../../geometry/interval/index";

export interface IDomainAddition{
    min: number;
    max: number;
}

export interface IDomainAdditionSettings{
    min?: number;
    max?: number;
}

export function normalizeDomainAdditionSettings(settings: number | IDomainAdditionSettings): IDomainAddition{
    if (!settings){
        return {
           min: 0, max: 0
        }
    }
    if (typeof settings === "number"){
        var s = <number> settings;
        return {
            min: s, max:s
        }
    }
    return extend({min: 0, max: 0}, settings);
}

export function addToDomain(settings: IDomainAddition, domain: IPointInterval){
    var s = domain.start;
    var e = domain.end;
    s += settings.min;
    e += settings.max;
    return {
        start: s, end: e
    }
}

function extendByOrigin(ivl: IPointInterval, origin: number): IPointInterval{
    var ivl = resizeIntervalByOrigin(ivl, origin);
    return {
        start: ivl.start, end: ivl.end
    }
}

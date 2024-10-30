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
 
import {IPointInterval} from "../../../../geometry/interval/index";
import {IValueData} from "../../../../datatypes/value";
import {createMaximizedSortedDomainCalculator} from "./data";
import {IPointRectangle} from "../../../../geometry/rectangle/index";
import {getEndX, IXIndexedData} from "../../../../datatypes/range";
import {IOptional} from "../../../../../../core";
import {IXSortedRingBuffer} from "../../../../collection/array/ring";

function getMinMax(value: IValueData): {min: number, max: number, xs: number, xe: number}{
    return {
        min: value.y,
        max: value.y,
        xs: value.x,
        xe: getEndX(value)
    }
}

export interface IHorizontalValueMaxDomainSettings{
    xDomain?: () => IPointInterval;
}

export function createHorizontalValueDomainDomain(settings: IHorizontalValueMaxDomainSettings): (data: IXSortedRingBuffer<IXIndexedData>) => IOptional<IPointRectangle>{
    return createMaximizedSortedDomainCalculator({
        xWindow: settings.xDomain,
        getMinMax: getMinMax
    });
}

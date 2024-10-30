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
 
import {IFlexibleDistanceTicks, ITicks} from "../marker/base";
import {IPointInterval} from "../../../geometry/interval/index";

/**
 * An axis contains information over the space of a chart
 */
export interface IAxis{
    /**
     * The interval of the visible portion of the 
     */
    window: IPointInterval;
    /**
     * The maximally visible interval of this axis
     */
    domain: IPointInterval;
}

/**
 * An axis containing ticks
 */
export interface ITickAxis extends IAxis{
    /**
     * Tick points that are used to identify "nice" label positions in the visible space of the axis. 
     */
    ticks: ITicks;
    /**
     * The @api{domain} extended to end and start with tick points
     */
    tickDomain: IPointInterval;
}


/**
 * An axis with flexible distance ticks
 */
export interface IFlexibleTickAxis extends ITickAxis{
    ticks: IFlexibleDistanceTicks;
}

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
 
import {ITickAxis} from "./axis";
import {IIterable} from "../../../collection/iterator/index";
import {IFlexibleDistanceTicks} from "../marker/base";

export function syncLogMarkerDomains(first: ITickAxis, toSync: IIterable<ITickAxis>){
    var it = toSync.iterator();
    var sd = first.domain.start;
    var ed = first.domain.end;
    while(it.hasNext()){
        var d = it.next();
        sd = Math.min(d.domain.start, sd);
        ed = Math.max(d.domain.end, ed);
        d.window.start = first.window.start;
        d.window.end = first.window.end;
        (<IFlexibleDistanceTicks>d.ticks).minDistance = (<IFlexibleDistanceTicks>first.ticks).minDistance;
        (<IFlexibleDistanceTicks>d.ticks).distance = (<IFlexibleDistanceTicks>first.ticks).distance;
    }
    sd = (<IFlexibleDistanceTicks>first.ticks).previous(sd);
    ed = (<IFlexibleDistanceTicks>first.ticks).next(ed);
    first.tickDomain.start = sd;
    first.tickDomain.end = ed;
    it = toSync.iterator();
    while(it.hasNext()){
        var d = it.next();
        d.tickDomain.start = sd;
        d.tickDomain.end = ed;
    }
}

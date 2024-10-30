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
 
import {IAxis, ITickAxis} from "./axis";
import {map1d} from "../../transform/index";
import {IIterable} from "../../../collection/iterator/index";

function syncLinear(first: IAxis, toSync: IAxis){
    var firstMax = first.domain;
    var firstDomain = first.window;
    var domain = toSync.domain;
    var mapper = map1d(firstMax).to(domain).create();
    var y = mapper(firstDomain.start);
    var ey = mapper(firstDomain.end);
    toSync.window.start = y;
    toSync.window.end = ey;
}

export function syncLinearDomains(first: IAxis, toSync: IIterable<IAxis>){
    var it = toSync.iterator();
    while(it.hasNext()){
        syncLinear(first, it.next());
    }
}

function syncLinearMarker(first: ITickAxis, toSync: ITickAxis){
    var firstMax = first.tickDomain;
    var firstDomain = first.window;
    var domain = toSync.tickDomain;
    var mapper = map1d(firstMax).to(domain).create();
    var y = mapper(firstDomain.start);
    var ey = mapper(firstDomain.end);
    toSync.window.start = y;
    toSync.window.end = ey;
}

export function syncLinearMarkerDomains(first: ITickAxis, toSync: IIterable<ITickAxis>){
    var it = toSync.iterator();
    while(it.hasNext()){
        syncLinearMarker(first, it.next());
    }
}

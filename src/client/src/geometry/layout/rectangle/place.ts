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
 
import {IIterable} from "../../../collection/iterator/index";
import {getOverlapArea, IRectangle} from "../../rectangle/index";
import {IPoint} from "../../point/index";
import {hash} from "../../../../../core";

export interface IRectangleAndPositions{
    rectangle: IRectangle;
    positions: IIterable<IPoint>;
}

export interface IRectanglePlacerSettings{
    
    possibilities: IRectangleAndPositions[];
    container: IRectangle;
}

export class RectanglePlacer{
    
    public currentPlacements: IRectangle[];
    public container: IRectangle;
    public minQuality: number;
    
    constructor(){
        
    }
    
    public getQuality(r: IRectangle): number{
        var overlapQuality = 1;
        this.currentPlacements.forEach((cr) => {
            var a = getOverlapArea(cr, r);
            var r1 = 1 - (a / (cr.width * cr.height));
            var r2 = 1 - a / ((r.width * r.height));
            overlapQuality = Math.min(overlapQuality, r1, r2);
            
        });
        var a = getOverlapArea(this.container, r);
        var ratio = a / (r.width * r.height);
        return Math.min(ratio, overlapQuality);
    }
    
    public place(set: IRectanglePlacerSettings){
        this.currentPlacements = [];
        var placements: {[s: string]: IPoint} = {};
        this.container = set.container;
        set.possibilities.slice().sort((a, b) => {
            return (b.rectangle.width * b.rectangle.height) - (a.rectangle.width * a.rectangle.height);
        }).forEach(p => {
            var it = p.positions.iterator();
            var r = p.rectangle;
            var best: IPoint = null;
            var lastQ = 0;
            while(it.hasNext()){
                var pt = it.next();
                r.x = pt.x;
                r.y = pt.y;
                var q = this.getQuality(r);
                if (q === 1){
                    best = pt;
                    lastQ = q;
                    break;
                }
                if (q > lastQ && q >= this.minQuality){
                    best = pt;
                    lastQ = q;
                }
            }
            if (best){
                r.x = best.x;
                r.y = best.y;
                this.currentPlacements.push(r);
                placements[hash(p)] = best;
            }
        });
        return set.possibilities.map(r => {
            return placements[hash(r)] || null;
        });
    }
    
}

RectanglePlacer.prototype.minQuality = 0.0;

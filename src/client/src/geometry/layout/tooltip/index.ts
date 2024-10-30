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
 
import {IArrowPosition, ILayoutTarget, ITooltipAndTarget, layoutGroupTooltip, topLeftPosition} from "./side4";
import {IPoint} from "../../point/index";
import {IDimension, IRectangle} from "../../rectangle/index";
import {default as iterator, IIterable, IIterator, mapIterator} from "../../../collection/iterator/index";
import {createDefaultRectanglePointsGenerator} from "./target";
import {IRectangleAndPositions, RectanglePlacer} from "../rectangle/place";


export interface ITooltipLayoutTarget{

    setArrowPosition: (p: IArrowPosition) => void;
    arrowSize: IDimension;
    setPosition: (s: IPoint) => void;
    boundingBox: IDimension;
    target: IRectangle;
}

export interface ITargetLayouterSettings{

    pointsProvider?: (target: IRectangle) => IIterator<ILayoutTarget>;

}

export function createTargetLayouter(settings: ITargetLayouterSettings = {}){
    var pointsProvider = settings.pointsProvider || createDefaultRectanglePointsGenerator();
    return function(tooltips: IIterator<ITooltipLayoutTarget>, container: IRectangle){
        var tooltipsArr: ITooltipLayoutTarget[] = [];
        var tttarg = iterator(tooltips).map(tt => {
            var res: ITooltipAndTarget;
            res = {
                targets: pointsProvider(tt.target),
                tooltip: tt.boundingBox
            };
            tooltipsArr.push(tt);
            return res;
        });
        var positions = layoutGroupTooltip({
            container: container,
            tooltips: tttarg
        });
        for (var i=0; i < positions.length; i++){
            var pos = positions[i];
            var t = tooltipsArr[i];
            t.setPosition(pos.position);
            t.setArrowPosition(pos.arrow);
        }
    }
}

export interface ITooltipLayouterSettings{
    
    boundingBox: IDimension;
    target: IRectangle;
    
}

class Iterable implements IIterable<IPoint>{
    
    constructor(public pts: IIterator<ILayoutTarget>, public tt: ITooltipLayouterSettings){
        
    }
    
    public iterator(){
        return mapIterator(this.pts, pt => {
            var p = topLeftPosition(pt.position, this.tt.boundingBox, pt.arrow);
            (<any>p)._arrow = pt.arrow;
            return p;
        })
    }
    
}

export class TooltipLayouter{
    
    constructor(){
        
    }
    
    public providePoints(target: IRectangle): IIterator<ILayoutTarget>{
        return null;
    }
    
    public placer: RectanglePlacer;
    
    public layout(tooltips: IIterator<ITooltipLayouterSettings>, container: IRectangle): IPoint[]{
        var poses: IRectangleAndPositions[] = [];
        while(tooltips.hasNext()){
            var tt = tooltips.next();
            var pts = this.providePoints(tt.target);
            poses.push({
                rectangle: {x: 0, y: 0, width: tt.boundingBox.width, height: tt.boundingBox.height},
                positions: new Iterable(pts, tt)
            });
        }
        var placements = this.placer.place({
            possibilities: poses,
            container: container
        });
        return placements.map(pl => {
            if (!pl){
                return null;
            }
            return pl;
        });
    }
    
}

TooltipLayouter.prototype.providePoints = createDefaultRectanglePointsGenerator();
TooltipLayouter.prototype.placer = new RectanglePlacer();

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
 
import {IIterator} from "../../../../collection/iterator";
import {IRectangle} from "../../../rectangle/index";
import {IInterval} from "../../../interval/index";
import rectangle from '../../../rectangle';
import interval from '../../../interval';

export type AxisFit = "FIT" | "TOO_MANY" | "TOO_FEW";

export interface IAxisFitnessMeasurer{

    add(rect: IRectangle): boolean;
    finish(): boolean;

}

export interface IFitnessAndRectangles{
    rectangles: IRectangle[];
    fitness: AxisFit;
}

export class TooManyFitnessMeasurer implements IAxisFitnessMeasurer{

    private last: IRectangle = null;
    private fits = true;

    public add(rect: IRectangle): boolean{
        if (!this.last)
        {
            this.last = rect;
            return this.fits;
        }
        var ov = rectangle(this.last).isOverlappingWith(rect);
        this.fits = this.fits && !ov;
        this.last = rect;
        return this.fits;
    }

    public finish(){
        return this.fits;
    }

}

export class TooFewFitnessMeasurer implements IAxisFitnessMeasurer{

    private last: IRectangle = null;
    private fits = false;
    private nr = 0;
    public tooLowRelation = 3;

    constructor(public intervalProvider: (r: IRectangle) => IInterval){

    }

    public add(child: IRectangle){
        this.nr++;
        if (!this.last)
        {
            this.last = child;
            return true;
        }
        var ch = child;
        var maxDist = 0;
        var int = this.intervalProvider(child);
        var lastInt = this.intervalProvider(this.last);
        var maxHeight = lastInt.size;
        maxHeight = Math.max(maxHeight, int.size);
        maxDist = Math.max(maxDist, interval(lastInt).distance(int));
        this.last = ch;
        this.fits = this.fits || !(maxDist / maxHeight > this.tooLowRelation);
        return true;
    }

    public finish(){
        if (this.nr < 2){
            return false;
        }
        return this.fits;
    }
}

export interface IRectangleFitnessEstimatorSettings{
    tooMany: () => IAxisFitnessMeasurer;
    tooFew: () => IAxisFitnessMeasurer;
}

export function createFitnessAndRectanglesCalculator(settings: IRectangleFitnessEstimatorSettings): (r: IIterator<IRectangle>) => IFitnessAndRectangles{
    return function(it: IIterator<IRectangle>){
        var tooFew = settings.tooFew();
        var tooMany = settings.tooMany();
        var rects: IRectangle[] = [];
        while(it.hasNext()){
            var rect = it.next();
            rects.push(rect);
            if (!tooFew.add(rect)){
                return {
                    fitness: "TOO_FEW",
                    rectangles: rects
                }
            }
            if (!tooMany.add(rect)){
                return {
                    fitness: "TOO_MANY",
                    rectangles: rects
                }
            }
        }
        if (!tooFew.finish()){
            return {
                fitness: "TOO_FEW",
                rectangles: rects
            }
        }
        if (!tooMany.finish()){
            return {
                fitness: "TOO_MANY",
                rectangles: rects
            }
        }
        return {
            fitness: "FIT",
            rectangles: rects
        }
    }
}



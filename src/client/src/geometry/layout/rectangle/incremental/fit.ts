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
 
import {IOptional, optional} from "../../../../../../core";
import {AxisFit, IFitnessAndRectangles} from "./fitness";
import {IRectangle} from "../../../rectangle/index";
import {IIterator} from "../../../../collection/iterator/index";

export interface IFitnessAndRectangleCollection{
    fitness: AxisFit;
    rectangles: IRectangle[][];
}

export interface IAxisLabelsLayoutSettings{
    estimateDistance: () => IOptional<number>;
    provideRectangles: (distance: number) => IFitnessAndRectangleCollection
    more: () => number;
    less: () => number;
}

export function fitRectanglesByDistance(settings: IAxisLabelsLayoutSettings): IOptional<IRectangle[][]>{
    var lastFit = "FIT";
    var fit = "TOO_MANY";
    var first = true;
    while(fit !== "FIT"){
        if (first){
            var dist = settings.estimateDistance();
            if (!dist.present){
                return optional<IRectangle[][]>();
            }
            var ed = dist.value;
            first = false;
        }
        if (isNaN(ed) || !isFinite(ed)){
            throw new Error("Error calculating labels");
        }
        var f = settings.provideRectangles(ed);
        fit = f.fitness;
        if (fit !== "FIT") {
            if (fit === "TOO_FEW") {
                if (lastFit === "TOO_MANY") {
                    return optional<IRectangle[][]>(f.rectangles);
                }
                else {
                    var lastDist = ed;
                    ed = settings.more();
                    if (lastDist === ed) {
                        return optional(f.rectangles);
                    }
                }
            }
            else {
                var lastDist = ed
                ed = settings.less();
                if (lastDist === ed) {
                    return optional(f.rectangles);
                }
            }
            lastFit = fit;
        }
    }
    return optional(f.rectangles);
}

export function summarizeFitnessAndRectangles(rects: IIterator<IFitnessAndRectangles>): IFitnessAndRectangleCollection{
    var fitness: AxisFit = "FIT";
    var rectangles: IRectangle[][] = [];
    while(rects.hasNext()){
        var r = rects.next();
        rectangles.push(r.rectangles);
        if (r.fitness === "TOO_MANY"){
            fitness = r.fitness;
        }
        else if (r.fitness === "TOO_FEW"){
            if (fitness !== "TOO_MANY"){
                fitness = "TOO_FEW";
            }
        }
    }
    return {
        fitness: fitness,
        rectangles: rectangles
    }
}

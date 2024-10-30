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
 
import {IPointRectangle} from "../../geometry/rectangle";
import {IPointInterval} from "../../geometry/interval/index";
import {PointRectangleXInterval, PointRectangleYInterval} from "../../geometry/rectangle/pointRect";

/**
 * The window is a rectangle that defines the visible portion of the data.
 */
export interface IWindow extends IPointRectangle{

    /**
     * The visible y-window of the data
     */
    yWindow: IPointInterval;
    /**
     * The visible x-window interval of the data
     */
    xWindow: IPointInterval;

}

export class Domain implements IWindow{

    constructor(public rectangle: IPointRectangle){

    }

    get xs(){
        return this.rectangle.xs;
    }

    set xs(v: number){
        this.rectangle.xs = v;
    }

    get ys(){
        return this.rectangle.ys;
    }

    set ys(v: number){
        this.rectangle.ys = v;
    }

    get xe(){
        return this.rectangle.xe;
    }

    set xe(v: number){
        this.rectangle.xe = v;
    }

    get ye(){
        return this.rectangle.ye;
    }

    set ye(v: number){
        this.rectangle.ye = v;
    }

    get yWindow(): IPointInterval{
        return new PointRectangleYInterval(this);
    }

    get xWindow(): IPointInterval{
        return new PointRectangleXInterval(this);
    }

}

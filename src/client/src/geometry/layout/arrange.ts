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
 
import {IRectangle} from "../rectangle/index";
export interface IArrangement{
    (rect: IRectangle): IArrangement;
}

export class RectangleArrangement{

    public start: number = 0;
    private _margin = 0;

    constructor(){

    }

    public margin(margin: number) {
        this._margin = margin;
        return this;
    }

    public startFrom(start: number) {
        this.start = start;
        return this;
    }

    public leftToRight(): IArrangement{
        var _this = this;
        var left = this.start;
        function arr(rect: IRectangle) {
            rect.x = left;
            left += _this._margin + rect.width;
            return arr;
        }
        return arr;
    }

    public rightToLeft(): IArrangement {
        var _this = this;
        var right = this.start;
        function arr(rect: IRectangle){
            rect.x = right - rect.width;
            right -= rect.width + _this._margin;
            return arr;
        }
        return arr;
    }

    public topToBottom(): IArrangement {
        var _this = this;
        var pos = this.start;
        function arr(rect: IRectangle){
            rect.y = pos;
            pos += _this._margin + rect.height;
            return arr;
        }
        return arr;
    }

    public bottomToTop(): IArrangement {
        var _this = this;
        var pos = this.start;
        function arr(rect: IRectangle){
            rect.y = pos - rect.height;
            pos -= rect.height + _this._margin;
            return arr;
        }
        return arr;
    }

}

export default function arrange() {
    return new RectangleArrangement();
}


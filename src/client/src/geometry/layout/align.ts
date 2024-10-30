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
export class Aligner {

    private pos = 0;

    constructor(){
        
    }

    public position(position: number) {
        this.pos = position;
        return this;
    }

    public centerHorizontal(rect: IRectangle) {
        rect.x = this.pos - (rect.width / 2);
        return this;
    }

    public centerVertical(rect: IRectangle) {
        rect.y = this.pos - (rect.height / 2);
        return this;
    }

    public top(rect: IRectangle){
        rect.y = this.pos;
        return this;
    }

    public bottom(rect: IRectangle) {
        rect.y = this.pos - rect.height;
        return this;
    }

    public left(rect: IRectangle) {
        rect.x = this.pos;;
        return this;
    }

    public right(rect: IRectangle) {
        rect.x = this.pos - rect.width;;
        return this;
    }

}

export function top(pos: number, rect: IRectangle){
    rect.y = pos;
}

export function centerHorizontal(pos: number, rect: IRectangle){
    rect.x = pos - (rect.width / 2);
}

export function centerVertical(pos: number, rect: IRectangle){
    rect.y = pos - (rect.height / 2);
}

export function right(pos: number, rect: IRectangle){
    rect.x = pos - rect.width;
}

export default function align() {
    return new Aligner();
}

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
 
import {variable} from "../../../../../../reactive";
import {IHtmlShapeTypes} from "../../../../../../html/src/html/node";

export class SpaceSurface{
    tag = "div"
    attr = {
        class: "content-space"
    }
}

export class TripleSurface{

    tag = "div";

    attr = {
        class: "triple"
    }

    public r_top = variable<IHtmlShapeTypes | IHtmlShapeTypes[]>("");

    get top(){
        return this.r_top.value;
    }

    set top(v){
        this.r_top.value = v;
    }

    public r_middle = variable<IHtmlShapeTypes | IHtmlShapeTypes[]>("");

    get middle(){
        return this.r_middle.value;
    }

    set middle(v){
        this.r_middle.value = v;
    }

    public r_bottom = variable<IHtmlShapeTypes | IHtmlShapeTypes[]>("");

    get bottom(){
        return this.r_bottom.value;
    }

    set bottom(v){
        this.r_bottom.value = v;
    }

    get child(){
        const self = this;
        return [{
            tag: "div",
            attr: {
                class: "top"
            },
            get child(){
                return self.top;
            }
        },{
            tag: "div",
            attr: {class: "middle"},
            get child(){
                return self.middle;
            }
        },{
            tag: "div",
            attr: {class: "bottom"},
            get child() {
                return self.bottom;
            }
        }]
    }

}

export class DoubleSurface{

    tag = "div";

    attr = {
        class: "double"
    }

    public r_top = variable<IHtmlShapeTypes | IHtmlShapeTypes[]>("");

    get top(){
        return this.r_top.value;
    }

    set top(v){
        this.r_top.value = v;
    }

    public r_bottom = variable<IHtmlShapeTypes | IHtmlShapeTypes[]>("");

    get bottom(){
        return this.r_bottom.value;
    }

    set bottom(v){
        this.r_bottom.value = v;
    }

    get child(){
        const self = this;
        return [{
            tag: "div",
            attr: {
                class: "top"
            },
            get child(){
                return self.top;
            }
        },{
            tag: "div",
            attr: {class: "bottom"},
            get child() {
                return self.bottom;
            }
        }]
    }

}

export class RowSurface {
    tag = "div"

    attr = {
        class: "ribbon-row"
    }

    constructor(public children: any[] = []){

    }

    get child(){
        return this.children.map(c => {
            return {
                tag: "div",
                attr: {
                    class: "ribbon-row-item"
                },
                child: c
            }
        });
    }
}

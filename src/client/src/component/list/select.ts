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
 
import {array} from "../../../../reactive";

export class SelectListItem{
    tag = "div";
    attr: any;
    event: any;
    child: any;

    constructor(){
        this.event = {
            click: (ev) => {
                this.action(ev);
            }
        }
        this.attr = {
            class: "list-item"
        }
    }

    action(event: Event){

    }

    setAction(action: (ev: Event) => void){
        this.action = action;
        return this;
    }
}

export interface ILabelAndIcon{
    icon: any;
    label: string;
    value: any;
}

export class SelectList{

    tag = "div";
    attr: any;
    public items = array<SelectListItem>();

    constructor(){
        this.attr = {
            class: "select-list"
        }
    }

    get child(){
        return this.items.values;
    }

}

export class LabelSelectListItem extends SelectListItem{

    constructor(public label: any){
        super();
    }

    get child(){
        return [{
            tag: "span",
            attr: {
                class: "label"
            },
            child: this.label
        }];
    }
}

export class IconLabelSelectListItem extends SelectListItem {

    constructor(public label: any, public icon: any){
        super();
    }

    get child(){
        return [this.icon, {
            tag: "span",
            attr: {
                class: "label"
            },
            child: this.label
        }];
    }

}

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
 
import {event, transaction, variable} from "../../../../../../reactive";
import stream from "../../../../../../reactive/src/event";
import {IElementConfig, IHtmlNodeShape, IHtmlShape} from "../../../../../../html/src/html/node";

export interface ISelectListItem{
    icon: any;
    content: any;
    selected?: boolean;
    invalid?: boolean;
    processNode?(node: IElementConfig);
}

export class SelectListItem implements ISelectListItem{

    icon: any;
    content: any;

    public r_selected = variable(null);

    get selected(){
        return this.r_selected.value;
    }

    set selected(v){
        this.r_selected.value = v;
    }

}

export interface ISelectListItemEvent{

    index: number;
    item: ISelectListItem;

}

export class AbstractSelectList{

    items: ISelectListItem[];

    tag = "ul"

    attr: any;

    constructor(){
        const self = this;
        this.attr = {
            get class(){
                return self.getClass();
            }
        }
    }

    getClass(){
        return "select-list";
    }

    onClick = stream<ISelectListItemEvent>();

    node: IHtmlNodeShape;

    attachStream = event();
    detachStream = event();

    onAttached(){
        this.attachStream.fire(null);
    }

    onDetached(){
        this.detachStream.fire(null);
    }

    get child(){
        return this.items.map((item, index) => {
            var shape = {
                tag: "li",
                event: {
                    click: () => {
                        this.onClick.fire({
                            index: index,
                            item: item
                        });
                    }
                },
                attr: {
                    get class(){
                        let res = "";
                        if (item.selected){
                            res = "selected";
                        }
                        if(item.invalid){
                            res += " invalid";
                        }
                        return res;
                    }
                },
                get child(){
                    var res: any[] = [];
                    if (item.icon){
                        res.push(item.icon);
                    }
                    res.push(item.content);
                    return res;
                }
            };
            if (item.processNode){
                item.processNode(shape);
            }
            return shape;
        });
    }

    public scrollTo(index: number){
        if (this.node && index >= 0){
            if (index < this.node.element.childNodes.length){
                (<HTMLElement>this.node.element).scrollTop = (<HTMLElement>this.node.element.childNodes[index]).offsetTop;
            }
        }
    }

}

export class SingleSelectList extends AbstractSelectList{

    public r_selected = variable<SelectListItem>(null);

    get selected(){
        return this.r_selected.value;
    }

    set selected(v){
        this.r_selected.value = v;
    }

    constructor(){
        super();
        this.onClick.observe(items => {
            transaction(() => {
                const last = this.selected;
                if (last !== items.item){
                    if (last){
                        last.selected = false;
                    }
                }
                items.item.selected = true;
            });
        });
    }


}

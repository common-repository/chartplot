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
 
import {MenuTitle} from "./title";
import * as di from "../../../../../di";
import {create, factory, init, inject} from "../../../../../di";
import {RightToolbar, Toolbar} from "../toolbar";
import {Ribbon} from "../ribbon";
import {getIconShape, IconSet} from "../../icon";
import {variable} from "../../../../../reactive";
import {IHtmlConfig, IHtmlShape} from "../../../../../html/src/html/node";

export class EditorMenu{

    tag: "div"
    attr: any;

    @create(() => new MenuTitle())
    title: MenuTitle

    @di.create(() => new Ribbon())
    ribbon: Ribbon;

    @inject
    toolbar: Toolbar;

    @inject
    rightToolbar: RightToolbar;

    node;

    public r_ribbonSectionHighlight = variable<IRibbonSectionHighlight[]>([]);

    get ribbonSectionHighlight(){
        return this.r_ribbonSectionHighlight.value;
    }

    set ribbonSectionHighlight(v){
        this.r_ribbonSectionHighlight.value = v;
    }

    private topMenu;
    private bottomMenu;

    private highlighter: RibbonSectionHighlighter[];

    get child(){
        this.highlighter = [];
        if (this.ribbonSectionHighlight){
            this.highlighter = this.ribbonSectionHighlight.map(rsh => this.createRibbonHighlighter(rsh));
            return [this.topMenu].concat(this.highlighter).concat([this.bottomMenu]);
        }
        return [this.topMenu, this.bottomMenu];
    }

    render(){
        this.node.renderAll();
        if (this.highlighter){
            this.highlighter.forEach(hl => hl.calculateRange());
        }
    }

    @factory
    createRibbonHighlighter(highlight: IRibbonSectionHighlight){
        return new RibbonSectionHighlighter(highlight);
    }

    @init
    init(){
        this.topMenu = {
            tag: "div",
            attr: {
                class: "top-menu"
            },
            child: [{
                tag: "div",
                attr: {
                    class: "logo-holder"
                },
                child: getIconShape(IconSet.chartplot_logo)
            },
                this.toolbar, this.title, this.rightToolbar]
        };
        this.bottomMenu = {
            tag: "div",
            attr: {
                class: "bottom-menu"
            },
            child: this.ribbon.header
        };
    }

}

EditorMenu.prototype.tag = "div";
EditorMenu.prototype.attr = {
    class: "menu"
}

export interface IRibbonSectionHighlight{
    startIndex: number;
    endIndex: number;
    label: any;
}

class RibbonSectionHighlighter implements IHtmlConfig{

    @inject
    ribbon: Ribbon

    constructor(public highlight: IRibbonSectionHighlight){

    }

    tag = "div";
    attr = {
        class: "ribbon-section-highlight"
    }

    node: IHtmlShape;

    get child(){
        return {
            tag: "div",
            attr: {
                class: "ribbon-section-highlight-label"
            },
            child: this.highlight.label
        }
    }

    calculateRange(){
        const widthRange = this.ribbon.header.getTabRange(this.highlight.startIndex, this.highlight.endIndex);
        (<HTMLElement>this.node.element).style.left = widthRange.start+"px";
        (<HTMLElement>this.node.element).style.width = (widthRange.end - widthRange.start)+"px";
    }

}

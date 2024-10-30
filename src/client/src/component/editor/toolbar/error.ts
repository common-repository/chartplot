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
 
import {ToolbarButton} from "./button";
import {getIconShape, IconSet} from "../../icon";
import { SinglePopupSystem} from "../../popup";
import {init, inject} from "../../../../../di";
import {EditorProblems} from "../error";
import {IHtmlNodeShape} from "../../../../../html/src/html/node";
import {NormalRibbonButton} from "../ribbon/blocks";
import {TooltipBlock} from "../ribbon/blocks/tooltip";

export class ErrorButton extends NormalRibbonButton {

    classPrefix = "dark-"

    @inject
    problems: EditorProblems;

    @inject
    popupSystem: SinglePopupSystem

    node: IHtmlNodeShape;

    action(event){
        if (this.node){
            const p = this.popupSystem.createPopup({
                target: <Element> this.node.element,
                content: () => this.problems
            });
            p.placement = "bottom-end";
        }
    }

    icon = getIconShape(IconSet.alert);

    get disabled(){
        return this.problems.problems.length === 0;
    }

    getClass(){
        return super.getClass()+" error-button";
    }

    @init
    init(){
        super.init();
        this.onClick.observe(e => this.action(e));
    }

    tooltip = new TooltipBlock({title: "Errors and warnings", content: {
        tag: "html",
        child: `Click on this button to show all the problems with your current chart configuration. If there are no 
        problems, this button is disabled.`
    }});

}

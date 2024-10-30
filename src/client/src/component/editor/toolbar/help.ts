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
 
import {getIconShape, IconSet} from "../../icon";
import {create, init, inject} from "../../../../../di";
import {SinglePopupSystem} from "../../popup";
import {HelpSystem} from "../help";
import {NormalRibbonButton} from "../ribbon/blocks";

export class HelpButton extends NormalRibbonButton{

    classPrefix = "dark-"

    @inject
    popupSystem: SinglePopupSystem;

    @create(() => {
        return new HelpSystem();
    })
    help: HelpSystem;

    node;

    action(event){
        this.popupSystem.createPopup({
            target: this.node.element,
            closeOn: "down-outside",
            content: (popup) => this.help,
            placement: "top-end"
        })
    }

    icon = getIconShape(IconSet.help);

    get selected(){
        //return this.popupSystem.lastPopup && this.popupSystem.lastPopup.target === this.node.element;
        return false;
    }

    @init
    init(){
        super.init();
        this.onClick.observe(c => this.action(c));
    }

}

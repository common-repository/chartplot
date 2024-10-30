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
 
import {TextInput} from "../input";
import {getIconShape, IconSet} from "../../../../icon";
import {create} from "../../../../../../../di";
import {SelectPopup} from "./select";

class InputButton{

    tag = "div";
    attr: any;
    event: any;

    constructor(text: TextSelectInput){
        this.attr = {
            class: "button-hover-highlight chartplot-button"
        }
        this.event = {
            click: () => {
                text.selectPopup.clicked(<Element>text.node.element, () => text.getContent());
            }
        }
    }

    get child(){
        return getIconShape(IconSet.arrow_drop_down);
    }

}

export class TextSelectInput extends TextInput {

    @create(() => new SelectPopup())
    selectPopup: SelectPopup;

    inputButton = new InputButton(this);

    getContent(): any{
        return "";
    }

    getInputChildPart(){
        return super.getInputChildPart().concat(this.inputButton);
    }

    getClass(){
        return super.getClass()+" text-select";
    }

    get selected(){
        return this.selectPopup.popup != null;
    }

}

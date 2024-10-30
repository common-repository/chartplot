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
 
import {NormalRibbonButton} from "../ribbon/blocks";
import {getIconShape, IconSet} from "../../icon";
import {create} from "../../../../../di";

export class HelpMenu{

    tag = "div";
    attr: any;

    @create(() => new BackButton())
    undo: BackButton

    @create(() => new ForwardButton())
    redo: ForwardButton;

    @create(() => new ContentsButton())
    contents: ContentsButton;

    constructor(){
        this.attr = {
            class: "help-menu"
        }
    }

    get child(){
        return [this.undo, this.redo, this.contents];
    }

}

class BackButton extends NormalRibbonButton{

    classPrefix = "dark-";
    icon = getIconShape(IconSet.undo)

}

class ForwardButton extends NormalRibbonButton{

    classPrefix = "dark-";
    icon = getIconShape(IconSet.redo)
}

class ContentsButton extends NormalRibbonButton{

    classPrefix = "dark-";
    icon = getIconShape(IconSet.book);
}

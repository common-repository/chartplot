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
import {variable} from "../../../../../reactive";
import {init, inject} from "../../../../../di";
import {Editor} from "../index";
import {NormalRibbonButton} from "../ribbon/blocks";

export class MaximizeButton extends NormalRibbonButton{

    classPrefix = "dark-"

    @inject
    editor: Editor

    action(event){
        this.isMaximized = !this.isMaximized;
        this.editor.resizeComponents.triggerResize();
        if (this.isMaximized){
            document.body.style.overflow = 'hidden';
        }
        else
        {
            document.body.style.overflow = 'auto';
        }
    }

    icon = getIconShape(IconSet.enlarge);

    public r_isMaximized = variable(false);

    get isMaximized(){
        return this.r_isMaximized.value;
    }

    set isMaximized(v){
        this.r_isMaximized.value = v;
    }

    @init
    init(){
        super.init();
        this.onClick.observe(c => this.action(c));
    }

}

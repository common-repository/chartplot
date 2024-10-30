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
import {init, inject} from "../../../../../di";
import {EditorSettings} from "../settings";
import {TooltipBlock} from "../ribbon/blocks/tooltip";

export class TooltipEnabledSelect extends NormalRibbonButton{

    classPrefix = "dark-"

    @inject
    editorSettings: EditorSettings;

    icon = getIconShape(IconSet.bubble2)

    get active(){
        return this.editorSettings.options.ribbon.tooltipsEnabled !== false;
    }

    getClass(){
        var s = super.getClass();
        if (!this.active){
            s += " inactive";
        }
        return s;
    }

    @init
    init(){
        super.init();
        this.onClick.observe(() => {
            this.editorSettings.options.ribbon.tooltipsEnabled = !this.active;
        });
        this.tooltipManager.force = true;
        this.tooltip = new TooltipBlock({title: "Tooltips enabled", content: {
                tag: "html",
                child: `
<p>If enabled, will show tooltips whenever you hover over editor elements. Is enabled by default. Can be disabled by default in the global chartplot settings.</p>
            `
            }});
    }

}

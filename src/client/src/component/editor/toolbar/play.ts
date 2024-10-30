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
import {EditorSettings} from "../settings";
import {init, inject} from "../../../../../di";
import {TooltipBlock} from "../ribbon/blocks/tooltip";

export class PlayToolbarButton extends NormalRibbonButton{

    classPrefix = "dark-"

    @inject
    editorSettings: EditorSettings;

    get icon(){
        if (this.editorSettings.options.view.modus === "edit"){
            return getIconShape(IconSet.pencil);
        }
        return getIconShape(IconSet.play3);
    }

    @init
    init() {
        super.init();
        this.onClick.observe(() => {
            if (this.editorSettings.options.view.modus === "edit"){
                this.editorSettings.options.view.modus = "preview";
            }
            else
            {
                this.editorSettings.options.view.modus = "edit";
            }
        });
        this.tooltipManager.force = true;
        this.tooltip = new TooltipBlock({
            title: "Chart edit mode", content: {
                tag: "div",
                child: [{
                    tag: "ul", attr: {class: 'bullet'},
                    child: [{
                        tag: "li",
                        child: [getIconShape(IconSet.pencil), ': This mode enables you to click on the different components of a chart, like the legend or title. Doing so will open\nthe settings for the clicked component.']
                    },
                        {
                            tag: 'li',
                            child: [getIconShape(IconSet.play3), ': In this mode, you can interact with the chart normally like when you publish it in your posts.']
                        }]
                }]

            }
        });
    }
}


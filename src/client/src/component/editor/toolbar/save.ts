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
import {init, inject} from "../../../../../di";
import {ChartHistory} from "../../history";
import {variable} from "../../../../../reactive";
import {WordpressEditor} from "../../../wordpress/editor";
import {NormalRibbonButton} from "../ribbon/blocks";

declare var jQuery;

export class SaveButton extends NormalRibbonButton{

    classPrefix = "dark-"

    @inject
    history: ChartHistory;

    @inject
    editor: WordpressEditor;

    public r_lastSaveIndex = variable(0);

    get lastSaveIndex(){
        return this.r_lastSaveIndex.value;
    }

    set lastSaveIndex(v){
        this.r_lastSaveIndex.value = v;
    }

    action(event){
        const form = jQuery("#post");
        var url = form.attr("action");
        const self = this;
        const stateIndex = this.history.stateIndex;
        this.editor.save();
        jQuery.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            success: function(data)
            {
                self.lastSaveIndex = stateIndex;
                jQuery("#revisionsdiv").replaceWith(jQuery(data).find("#revisionsdiv"));
            }
        });
    }

    icon = getIconShape(IconSet.save);

    @init
    init(){
        super.init();
        this.lastSaveIndex = this.history.stateIndex;
        this.onClick.observe(c => this.action(c));
    }

    get disabled(){
        return this.lastSaveIndex === this.history.stateIndex;
    }

}

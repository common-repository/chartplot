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
 
import {AbstractSelectedComponent, createStandardIndexer, ISelectedComponent} from "./base";
import {EChartSettings} from "../../../settings";
import *as di from "../../../../../../../di";
import {EditorSettings} from "../../../../editor/settings";
import {RibbonOptions} from "../../../../editor/settings/options/ribbon";
import {Editor} from "../../../../editor";

export class TitleComponent extends AbstractSelectedComponent implements ISelectedComponent{

    priority = 10;

    @di.inject
    settings: EChartSettings;

    @di.inject
    editorSettings: EditorSettings;

    @di.inject
    editor: Editor;

    constructor(){
        super();
    }

    getModel(model: EChartSettings){
        var index = this.component.__ecComponentInfo.index;
        return model.components.getTitleAtIndex(index);
    }

    activate() {
        this.editorSettings.options.ribbon.selectedTab = RibbonOptions.COMPONENT_RIBBON_INDEX;
        const model = this.getModel(this.settings);
        this.editorSettings.options.components.selected = this.settings.components.components.values.indexOf(model);
        this.editorSettings.options.chart.editMode = "component";
    }


}

TitleComponent.prototype.type = "title";

export const indexTitle = createStandardIndexer(() => new TitleComponent())

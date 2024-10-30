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
 
import {TooltipTab} from "../../tooltip";
import {init, inject} from "../../../../../../../di";
import {EditorSettings} from "../../../settings";
import {RibbonOptions} from "../../../settings/options/ribbon";
import {Editor} from "../../../index";
import {TooltipBlock} from "../../blocks/tooltip";

export class CoordinateTooltipTab extends TooltipTab{

    @inject
    editorSettings: EditorSettings;

    @inject
    editor: Editor;

    @init
    init(){
        this.general.general.show.tooltip = new TooltipBlock({title: "Show tooltip", content: "If true, will show a tooltip for the series in the coordinate system whenever you move the mouse over the coordinate system."});
    }

    activate(){
        this.editorSettings.options.chart.editMode = "coordinate";
    }

    additionalIndexes = [RibbonOptions.COORDINATE_RIBBON_INDEX]

    tooltip = new TooltipBlock({title: 'Tooltip coordinate system', content: 'The tooltip settings for all series rendered in this coordinate system.'})

}

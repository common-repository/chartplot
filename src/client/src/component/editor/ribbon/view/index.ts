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
 
import {RibbonTab} from "../base";
import {create, inject} from "../../../../../../di";
import {CanvasSizeSection} from "./dimension";
import {ViewModeSection} from "./mode";
import {Editor} from "../../index";
import {ChartViewMode} from "../../../echart/editor/split";
import {TooltipBlock} from "../blocks/tooltip";

export class ViewRibbonTab extends RibbonTab{

    name = "View"

    @create(() => new CanvasSizeSection())
    canvasSize: CanvasSizeSection;

    @create(() => new ViewModeSection())
    view: ViewModeSection;

    @inject
    editor: Editor;

    get contents(){
        return [this.canvasSize, this.view];
    }

    activate(){
        this.editor.content.split.mode = ChartViewMode.FULL;
    }

    deactivate(){
        this.editor.content.split.mode = ChartViewMode.SPLIT;
    }

    tooltip = new TooltipBlock({title: "View", content: "View settings "})

}

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
import {EditorSettings} from "../../settings";
import {ChartColorCollectionSelection} from "./color";
import {ChartStyleSection} from "./style";
import {ExportChartSection} from "./export";
import {TooltipBlock} from "../blocks/tooltip";
import {LinkSection} from "./link";

export class ChartRibbonTab extends RibbonTab{

    name = "Chart"

    @inject
    editorSettings: EditorSettings;

    @create(() => new ChartColorCollectionSelection())
    color: ChartColorCollectionSelection;

    @create(() => new ChartStyleSection())
    style: ChartStyleSection;

    @create(() => new ExportChartSection())
    export: ExportChartSection;

    @create(() => new LinkSection())
    link: LinkSection;

    get contents(){
        return [this.style, this.export, this.link];
    }

    activate(){
        this.editorSettings.options.chart.editMode = "chart";
    }

    deactivate(){

    }

    tooltip = new TooltipBlock({title: "Chart menu",  content: "General chart settings"});

}

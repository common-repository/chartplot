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
import {ImportSection} from "./import";
import {ChartDataEditSection} from "./edit";
import {Editor} from "../../index";
import {DataSeriesTypeSection} from "./type";
import {RibbonOptions} from "../../settings/options/ribbon";
import {EditorSettings} from "../../settings";
import {TooltipBlock} from "../blocks/tooltip";
import {getWordpressChartplotUrl} from "../../../../wordpress/path";
import {DataTableHolder} from "../../../table/holder";

export class DataRibbonTab extends RibbonTab{

    name = "Data"

    @inject
    editor: Editor;

    @inject
    editorSettings: EditorSettings;

    @create(() => new ImportSection())
    import: ImportSection

    @create(() => new ChartDataEditSection())
    edit: ChartDataEditSection;

    @create(() => new DataSeriesTypeSection())
    series: DataSeriesTypeSection;

    get contents(){
        return [this.import, this.edit, this.series];
    }

    activate(){
        this.editor.content.activateDataSplit(new DataTableHolder(this.editor.content.table));
    }

    additionalIndexes = [RibbonOptions.CHART_RIBBON_INDEX];

    deactivate(){
        this.editor.content.activateDataSplit(null);
    }

    tooltip = new TooltipBlock({title: "Chart data", content: {
        tag: "html", child: `
Define you chart data here. The format of the data is as follows:
        <img class="img-thumbnail" src="${getWordpressChartplotUrl()}/img/help/data/chart-data.png">
        <ul class="bullet">
        <li><b>Categories</b>: The first column defines the categories of the data</li>
        <li><b>Series names</b>: The first row identifies the name of the series</li>
        <li><b>Series data</b>: Each column defines the series the data belongs to. Each row defines the category to which the data belongs to.</li>
</ul>
        `
        }})

}

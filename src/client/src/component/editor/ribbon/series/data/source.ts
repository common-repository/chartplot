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
 
import {RibbonContentSection} from "../../base";
import {inject} from "../../../../../../../di";
import {EChartSeriesSettings} from "../../../../echart/settings/series";
import {create} from "../../../../../../../di/src";
import {DataSourceSelect} from "../../blocks/data/source";
import {TooltipBlock} from "../../blocks/tooltip";

export class SeriesDataSourceSection extends RibbonContentSection{

    @create(() => new SeriesDataSourceSelect())
    source: SeriesDataSourceSelect

    get contents(){
        return [this.source];
    }

    label = "source";

}

export class SeriesDataSourceSelect extends DataSourceSelect {

    hasExternal(){
        return false;
    }

    get dataSourceType(){
        return this.series.dataSourceType;
    }

    set dataSourceType(t){
        this.series.dataSourceType = t;
    }

    @inject
    series: EChartSeriesSettings;

    stickyTooltip = true;

    get tooltip(){
        return new TooltipBlock({title: "Series data source", content: {tag: "html", child: `
    Where to get the data from to render for this series.
    <ul class="bullet">
    <li><b>Table: </b>Define the data in the table below.</li>
    <li><b>Chart: </b>Use data defined in the chart data table. You can select the column to use by clicking on the header row of the table below.</li>
    <li><b>Link: </b>Get the data from a http link.${this.getProComment()}</li>
</ul>
    `}});
    }

    getProComment(){
        return " *Pro version only*";
    }

}

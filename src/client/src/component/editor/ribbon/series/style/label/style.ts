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
 
import {RibbonContentSection} from "../../../base";
import {create, init, inject} from "../../../../../../../../di/index";
import {EChartSeriesSettings} from "../../../../../echart/settings/series/index";
import {LabelStyleTriple} from "../../../blocks/style/label";
import {SeriesGeneralLabelTriple} from "./general";
import {SeriesLabelSettings} from "../../../../../echart/settings/series/label";
import {TooltipBlock} from "../../../blocks/tooltip";

export class SeriesLabelStyleSection extends RibbonContentSection{

    constructor(public labelSettings: SeriesLabelSettings){
        super();
    }

    @inject
    series: EChartSeriesSettings;

    @create(function(this: SeriesLabelStyleSection){
        const l = new LabelStyleTriple(this.labelSettings);
        return l;
    })
    first: LabelStyleTriple;

    @create(function(this: SeriesLabelStyleSection){
        return new SeriesGeneralLabelTriple(this.labelSettings);
    })
    general: SeriesGeneralLabelTriple;


    label = "label";

    get contents(){
        return [this.general, this.first];
    }

    tooltip = new TooltipBlock({title: "Series label style", content: {
            tag: "html",
            child: `
<p>
Settings for the series label rendered for each series data item.
</p>
        `
        }});
}

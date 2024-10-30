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
 
import {RibbonContentSection} from "../base";
import {create, inject} from "../../../../../../di/index";
import {HistoryCheckboxInput} from "../blocks/checkbox";
import {EChartSeriesSettings} from "../../../echart/settings/series/index";
import {TooltipBlock} from "../blocks/tooltip";

export class SeriesTooltipSection extends RibbonContentSection{

    @inject
    selectedSeries: EChartSeriesSettings;

    @create(function(this: SeriesTooltipSection){
        var r = new HistoryCheckboxInput();
        r.default = true;
        r.r_value = this.selectedSeries.tooltip.r_show;
        r.label = "Show";
        r.tooltip = new TooltipBlock({title: "Show tooltip", content: "Whether to show this series in the tooltip"});
        return r;
    })
    show: HistoryCheckboxInput;

    get contents(){
        return [this.show];
    }

    label = "tooltip";

}

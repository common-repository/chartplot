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
import {TooltipBlock} from "../blocks/tooltip";
import {create, inject} from "../../../../../../di";
import {EChartSettings} from "../../../echart/settings";
import {HistoryCheckboxInput} from "../blocks/checkbox";

export class LinkSection extends RibbonContentSection{

    @inject
    settings: EChartSettings;

    label = "links";

    tooltip = new TooltipBlock({title: "Links", content: `Determines what axes are linked to each other. Linked 
    axes will be synchronized when moved or when the tooltip is shown.`});

    @create(function(this: LinkSection) {
        var r = new HistoryCheckboxInput();
        r.label = "x-axes";
        r.default = false;
        r.r_value = this.settings.axisPointer.r_linkXAxes;
        r.tooltip = new TooltipBlock({
            title: "Link x-axes", content: `Determines what x-axes are linked to each other. Linked 
        axes will be synchronized when moved or when the tooltip is shown.`
        });
        return r;
    })
    xAxes: HistoryCheckboxInput;

    @create(function(this: LinkSection) {
        var r = new HistoryCheckboxInput();
        r.label = "y-axes";
        r.default = false;
        r.r_value = this.settings.axisPointer.r_linkYAxes;
        r.tooltip = new TooltipBlock({
            title: "Link y-axes", content: `Determines what y-axes are linked to each other. Linked 
        axes will be synchronized when moved or when the tooltip is shown.`
        });
        return r;
    })
    yAxes: HistoryCheckboxInput;

    get contents(){
        return [this.tripleSurface({
            top: this.xAxes,
            middle: this.yAxes
        })];
    }


}

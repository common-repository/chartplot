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
import {TripleSurface} from "../blocks/surface";
import {create, inject} from "../../../../../../di";
import {EChartSettings} from "../../../echart/settings";
import {BackgroundColorButton} from "../blocks/style/text";
import {HistoryRibbonSelectList} from "../blocks";
import {EditorSettings} from "../../settings";
import {TooltipBlock} from "../blocks/tooltip";

export class ChartStyleSection extends RibbonContentSection{
    label = "style";

    @create(() => new FirstTriple())
    first: FirstTriple;

    get contents(){
        return [this.first];
    }
}

class FirstTriple extends TripleSurface{

    @inject
    settings: EChartSettings;

    @inject
    editorSettings: EditorSettings;

    @create(function(this: FirstTriple){
        var bc = new BackgroundColor(this.settings.r_backgroundColor);
        return bc;
    })
    background: BackgroundColor;

    @create(function(this: FirstTriple){
        let r = new HistoryRibbonSelectList();
        r.r_value = this.editorSettings.options.chart.r_theme;
        r.items = [{label: "Default theme", value: null},
            {label: "Dark theme", value: "dark"},
            {label: "Infographic theme", value: "infographic"},
            {label: "Macarons theme", value: "macarons"}];
        r.default = null;
        r.tooltip = new TooltipBlock({title: "Chart theme", content: "Defines the look and feel of the chart"});
        return r;
    })
    theme: HistoryRibbonSelectList;

    get top(){
        return this.background;
    }

    get middle(){
        return this.theme;
    }

}

class BackgroundColor extends BackgroundColorButton{

    @inject
    settings: EChartSettings;

}

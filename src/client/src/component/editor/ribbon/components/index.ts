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
 
import {RibbonContentSection, RibbonTab} from "../base";
import {create, factory, inject} from "../../../../../../di";
import {ComponentCollectionSelection} from "./collection";
import {EditorSettings} from "../../settings";
import {EChartTitleSettings} from "../../../echart/settings/components/title";
import {TitleComponentPart} from "./title";
import {LegendComponentPart} from "./legend";
import {EChartLegendSettings} from "../../../echart/settings/components/legend";
import {TooltipBlock} from "../blocks/tooltip";

export class ComponentRibbonTab extends RibbonTab{

    name = "Component"

    @create(() => new ComponentCollectionSelection())
    collection: ComponentCollectionSelection;

    @inject
    editorSettings: EditorSettings;

    @factory
    createTitlePart(settings: EChartTitleSettings){
        return new TitleComponentPart(settings);
    }

    @factory
    createLegendPart(settings: EChartLegendSettings){
        return new LegendComponentPart(settings);
    }

    get contents(){
        let res: RibbonContentSection[] = [this.collection.ribbonSection];
        const selectedComponent = this.collection.selectList.selectedItem;
        if (selectedComponent){
            switch(selectedComponent.type){
                case "title":
                    res = res.concat(this.createTitlePart(<EChartTitleSettings>selectedComponent).contents);
                    break;
                case "legend":
                    res = res.concat(this.createLegendPart(<EChartLegendSettings>selectedComponent).contents);
                    break;
            }
        }
        return res;
    }

    activate(){
        this.editorSettings.options.chart.editMode = "component";
    }

    tooltip = new TooltipBlock({title: "Chart components", content: "Configure the various components of the chart, like the Title or Legend."})
}

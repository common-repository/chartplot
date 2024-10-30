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
import {SeriesCollectionSection} from "./select";
import {CategoricalSeriesTypeRibbon} from "./type/categorical";
import {EChartSeriesSettings} from "../../../echart/settings/series";
import {EditorSettings} from "../../settings";
import {SelectedPieSeriesPart} from "./type/pie";
import {TooltipBlock} from "../blocks/tooltip";

export interface ISeriesRibbonType{

    contents: RibbonContentSection[];

}

export class SeriesRibbonTab extends RibbonTab{

    name = "Series"

    @create(() => new SeriesCollectionSection())
    collection: SeriesCollectionSection;

    @inject
    editorSettings: EditorSettings;

    get selectedSeries(){
        return this.collection.selectList.selectedItem;
    }

    @factory
    createCategoricalType(series: EChartSeriesSettings){
        return new CategoricalSeriesTypeRibbon(series);
    }

    @factory
    createPieType(series: EChartSeriesSettings){
        return new SelectedPieSeriesPart(series);
    }

    get contents(){
        let res: RibbonContentSection[] = [this.collection.ribbonSection];
        const selSer = this.selectedSeries;
        if (!selSer){
            return res;
        }
        let subtype: ISeriesRibbonType;
        switch(selSer.getType()){
            case "line":
            case "area":
            case "column":
            case "bar":
            case "scatter":
            case "effectScatter":
            case "candlestick":
            case "area_interval":
                subtype = this.createCategoricalType(selSer);
                break;
            case "pie":
                subtype = this.createPieType(selSer);
                break;
            default:
                return res;
        }
        res = res.concat(subtype.contents);
        return res;
    }

    activate(){
        this.editorSettings.options.chart.editMode = "series";
    }

    tooltip = new TooltipBlock({title: "Series menu", content: "Create and manage your series here."});

}



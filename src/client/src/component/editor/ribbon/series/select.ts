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
 
import {create, init, inject} from "../../../../../../di";
import {EditorSettings} from "../../settings";
import {variable} from "../../../../../../reactive";
import {EChartSeriesSettings} from "../../../echart/settings/series";
import {getIconForSeriesType} from "../data/type";
import {IReactiveArray} from "../../../../../../reactive/src/array";
import {IVariable} from "../../../../../../reactive/src/variable";
import {executeInAnimationFrame} from "../../../../../../reactive/src/procedure";
import {ChartCollection, ListItem, SelectedItemList} from "../blocks/collection";

export class SeriesCollectionSection extends ChartCollection{

    constructor(){
        super();
        this.elementName = "series";
    }

    @inject
    editorSettings: EditorSettings;

    @create(() => new SelectedSeries())
    selectList: SelectedSeries;

    @create(function(this: SeriesCollectionSection){
        return this.editorSettings.chart.series.seriesCollection;
    })
    collection: IReactiveArray<EChartSeriesSettings>

    @create(function(this: SeriesCollectionSection){
        return this.editorSettings.options.series.r_selected;
    })
    selectedIndex: IVariable<number>;

    label = "Series";

    @init
    init(){
        this.add.onClick.observe(c => {
            var ni = this.editorSettings.chart.series.addNewSeries(this.selectedIndex.value+1);
            this.selectedIndex.value = ni;
            executeInAnimationFrame(f => {
                this.selectList.scrollTo(this.selectedIndex.value);
            });
        });
    }

}

class SeriesListItem extends ListItem{


    item: EChartSeriesSettings;
    public r_selected = variable<boolean>(false);

    get icon(){
        const type = this.item.getType();
        return getIconForSeriesType(type);
    }

    get invalid(){
        return !this.item.isValid();
    }

    get content(){
        return this.item.getName() || "no name";
    }

}

export class SelectedSeries extends SelectedItemList{

    selectedItem: EChartSeriesSettings;

    createListItem(item, selected){
        return new SeriesListItem(item, selected);
    }

}

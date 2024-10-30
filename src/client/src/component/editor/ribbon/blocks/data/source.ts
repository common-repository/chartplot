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
 
import {IconLabelSelectListItem, SelectList} from "../../../../list/select";
import {getIconShape, IconSet} from "../../../../icon";
import {SeriesDataSourceType} from "../../../../echart/settings/series";
import {BigRibbonSelectButton} from "../index";
import {inject} from "../../../../../../../di";
import {ChartHistory} from "../../../../history";
import {PropertyValueHistory} from "../../../../history/value";

const dataSourceToLabel: {[s in SeriesDataSourceType]: string} = {
    table: "Table",
    chart: "Chart",
    link: "Link",
    auto: "Auto"
}

const dataSourceToIcon: {[s in SeriesDataSourceType]: string} = {
    table: IconSet.table2,
    chart: IconSet.table_add_row_left,
    link: IconSet.external_link,
    auto: IconSet.baseline_radio_button_unchecked
}

export abstract class DataSourceSelect extends BigRibbonSelectButton {

    @inject
    history: ChartHistory;

    get label(){
        return dataSourceToLabel[this.dataSourceType];
    }

    get icon(){
        return getIconShape(dataSourceToIcon[this.dataSourceType]);
    }

    set type(t: SeriesDataSourceType){
        if (this.dataSourceType !== t){
            this.history.executeCommand(new PropertyValueHistory(this, "dataSourceType", t));
        }
    }

    abstract dataSourceType: string;

    hasExternal(){
        return true;
    }

    hasChart(){
        return true;
    }

    hasAuto(){
        return false;
    }

    getContent(){
        const dropwdown = new SelectList();
        if (this.hasAuto()){
            dropwdown.items.push(new IconLabelSelectListItem(dataSourceToLabel.auto,getIconShape(dataSourceToIcon.auto)).setAction(ev => this.type = "auto"));
        }
        dropwdown.items.push(new IconLabelSelectListItem(dataSourceToLabel.table,getIconShape(dataSourceToIcon.table)).setAction(ev => this.type = "table"));
        if (this.hasChart()){
            dropwdown.items.push(new IconLabelSelectListItem(dataSourceToLabel.chart,getIconShape(dataSourceToIcon.chart)).setAction(ev => this.type = "chart"));
        }
        if (this.hasExternal()){
            dropwdown.items.push(new IconLabelSelectListItem(dataSourceToLabel.link,getIconShape(dataSourceToIcon.link)).setAction(ev => this.type = "link"));
        }
        return dropwdown;
    }

}

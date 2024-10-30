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
 
import {RibbonContentSection, RibbonTab} from "../../../base";
import {SeriesDataRibbonTab} from "../index";
import {create, define, inject} from "../../../../../../../../di";
import {EditorSettings} from "../../../../settings";
import {RibbonOptions} from "../../../../settings/options/ribbon";
import {GeneralSeriesDataStyleSection} from "./style/general";
import {SeriesRowDataCell} from "../../../../../echart/settings/series/data/row";
import {SeriesDataItemStyleBorderSection} from "./style/border";
import {EChartSeriesSettings} from "../../../../../echart/settings/series";
import {LabelLineSection} from "../../style/pie";
import {SeriesRowLabelSection} from "./style/label";
import {SeriesSymbolSection} from "../../style/symbol";
import {CandlestickBarSection, CandlestickColorSection, GeneralCandleSeriesStyleSection} from "../../style/candlestick";

export class DataStyleTab extends RibbonTab{

    @inject
    editorSettings: EditorSettings;

    @create(() => new GeneralSeriesDataStyleSection())
    general: GeneralSeriesDataStyleSection;

    @create(() => new SeriesDataItemStyleBorderSection())
    border: SeriesDataItemStyleBorderSection;

    @create(function(this: DataStyleTab){
        var ls = new LabelLineSection(this.row.labelLine);
        ls.isUseNullDefaults = true;
        return ls;
    })
    labelLine: LabelLineSection;

    @create(function(this: DataStyleTab){
        var l = new SeriesRowLabelSection(this.row.label);
        return l;
    })
    label: SeriesRowLabelSection;

    @create(function(this: DataStyleTab){
        return new SeriesSymbolSection(this.row);
    })
    symbol: SeriesSymbolSection;

    @create(function(this: DataStyleTab){return new CandlestickBarSection(this.row)})
    candleBar: CandlestickBarSection;

    @create(function(this: DataStyleTab){return new CandlestickColorSection(this.row)})
    candleColor: CandlestickColorSection;

    @create(function(this: DataStyleTab){return new GeneralCandleSeriesStyleSection(this.row)})
    candleGeneral: GeneralCandleSeriesStyleSection;

    @define
    row: SeriesRowDataCell;

    @inject
    series: EChartSeriesSettings;

    constructor(public dataTab: SeriesDataRibbonTab, row: SeriesRowDataCell){
        super();
        this.row = row;
    }

    activate(){
        this.dataTab.activate();
    }

    deactivate() {
        this.dataTab.deactivate();
    }

    name = "Style"

    get contents(){
        var res: RibbonContentSection[] = [this.general];
        switch(this.series.getType()){
            case "line":
                res.push(this.symbol);
                res.push(this.label);
                break;
            case "area":
                res.push(this.symbol);
                res.push(this.label);
                break;
            case "scatter":
            case "effectScatter":
                res.push(this.symbol);
                res.push(this.label);
                break;
            case "pie":
                res.push(this.border);
                res.push(this.labelLine);
                res.push(this.label);
                break;
            case "candlestick":
                res = [this.candleGeneral, this.candleColor];
                break;
        }
        return res;
    }

    additionalIndexes = [RibbonOptions.SERIES_RIBBON_INDEX, RibbonOptions.SERIES_DATA_RIBBON_INDEX]

}

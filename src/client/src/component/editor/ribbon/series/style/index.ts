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
 
import {RibbonContentSection, RibbonTab} from "../../base";
import {create} from "../../../../../../../di/src";
import {EChartSeriesSettings} from "../../../../echart/settings/series";
import {inject} from "../../../../../../../di";
import {EditorSettings} from "../../../settings";
import {RibbonOptions} from "../../../settings/options/ribbon";
import {SeriesLabelStyleSection} from "./label/style";
import {GeneralSeriesStyleSection} from "./general";
import {SeriesSymbolSection} from "./symbol";
import {SeriesLineStyleSection} from "./line";
import {SeriesBarBorderSection, SeriesBarStyleSection} from "./bar";
import {LabelLineSection, PieSeriesAngleSection} from "./pie";
import {SeriesItemStyleBorderSection} from "./border";
import {SeriesAreaStyleSection} from "./area";
import {CandlestickBarSection, CandlestickColorSection, GeneralCandleSeriesStyleSection} from "./candlestick";
import {Editor} from "../../../index";

export class SeriesLabelRibbonTab extends RibbonTab{

    name = "Style";

    @inject
    editorSettings: EditorSettings;

    @inject
    editor: Editor;

    @create(function(this: SeriesLabelRibbonTab){
        return this.editorSettings.options.chart.getFocusedElements()[0];
    })
    series: EChartSeriesSettings;

    @create(function(this: SeriesLabelRibbonTab){ return new SeriesLabelStyleSection(this.series.label)})
    label: SeriesLabelStyleSection;

    @create(() => new GeneralSeriesStyleSection())
    general: GeneralSeriesStyleSection;

    @create(function(this: SeriesLabelRibbonTab){return new SeriesSymbolSection(this.series)})
    symbol: SeriesSymbolSection;

    @create(() => new SeriesLineStyleSection())
    line: SeriesLineStyleSection;

    @create(() => new SeriesAreaStyleSection())
    area: SeriesAreaStyleSection;

    @create(() => new SeriesBarStyleSection())
    bar: SeriesBarStyleSection;

    @create(() => new SeriesBarBorderSection())
    barBorder: SeriesBarBorderSection;

    @create(() => new PieSeriesAngleSection())
    pieAngle: PieSeriesAngleSection;

    @create(() => new SeriesItemStyleBorderSection())
    border: SeriesItemStyleBorderSection;

    @create(function(this: SeriesLabelRibbonTab){
        return new LabelLineSection(this.series.labelLine);
    })
    labelLine: LabelLineSection;

    @create(function(this: SeriesLabelRibbonTab){return new CandlestickBarSection(this.series)})
    candleBar: CandlestickBarSection;

    @create(function(this: SeriesLabelRibbonTab){return new CandlestickColorSection(this.series)})
    candleColor: CandlestickColorSection;

    @create(function(this: SeriesLabelRibbonTab){return new GeneralCandleSeriesStyleSection(this.series)})
    candleGeneral: GeneralCandleSeriesStyleSection;

    get contents(){
        var res: RibbonContentSection[] = [];
        if (this.series.getType() !== "candlestick"){
            res.push(this.general);
        }
        switch(this.series.getType()){
            case "bar":
                res.push(this.bar);
                res.push(this.barBorder);
                break;
            case "pie":
                res.push(this.pieAngle);
                res.push(this.border);
                res.push(this.labelLine);
                break;
            case "candlestick":
                res.push(this.candleGeneral);
                res.push(this.candleColor);
                res.push(this.candleBar);
                break;
        }
        switch(this.series.getType()){
            case "line":
            case "area":
            case "scatter":
            case "effectScatter":
                res.push(this.symbol);
                break;
        }
        switch(this.series.getType()){
            case "line":
            case "area":
                res.push(this.line);
                break;
        }
        switch(this.series.getType()){
            case "area":
            case "area_interval":
                res.push(this.area);
                break;
        }
        if (this.series.getType() !== "area_interval" && this.series.getType() !== "candlestick"){
            res.push(this.label);
        }
        return res;
    }

    additionalIndexes = [RibbonOptions.SERIES_RIBBON_INDEX]

}

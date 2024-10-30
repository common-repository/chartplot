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
 
import {TripleSurface} from "../../blocks/surface";
import {EChartSeriesSettings} from "../../../../echart/settings/series";
import {create, define, init, inject} from "../../../../../../../di";
import {HistoryPixelPercentInput} from "../../blocks/position/position";
import {RibbonContentSection} from "../../base";
import {BackgroundColorButton} from "../../blocks/style/text";
import {BorderColorButton} from "../../blocks/style/border";
import {HistoryNumberInput} from "../../blocks/input";
import {SeriesRowDataCell} from "../../../../echart/settings/series/data/row";
import {TooltipBlock} from "../../blocks/tooltip";
import {OpacityInput} from "../../blocks/style/opacity";

export class CandlestickBarSection extends RibbonContentSection {

    @define
    inputSettings: EChartSeriesSettings | SeriesRowDataCell;

    constructor(inputSettings: EChartSeriesSettings | SeriesRowDataCell){
        super();
        this.inputSettings = inputSettings;
    }

    @create(() => new CandlestickBarTriple())
    triple: CandlestickBarTriple;

    get contents(){
        return [this.triple];
    }

    label = "dimensions";
}

class CandlestickBarTriple extends TripleSurface{

    @inject
    series: EChartSeriesSettings;

    @inject
    inputSettings: EChartSeriesSettings | SeriesRowDataCell;

    @create(function(this: CandlestickBarTriple){
        var res = new HistoryPixelPercentInput();
        res.value = this.inputSettings.barWidth;
        res.labelPos = "right";
        res.label = "width";
        res.width = "";
        return res;
    })
    barWidth: HistoryPixelPercentInput;

    @create(function(this: CandlestickBarTriple){
        var res = new HistoryPixelPercentInput();
        res.value = this.inputSettings.barMaxWidth;
        res.labelPos = "right";
        res.label = "max width";
        res.width = "";
        return res;
    })
    barMaxWidth: HistoryPixelPercentInput;

    @create(function(this: CandlestickBarTriple){
        var res = new HistoryPixelPercentInput();
        res.value = this.inputSettings.barMinWidth;
        res.labelPos = "right";
        res.label = "min width";
        res.width = "";
        return res;
    })
    barMinWidth: HistoryPixelPercentInput;

    @init
    init(){
        this.barWidth.textInput.min = 0;
        this.barMaxWidth.textInput.min = 0;
        this.barMinWidth.textInput.min = 0;
        this.barWidth.textInput.tooltip = new TooltipBlock({
            title: "Candle width",
            content: "The width of the candlestick"
        });
        this.barMaxWidth.textInput.tooltip = new TooltipBlock({
            title: "Candle max width",
            content: "The maximal width of the candlestick"
        });
        this.barMinWidth.textInput.tooltip = new TooltipBlock({
            title: "Candle min width",
            content: "The minimal width of the candlestick"
        });
    }

    get top(){
        return this.barWidth;
    }

    get middle(){
        return this.barMinWidth;
    }

    get bottom(){
        return this.barMaxWidth;
    }

}

export class CandlestickColorSection extends RibbonContentSection{

    @define
    inputSettings: EChartSeriesSettings | SeriesRowDataCell;

    constructor(inputSettings: EChartSeriesSettings | SeriesRowDataCell){
        super();
        this.inputSettings = inputSettings;
    }

    @create(() => new CandlestickBarStyleBullishTriple())
    bullish: CandlestickBarStyleBullishTriple;

    @create(() => new CandlestickBarStyleBearishTriple())
    bearish: CandlestickBarStyleBearishTriple;

    get contents(){
        return [this.bullish, this.bearish];
    }

    label = "color";

}

class CandlestickBarStyleBullishTriple extends TripleSurface{

    @inject
    series: EChartSeriesSettings;

    @inject
    inputSettings: EChartSeriesSettings | SeriesRowDataCell;

    @create(function(this: CandlestickBarStyleBullishTriple){
        var col = new BackgroundColorButton(this.inputSettings.itemStyle.r_color);
        col.labelPrefix = "Color of the bullish candle stick.";
        col.colorInputLabel = "Candle stick color";
        return col;
    })
    color: BackgroundColorButton;

    @create(function(this: CandlestickBarStyleBullishTriple){
        var col = new BorderColorButton(this.inputSettings.itemStyle.r_borderColor);
        col.tooltipPrefix = "Border Color of the bullish candle stick.";
        col.colorInputLabel = "Candle stick border color";
        return col;
    })
    borderColor: BorderColorButton;

    get top(){
        return {tag: "div", attr:{class: "label"}, child: "Bullish"};
    }

    get middle(){
        return this.color;
    }

    get bottom(){
        return this.borderColor;
    }

}

class CandlestickBarStyleBearishTriple extends TripleSurface{

    @inject
    series: EChartSeriesSettings;

    @inject
    inputSettings: EChartSeriesSettings | SeriesRowDataCell;

    @create(function(this: CandlestickBarStyleBearishTriple){
        var col = new BackgroundColorButton(this.inputSettings.itemStyle.r_color0);
        col.labelPrefix = "Color of the bearish candle stick.";
        col.colorInputLabel = "Candle stick color";
        return col;
    })
    color: BackgroundColorButton;

    @create(function(this: CandlestickBarStyleBearishTriple){
        var col = new BorderColorButton(this.inputSettings.itemStyle.r_borderColor0);
        col.tooltipPrefix = "Border Color of the bearish candle stick.";
        col.colorInputLabel = "Candle stick border color";
        return col;
    })
    borderColor: BorderColorButton;

    get top(){
        return {tag: "div", attr:{class: "label"}, child: "Bearish"};
    }

    get middle(){
        return this.color;
    }

    get bottom(){
        return this.borderColor;
    }

}


export class GeneralCandleSeriesStyleSection extends RibbonContentSection{

    @define
    inputSettings: EChartSeriesSettings | SeriesRowDataCell;

    constructor(inputSettings: EChartSeriesSettings | SeriesRowDataCell){
        super();
        this.inputSettings = inputSettings;
    }

    @create(() => new GeneralCandleSeriesStyleTriple())
    triple: GeneralCandleSeriesStyleTriple;

    get contents(){
        return [this.triple];
    }

    label="general";

}

class GeneralCandleSeriesStyleTriple extends TripleSurface {

    @inject
    series: EChartSeriesSettings;

    @inject
    inputSettings: EChartSeriesSettings | SeriesRowDataCell;

    @create(function(this: GeneralCandleSeriesStyleTriple){
        const r = new HistoryNumberInput();
        r.default = null;
        r.r_value = this.inputSettings.itemStyle.r_borderWidth;
        r.min = 0;
        r.isSmall = true;
        r.label = "Border width";
        r.tooltip = new TooltipBlock({title: "Border width", content: "The width of the candlestick border."});
        return r;
    })
    borderWidth: HistoryNumberInput;

    @create(function(this: GeneralCandleSeriesStyleTriple){
        const r = new OpacityInput();
        r.itemName = "Candlestick";
        r.r_value = this.inputSettings.itemStyle.r_opacity;
        return r;
    })
    opacity: HistoryNumberInput;

    get top(){
        return [this.borderWidth];
    }

    get middle(){
        return [this.opacity];
    }

}


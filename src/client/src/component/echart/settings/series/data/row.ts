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
 
import {SeriesDataCell} from "./index";
import {create, init, inject} from "../../../../../../../di";
import {SeriesItemStyle} from "../style";
import {removeEmptyProperties} from "../../../../../../../core/src/object";
import {LabelLineSettings} from "../labelLine";
import {EChartSeriesSettings} from "../index";
import {SeriesLabelSettings} from "../label";
import {variable} from "../../../../../../../reactive";
import {EChartSettings} from "../../index";
import {PixelPercentValue} from "../../position";
import {extend} from "../../../../../../../core";

export class SeriesRowDataCell extends SeriesDataCell{

    type = "row";

    @inject
    series: EChartSeriesSettings;

    @init
    init(){
        super.init();
        this.builder.config("itemStyle", this.itemStyle);
        this.builder.config("labelLine", this.labelLine);
        this.builder.config("label", this.label);
        this.builder.value("symbol", this.r_symbol);
        this.builder.value("showSymbol", this.r_showSymbol);
        this.builder.value("symbolSize", this.r_symbolSize);
        this.builder.value("symbolRotate", this.r_symbolRotate);
        this.builder.value("symbolColor", this.r_symbolColor);
        this.builder.config("barWidth", this.barWidth);
        this.builder.config("barMinWidth", this.barMinWidth);
        this.builder.config("barMaxWidth", this.barMaxWidth);
    }

    barWidth = new PixelPercentValue();
    barMinWidth = new PixelPercentValue();
    barMaxWidth = new PixelPercentValue();

    @create(() => new SeriesItemStyle())
    itemStyle: SeriesItemStyle;

    @create(() => new LabelLineSettings())
    labelLine: LabelLineSettings;

    @create(() => new SeriesLabelSettings())
    label: SeriesLabelSettings;

    @inject
    settings: EChartSettings;

    public r_symbol = variable<string>(null);

    get symbol(){
        return this.r_symbol.value;
    }

    set symbol(v){
        if (v === "default"){
            v = null;
        }
        this.r_symbol.value = v;
    }

    public r_symbolSize = variable<number>(null);

    get symbolSize(){
        return this.r_symbolSize.value;
    }

    set symbolSize(v){
        this.r_symbolSize.value = v;
    }

    public r_symbolRotate = variable<number>(null);

    get symbolRotate(){
        return this.r_symbolRotate.value;
    }

    set symbolRotate(v){
        this.r_symbolRotate.value = v;
    }

    public r_showSymbol = variable<boolean>(null);

    get showSymbol(){
        return this.r_showSymbol.value;
    }

    set showSymbol(v){
        this.r_showSymbol.value = v;
    }

    public r_symbolColor = variable<string>(null);

    get symbolColor(){
        return this.r_symbolColor.value;
    }

    set symbolColor(v){
        this.r_symbolColor.value = v;
    }

    createConfig(){
        var c = super.createConfig();
        c.type = "row";
        return c;
    }

    createEChartConfig(){
        var s = super.createEChartConfig();
        var r: any = {
            itemStyle: this.itemStyle.createEChartConfig()
        };
        switch(this.series.getType()){
            case "line":
                r.label = this.label.createEChartConfig();
                this.applySymbolSettings(r);
                break;
            case "area":
                r.label = this.label.createEChartConfig();
                this.applySymbolSettings(r);
                break;
            case "scatter":
            case "effectScatter":
                r.label = this.label.createEChartConfig();
                this.applySymbolSettings(r);
                break;
            case "pie":
                r.labelLine = this.labelLine.createEChartConfig();
                r.label = this.label.createEChartConfig();
                break;
            case "candlestick":
                break;
        }
        return removeEmptyProperties(extend(s, r));
    }

    private applySymbolSettings(res: any){
        if (this.showSymbol === false){
            res.itemStyle.opacity = 0;
            return;
        }
        res.showSymbol = this.showSymbol;
        res.symbol = this.symbol;
        res.symbolSize = this.symbolSize;
        res.symbolColor = this.symbolColor;
        /*var baseColor = this.itemStyle.color || this.series.itemStyle.color || this.settings.getColorFromPalette(this.series.datasetIndex);
        var symbolColor = this.symbolColor || this.series.symbolColor || this.settings.getColorFromPalette(this.series.datasetIndex);
        if (res.label){
            if (!res.label.color){
                res.label.color = baseColor;
            }
        }
        if (res.lineStyle && !res.lineStyle.color){
            res.lineStyle.color = baseColor;
        }
        if (res.itemStyle){
            res.itemStyle.color = symbolColor || baseColor;
        }
        if (res.itemStyle && !res.itemStyle.borderColor){
            res.itemStyle.borderColor = baseColor;
        }
        if (res.areaStyle && !res.areaStyle.color){
            res.areaStyle.color = baseColor;
        }*/
    }

}

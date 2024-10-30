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
 
import {IEChartSettingsComponent} from "../base";
import {removeEmptyProperties} from "../../../../../../core/src/object";
import {variable} from "../../../../../../reactive";
import {init, inject} from "../../../../../../di";
import {EChartSeriesSettings} from "./index";
import {ConfigBuilder} from "../util";

export class SeriesItemStyle implements IEChartSettingsComponent{

    @inject
    series: EChartSeriesSettings;

    builder = new ConfigBuilder();

    constructor(){
        this.builder.value("opacity", this.r_opacity);
    }

    public r_opacity = variable<number>(null);

    get opacity(){
        return this.r_opacity.value;
    }

    set opacity(v){
        this.r_opacity.value = v;
    }

    public r_color = variable<string>(null);

    get color(){
        return this.r_color.value;
    }

    set color(v){
        this.r_color.value = v;
    }

    public r_color0 = variable<string>(null);

    get color0(){
        return this.r_color0.value;
    }

    set color0(v){
        this.r_color0.value = v;
    }

    public r_borderColor0 = variable<string>(null);

    get borderColor0(){
        return this.r_borderColor0.value;
    }

    set borderColor0(v){
        this.r_borderColor0.value = v;
    }

    public r_borderColor = variable<string>(null);

    get borderColor(){
        return this.r_borderColor.value;
    }

    set borderColor(v){
        this.r_borderColor.value = v;
    }

    public r_borderWidth = variable<number>(null);

    get borderWidth(){
        return this.r_borderWidth.value;
    }

    set borderWidth(v){
        this.r_borderWidth.value = v;
    }

    public r_borderType = variable<string>(null);

    get borderType(){
        return this.r_borderType.value;
    }

    set borderType(v){
        this.r_borderType.value = v;
    }

    public r_barBorderColor = variable<string>(null);

    get barBorderColor(){
        return this.r_barBorderColor.value;
    }

    set barBorderColor(v){
        this.r_barBorderColor.value = v;
    }

    public r_barBorderWidth = variable<number>(null);

    get barBorderWidth(){
        return this.r_barBorderWidth.value;
    }

    set barBorderWidth(v){
        this.r_barBorderWidth.value = v;
    }

    public r_barBorderRadius = variable<number>(null);

    get barBorderRadius(){
        return this.r_barBorderRadius.value;
    }

    set barBorderRadius(v){
        this.r_barBorderRadius.value = v;
    }

    createConfig(){
        return this.builder.createConfig(removeEmptyProperties({
            color: this.color,
            color0: this.color0,
            borderColor: this.borderColor,
            borderColor0: this.borderColor0,
            borderWidth: this.borderWidth,
            borderType: this.borderType,
            barBorderColor: this.barBorderColor,
            barBorderWidth: this.barBorderWidth,
            barBorderRadius: this.barBorderRadius
        }));
    }

    createEChartConfig(){
        var res: any = {
            color: this.color,
            opacity: this.opacity
        };
        switch(this.series.type){
            case "line":
            case "area":
            case "pie":
            case "scatter":
            case "effectScatter":
                res.borderColor = this.borderColor;
                res.borderWidth = this.borderWidth;
                res.borderType = this.borderType;
                break;
            case "bar":
                res.barBorderColor = this.barBorderColor;
                res.barBorderWidth = this.barBorderWidth;
                if (this.barBorderRadius){
                    res.barBorderRadius = [this.barBorderRadius, this.barBorderRadius, 0, 0];
                }
                break;
            case "candlestick":
                res.color0 = this.color0;
                res.borderColor = this.borderColor;
                res.borderColor0 = this.borderColor0;
                res.borderWidth = this.borderWidth;
                break;
        }
        res = removeEmptyProperties(res);
        if (res.opacity){
            res.opacity = res.opacity / 100;
        }
        return res;
    }

    applyConfig(c){
        if (c.color){
            this.color = c.color;
        }
        if (c.color0){
            this.color0 = c.color0;
        }
        if (c.borderColor){
            this.borderColor = c.borderColor;
        }
        if (c.borderColor0){
            this.borderColor0 = c.borderColor0;
        }
        if ("borderWidth" in c){
            this.borderWidth = c.borderWidth;
        }
        if (c.borderType){
            this.borderType = c.borderType;
        }
        if (c.barBorderColor){
            this.barBorderColor = c.barBorderColor;
        }
        if ("barBorderWidth" in c){
            this.barBorderWidth = c.barBorderWidth;
        }
        if ("barBorderRadius" in c){
            this.barBorderRadius = c.barBorderRadius;
        }
        this.builder.applyConfig(c);
    }

}

export class SeriesLineStyle implements IEChartSettingsComponent{

    builder = new ConfigBuilder();

    @inject
    series: EChartSeriesSettings;

    public r_show = variable<boolean>(null);

    get show(){
        return this.r_show.value;
    }

    set show(v){
        this.r_show.value = v;
    }

    public r_color = variable<string>(null);

    get color(){
        return this.r_color.value;
    }

    set color(v){
        this.r_color.value = v;
    }

    public r_width = variable<number>(null);

    get width(){
        return this.r_width.value;
    }

    set width(v){
        this.r_width.value = v;
    }

    public r_type = variable<string>(null);

    get type(){
        return this.r_type.value;
    }

    set type(v){
        this.r_type.value = v;
    }

    public r_opacity = variable<number>(null);

    get opacity(){
        return this.r_opacity.value;
    }

    set opacity(v){
        this.r_opacity.value = v;
    }

    createEChartConfig(){
        var c = this.createConfig();
        if (this.show === false){
            c.opacity = 0;
        }
        if (c.opacity){
            c.opacity = c.opacity / 100;
        }
        return c;
    }

    createConfig(){
        return this.builder.createConfig({});
    }

    applyConfig(c){
        this.builder.applyConfig(c);
    }


    @init
    init(){
        this.builder.value("color", this.r_color);
        this.builder.value("width", this.r_width);
        this.builder.value("type", this.r_type);
        this.builder.value("opacity", this.r_opacity);
        this.builder.value("show", this.r_show);
    }

}

export class SeriesAreaStyle implements IEChartSettingsComponent{

    builder = new ConfigBuilder();

    public r_color = variable<string>(null);

    @inject
    series: EChartSeriesSettings;

    get color(){
        return this.r_color.value;
    }

    set color(v){
        this.r_color.value = v;
    }

    public r_origin = variable<string>(null);

    get origin(){
        return this.r_origin.value;
    }

    set origin(v){
        this.r_origin.value = v;
    }

    public r_opacity = variable<number>(null);

    get opacity(){
        return this.r_opacity.value;
    }

    set opacity(v){
        this.r_opacity.value = v;
    }

    @init
    init(){
        this.builder.value("color", this.r_color);
        this.builder.value("origin", this.r_origin);
        this.builder.value("opacity", this.r_opacity);
    }

    createEChartConfig(){
        var res = this.createConfig();
        if (this.series.getType() === "area_interval"){
            delete res.origin;
        }
        if (res.opacity){
            res.opacity = res.opacity / 100;
        }
        return res;
    }

    createConfig(){
        return this.builder.createConfig({});
    }

    applyConfig(c){
        this.builder.applyConfig(c);
    }

}

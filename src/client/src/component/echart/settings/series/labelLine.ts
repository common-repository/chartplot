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
import {ConfigBuilder} from "../util";
import {variable} from "../../../../../../reactive";

class LabelLineStyleSettings implements IEChartSettingsComponent{

    builder = new ConfigBuilder();

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

    constructor(){
        this.builder.value("color", this.r_color);
        this.builder.value("width", this.r_width);
        this.builder.value("type", this.r_type);
        this.builder.value("opacity", this.r_opacity);
    }

    createConfig(){
        return this.builder.createConfig({});
    }

    createEChartConfig(){
        var c = this.createConfig();
        if (c.opacity){
            c.opacity = this.opacity / 100;
        }
        return c;
    }

    applyConfig(c){
        this.builder.applyConfig(c);
    }

}

export class LabelLineSettings implements IEChartSettingsComponent{

    builder = new ConfigBuilder();

    public r_show = variable<boolean>(null);

    get show(){
        return this.r_show.value;
    }

    set show(v){
        this.r_show.value = v;
    }

    public r_length = variable<number>(null);

    get length(){
        return this.r_length.value;
    }

    set length(v){
        this.r_length.value = v;
    }

    public r_length2 = variable<number>(null);

    get length2(){
        return this.r_length2.value;
    }

    set length2(v){
        this.r_length2.value = v;
    }

    public r_smooth = variable<boolean>(null);

    get smooth(){
        return this.r_smooth.value;
    }

    set smooth(v){
        this.r_smooth.value = v;
    }

    lineStyle = new LabelLineStyleSettings();

    constructor(){
        this.builder.value("show", this.r_show);
        this.builder.value("length", this.r_length);
        this.builder.value("length2", this.r_length2);
        this.builder.value("smooth", this.r_smooth);
        this.builder.config("lineStyle", this.lineStyle);
    }

    applyConfig(c){
        this.builder.applyConfig(c);
    }

    createConfig(){
        return this.builder.createConfig({});
    }

    createEChartConfig(){
        return this.createConfig();
    }

}

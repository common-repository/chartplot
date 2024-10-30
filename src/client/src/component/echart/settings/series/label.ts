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
 
import {variable} from "../../../../../../reactive";
import {IEChartSettingsComponent} from "../base";
import {removeEmptyProperties} from "../../../../../../core/src/object";

export class SeriesLabelSettings implements IEChartSettingsComponent{

    public r_show = variable<boolean>(null);

    get show(){
        return this.r_show.value;
    }

    set show(v){
        this.r_show.value = v;
    }

    public r_position = variable<string>(null);

    get position(){
        return this.r_position.value;
    }

    set position(v){
        this.r_position.value = v;
    }

    public r_rotate = variable<number>(null);

    get rotate(){
        return this.r_rotate.value;
    }

    set rotate(v){
        this.r_rotate.value = v;
    }

    public r_color = variable<string>(null);

    get color(){
        return this.r_color.value;
    }

    set color(v){
        this.r_color.value = v;
    }

    public r_fontStyle = variable<string>(null);

    get fontStyle(){
        return this.r_fontStyle.value;
    }

    set fontStyle(v){
        this.r_fontStyle.value = v;
    }

    public r_fontWeight = variable<string>(null);

    get fontWeight(){
        return this.r_fontWeight.value;
    }

    set fontWeight(v){
        this.r_fontWeight.value = v;
    }

    public r_fontFamily = variable<string>(null);

    get fontFamily(){
        return this.r_fontFamily.value;
    }

    set fontFamily(v){
        this.r_fontFamily.value = v;
    }

    public r_fontSize = variable<number>(null);

    get fontSize(){
        return this.r_fontSize.value;
    }

    set fontSize(v){
        this.r_fontSize.value = v;
    }

    public r_backgroundColor = variable<string>(null);

    get backgroundColor(){
        return this.r_backgroundColor.value;
    }

    set backgroundColor(v){
        this.r_backgroundColor.value = v;
    }

    public r_padding = variable(null);

    get padding(){
        return this.r_padding.value;
    }

    set padding(v){
        this.r_padding.value = v;
    }

    createConfig(){
        return removeEmptyProperties({
            show: this.r_show.value,
            position: this.r_position.value,
            rotate: this.r_rotate.value,
            color: this.color,
            fontStyle: this.fontStyle,
            fontWeight: this.fontWeight,
            fontFamily: this.fontFamily,
            fontSize: this.fontSize,
            backgroundColor: this.backgroundColor,
            padding: this.padding
        });
    }

    createEChartConfig(){
        return this.createConfig();
    }

    applyConfig(c){
        if ("show" in c){
            this.show = c.show;
        }
        if ("position" in c){
            this.position = c.position;
        }
        if ("rotate" in c){
            this.rotate = c.rotate;
        }
        this.color = c.color || null;
        this.fontStyle = c.fontStyle || null;
        this.fontWeight = c.fontWeight || null;
        this.fontFamily = c.fontFamily || null;
        if ("fontSize" in c){
            this.fontSize = c.fontSize;
        }
        this.backgroundColor = c.backgroundColor || null;
        if ("padding" in c){
            this.padding = c.padding;
        }
    }

}

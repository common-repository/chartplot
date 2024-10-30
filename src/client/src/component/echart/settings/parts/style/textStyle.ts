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
 
import {IEChartSettingsComponent} from "../../base";
import {variable} from "../../../../../../../reactive";
import {removeEmptyProperties} from "../../../../../../../core/src/object";
import {ConfigBuilder} from "../../util";

export class TextStyleSettings implements IEChartSettingsComponent{

    builder = new ConfigBuilder();

    public r_fontSize = variable<number>(null);

    get fontSize(){
        return this.r_fontSize.value;
    }

    set fontSize(v){
        this.r_fontSize.value = v;
    }

    public r_fontFamily = variable<string>(null);

    get fontFamily(){
        return this.r_fontFamily.value;
    }

    set fontFamily(v){
        this.r_fontFamily.value = v;
    }

    public r_fontWeight = variable<string>(null);

    get fontWeight(){
        return this.r_fontWeight.value;
    }

    set fontWeight(v){
        this.r_fontWeight.value = v;
    }

    public r_fontStyle = variable<string>(null);

    get fontStyle(){
        return this.r_fontStyle.value;
    }

    set fontStyle(v){
        this.r_fontStyle.value = v;
    }

    public r_color = variable<string>(null);

    get color(){
        return this.r_color.value;
    }

    set color(v){
        this.r_color.value = v;
    }


    applyConfig(c){
        this.color = c.color ? c.color : null;
        this.fontSize = null;
        if ("fontSize" in c){
            this.fontSize = c.fontSize;
        }
        this.fontFamily = c.fontFamily || null;
        this.fontWeight = c.fontWeight || null;
        this.fontStyle = c.fontStyle || null;
        this.builder.applyConfig(c);
    }

    createConfig(){
        return this.builder.createConfig(removeEmptyProperties({
            color: this.color,
            fontSize: this.fontSize,
            fontFamily: this.fontFamily,
            fontWeight: this.fontWeight,
            fontStyle: this.fontStyle
        }));
    }

    createEChartConfig(){
        return this.createConfig();
    }

}

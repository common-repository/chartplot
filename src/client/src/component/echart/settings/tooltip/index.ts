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
import {variable} from "../../../../../../reactive";
import {removeEmptyProperties} from "../../../../../../core/src/object";
import {create, inject} from "../../../../../../di";
import {EditorSettings} from "../../../editor/settings";
import {PixelPercentValue} from "../position";
import {AxisPointerSettings} from "./axisPointer";

export class TooltipSettings implements IEChartSettingsComponent{

    @inject
    editorSettings: EditorSettings;

    public xPos = new PixelPercentValue();
    public yPos = new PixelPercentValue();
    public r_positionType = variable<string>(null);
    public r_backgroundColor = variable<string>(null);
    public r_borderColor = variable<string>(null);
    public r_borderWidth = variable<number>(null);
    public r_padding = variable<number>(null);

    @create
    axisPointer: AxisPointerSettings;
    create_axisPointer(){
        return new AxisPointerSettings();
    }

    get padding(){
        return this.r_padding.value;
    }

    set padding(v){
        this.r_padding.value = v;
    }

    get borderWidth(){
        return this.r_borderWidth.value;
    }

    set borderWidth(v){
        this.r_borderWidth.value = v;
    }

    get borderColor(){
        return this.r_borderColor.value;
    }

    set borderColor(v){
        this.r_borderColor.value = v;
    }

    get backgroundColor(){
        return this.r_backgroundColor.value;
    }

    set backgroundColor(v){
        this.r_backgroundColor.value = v;
    }

    get positionType(){
        return this.r_positionType.value;
    }

    set positionType(v){
        this.r_positionType.value = v;
    }

    public r_trigger = variable<string>(null);

    get trigger(){
        return this.r_trigger.value;
    }

    set trigger(v){
        this.r_trigger.value = v;
    }

    public r_show = variable<boolean>(null);

    get show(){
        return this.r_show.value;
    }

    set show(v){
        this.r_show.value = v;
    }

    applyConfig(c){
        if ("show" in c){
            this.show = c.show;
        }
        else {
            this.show = null;
        }
        this.xPos.applyConfig(c.xPos || {});
        this.yPos.applyConfig(c.yPos || {});
        this.positionType = c.positionType || null;
        this.backgroundColor = c.backgroundColor || null;
        this.borderColor = c.borderColor || null;
        this.trigger = c.trigger || null;
    }

    createConfig(){
        return removeEmptyProperties({
            show: this.show,
            xPos: this.xPos.createConfig(),
            yPos: this.yPos.createConfig(),
            positionType: this.positionType,
            backgroundColor: this.backgroundColor,
            borderColor: this.borderColor,
            trigger: this.trigger
        });
    }

    getEchartPosition(){
        if (this.positionType === "offset"){
            return [this.xPos.getEchartValue(), this.yPos.getEchartValue()];
        }
        return this.positionType;
    }

    createEChartConfig(){
        return this.createConfig();
    }

}

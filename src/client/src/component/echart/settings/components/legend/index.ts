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
 
import {AbstractChartSettings, IEChartSettingsComponent} from "../../base";
import {variable} from "../../../../../../../reactive";
import {removeEmptyProperties} from "../../../../../../../core/src/object";
import {getIconShape, IconSet} from "../../../../icon";
import {
    EChartPositionUtils,
    LeftRightDefaultPixelPercentPosition,
    PixelPercentPosition, TopBottomDefaultPixelPercentPosition
} from "../../position";
import {TextStyleSettings} from "../../parts/style/textStyle";
import {factory} from "../../../../../../../di";
import {ConfigBuilder} from "../../util";

export class EChartLegendSettings extends AbstractChartSettings implements IEChartSettingsComponent{

    type = "legend";
    icon = getIconShape(IconSet.list);

    builder = new ConfigBuilder();

    constructor(){
        super();
        this.builder.value("name", this.r_name);
        this.builder.value("echartType", this.r_echartType);
        this.builder.value("orientation", this.r_orientation);
        this.xPosDefault.defaultSide = "center";
    }

    @factory
    createSettings(){
        return new EChartLegendSettings();
    }

    xPos = new PixelPercentPosition();
    xPosDefault = new LeftRightDefaultPixelPercentPosition(this.xPos);

    yPos = new PixelPercentPosition();
    yPosDefault = new TopBottomDefaultPixelPercentPosition(this.yPos)

    public r_echartType = variable<string>(null);

    get echartType(){
        return this.r_echartType.value;
    }

    set echartType(v){
        this.r_echartType.value = v;
    }

    public r_show = variable(true);

    textStyle = new TextStyleSettings();

    public r_orientation = variable(null);

    get orientation(){
        return this.r_orientation.value;
    }

    set orientation(v){
        this.r_orientation.value = v;
    }

    public r_backgroundColor = variable<string>(null);

    public r_name = variable<string>(null);

    get name(){
        return this.r_name.value;
    }

    set name(v){
        this.r_name.value = v;
    }

    get backgroundColor(){
        return this.r_backgroundColor.value;
    }

    set backgroundColor(v){
        this.r_backgroundColor.value = v;
    }

    get show(){
        return this.r_show.value;
    }

    set show(v){
        this.r_show.value = v;
    }

    createEChartConfig(){
        const res = {
            show: this.show,
            textStyle: this.textStyle.createEChartConfig(),
            backgroundColor: this.backgroundColor,
            type: this.echartType,
            orient: this.orientation
        };
        EChartPositionUtils.applyLeftRightConfig(res, this.xPos);
        EChartPositionUtils.applyTopBottomConfig(res, this.yPos);
        return removeEmptyProperties(res);
    }

    createConfig(){
        return this.builder.createConfig(removeEmptyProperties({
            show: this.show,
            type: this.type,
            xPos: this.xPos.createConfig(),
            yPos: this.yPos.createConfig(),
            textStyle: this.textStyle.createConfig(),
            backgroundColor: this.backgroundColor
        }));
    }

    applyConfig(c){
        if ("show" in c){
            this.show = c.show;
        }
        this.xPos.applyConfig(c.xPos || {});
        this.yPos.applyConfig(c.yPos || {});
        this.textStyle.applyConfig(c.textStyle || {});
        if (c.backgroundColor){
            this.backgroundColor = c.backgroundColor;
        }
        this.builder.applyConfig(c);
    }

}

export class LegendTextStyle extends TextStyleSettings{

}

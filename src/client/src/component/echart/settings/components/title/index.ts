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
import {variable} from '../../../../../../../reactive';
import {getIconShape, IconSet} from "../../../../icon";
import {removeEmptyProperties} from "../../../../../../../core/src/object";
import {factory, inject} from "../../../../../../../di";
import {EditorSettings} from "../../../../editor/settings";
import {
    EChartPositionUtils,
    LeftRightDefaultPixelPercentPosition,
    PixelPercentPosition,
    TopBottomDefaultPixelPercentPosition
} from "../../position";
import {TextStyleSettings} from "../../parts/style/textStyle";

export class EChartTitleSettings extends AbstractChartSettings implements IEChartSettingsComponent{

    type = "title";
    icon = getIconShape(IconSet.title)

    @factory
    createSettings(){
        return new EChartTitleSettings();
    }

    @inject
    editorSettings: EditorSettings;

    public r_showChartTitle = variable(true);

    xPos = new PixelPercentPosition();
    xPosDefault = new LeftRightDefaultPixelPercentPosition(this.xPos)
    yPos = new PixelPercentPosition();
    yPosDefault = new TopBottomDefaultPixelPercentPosition(this.yPos)

    textStyle = new TextStyleSettings();

    public r_backgroundColor = variable(null);

    get backgroundColor(){
        return this.r_backgroundColor.value;
    }

    set backgroundColor(v){
        this.r_backgroundColor.value = v;
    }

    get showChartTitle(){
        return this.r_showChartTitle.value;
    }

    set showChartTitle(v){
        this.r_showChartTitle.value = v;
    }

    public r_text = variable("");

    get text(){
        return this.r_text.value;
    }

    set text(v){
        this.r_text.value = v;
    }

    get name(){
        if (this.showChartTitle){
            return this.editorSettings.title;
        }
        return this.text;
    }

    applyConfig(c: any){
        this.text = "";
        if (c.text){
            this.text = c.text;
        }
        this.showChartTitle = true;
        if ("showChartTitle" in c){
            this.showChartTitle = c.showChartTitle;
        }
        this.xPos.applyConfig(c.xPos || {});
        this.yPos.applyConfig(c.yPos || {});
        this.textStyle.applyConfig(c.textStyle || {});
        if  (c.backgroundColor){
            this.backgroundColor = c.backgroundColor;
        }
    }

    createConfig(){
        return removeEmptyProperties({
            text: this.text,
            showChartTitle: this.showChartTitle,
            type: this.type,
            xPos: this.xPos.createConfig(),
            yPos: this.yPos.createConfig(),
            textStyle: this.textStyle.createConfig(),
            backgroundColor: this.backgroundColor
        });
    }

    createEChartConfig(){
        const res: any = {
            text: this.showChartTitle ? this.editorSettings.title : this.text,
            textStyle: this.textStyle.createEChartConfig(),
            backgroundColor: this.backgroundColor
        }
        EChartPositionUtils.applyLeftRightConfig(res, this.xPosDefault);
        EChartPositionUtils.applyTopBottomConfig(res, this.yPosDefault);
        return removeEmptyProperties(res);
    }

}

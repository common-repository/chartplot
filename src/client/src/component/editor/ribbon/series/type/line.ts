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
 
import {RibbonContentSection} from "../../base";
import {ColorInputButton} from "../../blocks/input/color";
import {EChartSeriesSettings} from "../../../../echart/settings/series";
import {TripleSurface} from "../../blocks/surface";
import {BackgroundColorButton} from "../../blocks/style/text";
import {inject} from "../../../../../../../di/src";
import {create} from "../../../../../../../di";
import {BorderColorButton, BorderType, BorderWidthInput} from "../../blocks/style/border";

export class LineSeriesStyleSection extends RibbonContentSection{

    label = "style";

    @create(() => new StyleTriple())
    style: StyleTriple;

    get contents(){
        return [this.style];
    }

}

export class LineSeriesBorderSection extends RibbonContentSection{
    label = "border";

    @create(() => new BorderTriple())
    border: BorderTriple;

    get contents(){
        return [this.border];
    }
}

class StyleTriple extends TripleSurface{

    @inject
    selectedSeries: EChartSeriesSettings;

    @create(function(this: StyleTriple){
        return new BackgroundColorButton(this.selectedSeries.itemStyle.r_color);
    })
    color: ColorInputButton;

    get middle(){
        return this.color;
    }

}

class BorderTriple extends TripleSurface{

    @inject
    selectedSeries: EChartSeriesSettings;

    get top(){
        return this.borderType;
    }

    get middle(){
        return this.borderColor;
    }

    get bottom(){
        return this.borderWidth;
    }

    @create(function(this: BorderTriple){
        return new BorderColorButton(this.selectedSeries.itemStyle.r_borderColor);
    })
    borderColor: BorderColorButton;

    @create(function(this: BorderTriple){
        var res = new BorderWidthInput(this.selectedSeries.itemStyle.r_borderWidth);
        res.default = "1";
        return res;
    })
    borderWidth: BorderWidthInput;

    @create(function(this: BorderTriple){
        return new BorderType(this.selectedSeries.itemStyle.r_borderType);
    })
    borderType: BorderType;

}

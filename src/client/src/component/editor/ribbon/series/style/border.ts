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
import {BorderColorButton, BorderType, BorderWidthInput} from "../../blocks/style/border";
import {EChartSeriesSettings} from "../../../../echart/settings/series";
import {create, inject} from "../../../../../../../di";
import {RibbonContentSection} from "../../base";

export class SeriesItemStyleBorderSection extends RibbonContentSection{

    @create(() => new SeriesItemStyleBorderTriple())
    triple: SeriesItemStyleBorderTriple;

    get contents(){
        return [this.triple];
    }

    label = "border";

}

class SeriesBorderWidthInput extends BorderWidthInput{

    @inject
    series: EChartSeriesSettings;

    min = 0;

    get default(){
        switch(this.series.getType()){
            case "pie":
                return 0;
            default:
                return 2;
        }
    }

    set default(v){

    }

}

class SeriesItemStyleBorderTriple extends TripleSurface{

    label = "border";

    @inject
    series: EChartSeriesSettings;

    @create(function(this: SeriesItemStyleBorderTriple){
        var res = new BorderColorButton(this.series.itemStyle.r_borderColor);
        res.label = "Color";
        return res;
    })
    color: BorderColorButton;

    @create(function(this: SeriesItemStyleBorderTriple){
        var w = new SeriesBorderWidthInput(this.series.itemStyle.r_borderWidth);
        return w;
    })
    width: BorderWidthInput;

    @create(function(this: SeriesItemStyleBorderTriple){
        return new BorderType(this.series.itemStyle.r_borderType);
    })
    type: BorderType;

    get top(){
        return [this.type];
    }

    get middle(){
        return [this.color];
    }

    get bottom(){
        return [this.width];
    }

}

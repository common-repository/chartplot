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
 
import {RibbonContentSection} from "../../../../base";
import {create, inject} from "../../../../../../../../../di";
import {BorderColorButton, BorderType, BorderWidthInput} from "../../../../blocks/style/border";
import {EChartSeriesSettings} from "../../../../../../echart/settings/series";
import {TripleSurface} from "../../../../blocks/surface";
import {SeriesRowDataCell} from "../../../../../../echart/settings/series/data/row";

export class SeriesDataItemStyleBorderSection extends RibbonContentSection{

    @create(() => new SeriesDataItemStyleBorderTriple())
    triple: SeriesDataItemStyleBorderTriple;

    get contents(){
        return [this.triple];
    }

    label = "border";

}

class SeriesDataBorderWidthInput extends BorderWidthInput{

    @inject
    series: EChartSeriesSettings;

    min = 0;

    get default(){
        return null;
    }

    set default(v){

    }

}

class SeriesDataItemStyleBorderTriple extends TripleSurface{

    label = "border";

    @inject
    row: SeriesRowDataCell;

    @create(function(this: SeriesDataItemStyleBorderTriple){
        var res = new BorderColorButton(this.row.itemStyle.r_borderColor);
        res.label = "Color"
        return res;
    })
    color: BorderColorButton;

    @create(function(this: SeriesDataItemStyleBorderTriple){
        var w = new SeriesDataBorderWidthInput(this.row.itemStyle.r_borderWidth);
        return w;
    })
    width: BorderWidthInput;

    @create(function(this: SeriesDataItemStyleBorderTriple){
        var r = new BorderType(this.row.itemStyle.r_borderType);
        r.items.unshift({
            value: null,
            label: "default"
        })
        r.default = null;
        return r;
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

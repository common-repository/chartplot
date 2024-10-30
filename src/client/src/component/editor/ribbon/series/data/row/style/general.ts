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
 
import {BackgroundColorButton} from "../../../../blocks/style/text";
import {TripleSurface} from "../../../../blocks/surface";
import {RibbonContentSection} from "../../../../base";
import {create, inject} from "../../../../../../../../../di";
import {SeriesRowDataCell} from "../../../../../../echart/settings/series/data/row";

export class GeneralSeriesDataStyleSection extends RibbonContentSection{

    @create(() => new GeneralSeriesDataStyleTriple())
    triple: GeneralSeriesDataStyleTriple;

    get contents(){
        return [this.triple];
    }

    label="general";

}

class GeneralSeriesDataStyleTriple extends TripleSurface {

    @inject
    row: SeriesRowDataCell;

    @create(function(this: GeneralSeriesDataStyleTriple){
        var col = new BackgroundColorButton(this.row.itemStyle.r_color);
        col.labelPrefix = "Color of the data item. If not specified, will use the series color.";
        col.colorInputLabel = "Data item color";
        return col;
    })
    color: BackgroundColorButton;

    get top(){
        return [this.color];
    }

    get middle(){
        return null;
    }

}


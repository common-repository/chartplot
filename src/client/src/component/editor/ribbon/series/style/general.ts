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
import {create, inject} from "../../../../../../../di";
import {BackgroundColorButton} from "../../blocks/style/text";
import {EChartSeriesSettings} from "../../../../echart/settings/series";
import {RibbonContentSection} from "../../base";
import {RoseTypeSelect} from "./pie";

export class GeneralSeriesStyleSection extends RibbonContentSection{

    @create(() => new GeneralSeriesStyleTriple())
    triple: GeneralSeriesStyleTriple;

    get contents(){
        return [this.triple];
    }

    label="general";

}

class GeneralSeriesStyleTriple extends TripleSurface {

    @inject
    series: EChartSeriesSettings;

    @create(function(this: GeneralSeriesStyleTriple){
        var col = new BackgroundColorButton(this.series.itemStyle.r_color);
        col.labelPrefix = "Series color. If not specified, will use color from chart color palette.";
        col.colorInputLabel = "Series color";
        return col;
    })
    color: BackgroundColorButton;

    @create(() => new RoseTypeSelect())
    roseType: RoseTypeSelect;

    get top(){
        return [this.color];
    }

    get middle(){
        if (this.series.getType() === "pie"){
            return  [this.roseType];
        }
        return null;
    }

}


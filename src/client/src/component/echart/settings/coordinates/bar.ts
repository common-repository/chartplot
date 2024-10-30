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
import {ConfigBuilder} from "../util";
import {PixelPercentValue} from "../position";

export class GlobalBarSettings{


    builder = new ConfigBuilder();

    public r_barWidth = variable<number>(null);

    get barWidth(){
        return this.r_barWidth.value;
    }

    set barWidth(v){
        this.r_barWidth.value = v;
    }

    public r_barMaxWidth = variable<number>(null);

    get barMaxWidth(){
        return this.r_barMaxWidth.value;
    }

    set barMaxWidth(v){
        this.r_barMaxWidth.value = v;
    }

    public r_barMinHeight = variable<number>(null);

    get barMinHeight(){
        return this.r_barMinHeight.value;
    }

    set barMinHeight(v){
        this.r_barMinHeight.value = v;
    }

    public barGap = new PixelPercentValue();

    public barCategoryGap = new PixelPercentValue();

    constructor(){
        this.builder.value("barWidth", this.r_barWidth);
        this.builder.value("barMaxWidth", this.r_barMaxWidth);
        this.builder.value("barMinHeight", this.r_barMinHeight);
        this.builder.config("barGap", this.barGap);
        this.builder.config("barCategoryGap", this.barCategoryGap);
        this.barCategoryGap.defaultPixelPercent = "percent";
        this.barGap.defaultPixelPercent = "percent";
    }

}

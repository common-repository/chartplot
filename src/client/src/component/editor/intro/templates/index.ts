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
 
import {factory} from "../../../../../../di";
import {EmptyTemplate} from "./empty";
import {ColumnTemplate} from "./column";
import {LineTemplate} from "./line";
import {AreaTemplate} from "./area";
import {CandlestickTemplate} from "./candlestick";
import {BarTemplate} from "./bar";
import {PieTemplate} from "./pie/pie";
import {DonutTemplate} from "./pie/donut";
import {PieDonutTemplate} from "./pie/pie_donut";
import {ScatterTemplate} from "./scatter/scatter";
import {BubbleTemplate} from "./scatter/bubble";
import {ColumnStackedTemplate} from "./stacked/column_stacked";
import {AreaStackedTemplate} from "./stacked/area_stacked";
import {PieCustomItemStyleTemplate} from "./pie/pie-custom-item-style";
import {BarPieTemplate} from "./bar-pie";
import {CandleVolumeTemplate} from "./candle-volume";

export class Templates{

    tag = "div";
    attr = {
        class: "container-fluid"
    }

    constructor(){

    }

    @factory
    create(a){
        return a;
    };

    get child(){
        return [this.create(new EmptyTemplate()),
            this.create(new ColumnTemplate()),
            this.create(new LineTemplate()),
            this.create(new AreaTemplate()),
            this.create(new CandlestickTemplate()),
            this.create(new BarTemplate()),
            this.create(new PieTemplate()),
            this.create(new DonutTemplate()),
            this.create(new PieDonutTemplate()),
            this.create(new ScatterTemplate()),
        this.create(new BubbleTemplate()),
        this.create(new ColumnStackedTemplate()),
            this.create(new AreaStackedTemplate()),
        this.create(new PieCustomItemStyleTemplate()),
        this.create(new BarPieTemplate()),
        this.create(new CandleVolumeTemplate())];
    }

}

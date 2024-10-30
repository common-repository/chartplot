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
 
import {BigRibbonButton, buttonRadioGroup} from "../blocks";
import {create, init} from "../../../../../../di";
import {RibbonContentSection} from "../base";
import {getIconShape, IconSet} from "../../../icon";

export class SingleViewButton extends BigRibbonButton{

    label = "chart"
    icon = getIconShape(IconSet.bar_chart)

}

export class DataViewButton extends BigRibbonButton{

    label = "data"
    icon = getIconShape(IconSet.table2)

}

export class SplitVewButton extends BigRibbonButton{

    label = ["chart", "data"]
    icon = getIconShape(IconSet.split_vertical)

}

export class LayoutSection extends RibbonContentSection{

    label = "layout";

    @create(() => new DataViewButton())
    data: DataViewButton;

    @create(() => new SplitVewButton())
    split: SplitVewButton;

    get contents(){
        return [this.split, this.data];
    }

    @init
    init(){
        buttonRadioGroup([this.split, this.data]);
    }

}

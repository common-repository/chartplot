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
 
import {ColorInputButton} from "../input/color";
import {IReactiveVariable} from "../../../../../../../reactive/src/variable";
import {IconSet} from "../../../../icon";
import {NumberInput} from "../input";
import {HistoryRibbonSelectList, RibbonSelectButton} from "../index";
import {LabelSelectListItem, SelectList} from "../../../../list/select";
import {inject} from "../../../../../../../di";
import {ChartHistory} from "../../../../history";
import {ValueHistory} from "../../../../history/value";
import {TooltipBlock} from "../tooltip";

export class BorderColorButton extends ColorInputButton{

    icon_shape = IconSet.border_color

    constructor(public r_color: IReactiveVariable<string>){
        super();
    }

    tooltipPrefix = "Color of the border. ";

    get tooltip(){
        return new TooltipBlock({title: this.colorInputLabel, content:{tag: "html",
                child: `
<p>${this.tooltipPrefix}</p>
You can specify the values in any valid css format, e.g:
 <ul class="bullet">
 <li>'rgb(34,100,200)'</li>
 <li>'red'</li>
 <li>'hsla(120, 20, 40)'</li>
</ul>`}});
    }

    colorInputLabel = "Border color"

}

export class BorderWidthInput extends NumberInput{

    @inject
    history: ChartHistory;

    constructor(public r_nvalue: IReactiveVariable<number>){
        super();
    }

    default = null;

    get value(){
        if (this.r_nvalue.value === null){
            return this.default;
        }
        return this.r_nvalue.value;
    }

    set value(v){
        this.history.executeCommand(new ValueHistory(this.r_nvalue, v));
    }

    tooltip = new TooltipBlock({title: "Border width", content: "Width of the border. When set to 0 or empty, no border will be drawn."});

    label = "width"

    getClass(){
        return super.getClass()+" small-input";
    }

}

export class BorderType extends HistoryRibbonSelectList{

    constructor(public r_value: IReactiveVariable<string>){
        super();
    }

    default = "solid";

    tooltip = new TooltipBlock({title: "Border type", content: "The type of the border to render"});

    items = [{value: "solid", label: "solid"},
        {value: "dashed", label: "dashed"},
        {value: "dotted", label: "dotted"}]


}

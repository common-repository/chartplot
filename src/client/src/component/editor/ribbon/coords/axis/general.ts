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
import {CheckboxInput} from "../../blocks/checkbox";
import {create, inject} from "../../../../../../../di";
import {GridAxis} from "../../../../echart/settings/coordinates/grid/axis";
import {TripleSurface} from "../../blocks/surface";
import {RibbonSelectButton} from "../../blocks";
import {getIconShape, IconSet} from "../../../../icon";
import {ValueHistory} from "../../../../history/value";
import {ChartHistory} from "../../../../history";
import {IconLabelSelectListItem, SelectList} from "../../../../list/select";
import {TooltipBlock} from "../../blocks/tooltip";
import {HistoryTextInput} from "../../blocks/input";

export class AxisGeneralSection extends RibbonContentSection{

    label = "general";

    @create(() => new AxisFirstTriple())
    first: AxisFirstTriple;

    get contents(){
        return [this.first];
    }

}

class AxisFirstTriple extends TripleSurface{

    @inject
    selectedAxis: GridAxis;

    @create(function(this: AxisFirstTriple){
        var r = new HistoryTextInput();
        r.label = "Name";
        r.r_value = this.selectedAxis.r_name;
        return r;
    })
    name: HistoryTextInput;

    @create(() => new AxisShowButton())
    show: AxisShowButton;

    @create(() => new AxisSelectType())
    type: AxisSelectType;

    get bottom(){
        return this.name;
    }

    get middle(){
        return this.show;
    }

    get top(){
        return this.type;
    }

}

class AxisShowButton extends CheckboxInput{

    label = "show";

    @inject
    selectedAxis: GridAxis;

    get value(){
        return this.selectedAxis.show;
    }

    set value(v){
        this.selectedAxis.show = v;
    }

    tooltip = new TooltipBlock({title: "Show axis", content: `
    If checked, will render the axis including ticks and labels.
    `})

}

export var typeToLabel = {
    value: "Linear",
    category: "Categorical",
    time: "Time",
    log: "Logarithmic"
}

class AxisSelectType extends RibbonSelectButton {

    get label(){
        return typeToLabel[this.selectedAxis.type];
    }

    get icon(){
        return this.selectedAxis.getTypeIcon();
    }

    @inject
    selectedAxis: GridAxis;

    @inject
    history: ChartHistory

    set type(type: string){
        const ser = this.selectedAxis;
        this.history.executeCommand(new ValueHistory(ser.r_type, type));
    }

    getContent(){
        const dropwdown = new SelectList();
        dropwdown.items.push(new IconLabelSelectListItem("Linear", getIconShape(IconSet.arrow_up_right)).setAction(ev => this.type = "value"));
        dropwdown.items.push(new IconLabelSelectListItem("Categorical", getIconShape(IconSet.categorical_axis)).setAction(ev => this.type = "category"));
        dropwdown.items.push(new IconLabelSelectListItem("Time", getIconShape(IconSet.clock)).setAction(ev => this.type = "time"));
        dropwdown.items.push(new IconLabelSelectListItem("Logarithmic", getIconShape(IconSet.logarithmic_axis)).setAction(ev => this.type = "log"));
        return dropwdown;
    }

    tooltip = new TooltipBlock({title: "Axis type", content:{tag: "html", child: `
The type of the axis.
<ul class="bullet">
<li><b>Linear:</b> Axis used to plot continous data using a linear scale.</li>
<li><b>Categorical:</b> Axis used to plot a discrete set of data. Use the 'Categories' tab menu to define the data.</li>
<li><b>Time:</b> Axis used to plot continous time series data.</li>
<li><b>Log:</b> Axis used to plot continous data using a logarithmic scale.</li>
</ul>
    `}})
}

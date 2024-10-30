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
 
import {TextInput} from "../../blocks/input";
import {component, create, inject} from "../../../../../../../di";
import {EChartSeriesSettings} from "../../../../echart/settings/series";
import {ChartHistory} from "../../../../history";
import {ValueHistory} from "../../../../history/value";
import {TripleSurface} from "../../blocks/surface";
import {RibbonContentSection} from "../../base";
import {CheckboxInput} from "../../blocks/checkbox";
import {TooltipBlock} from "../../blocks/tooltip";

export class StackSection extends RibbonContentSection{

    label = "stack"

    @create(() => new StackTriple())
    stack: StackTriple;

    get contents(){
        return [this.stack];
    }

    tooltip = new TooltipBlock({title: "Series stack", content: "Here you can define whether you want to render your series as a stacked series on other stacked series."})

}

export class StackTriple extends TripleSurface{

    @create(() => new StackInput())
    name: StackInput;

    @create(() => new StackEnabled())
    enabled: StackEnabled;

    get top(){
        return this.enabled;
    }

    get middle(){
        return this.name;
    }

}

class StackEnabled extends CheckboxInput{

    label = "enabled";

    @inject
    selectedSeries: EChartSeriesSettings;

    @inject
    history: ChartHistory;

    changeValue(v){
        if (v !== this.selectedSeries.stackEnabled){
            this.history.executeCommand(new ValueHistory(this.selectedSeries.r_stackEnabled, v));
        }
    }

    get value(){
        return this.selectedSeries.stackEnabled;
    }

    set value(v){
        this.selectedSeries.stackEnabled = v;
    }

    tooltip = new TooltipBlock({title: "Stack series", content: "If enabled, will render this series as a stacked series."})

}

class StackInput extends TextInput{

    label = "name"

    @inject
    selectedSeries: EChartSeriesSettings;

    @inject
    history: ChartHistory;

    changeValue(v){
        if (v !== this.selectedSeries.stack){
            this.history.executeCommand(new ValueHistory(this.selectedSeries.r_stack, v));
        }
    }

    get value(){
        return this.selectedSeries.stack;
    }

    set value(v){
        this.selectedSeries.stack = v;
    }

    get disabled(){
        return !this.selectedSeries.stackEnabled;
    }

    tooltip = new TooltipBlock({title: "Stack name", content: "The name of the stack. Series on a different stack name will be stacked separately."})

}

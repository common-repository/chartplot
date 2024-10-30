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
 
import {TripleSurface} from "../blocks/surface";
import {create, define, inject} from "../../../../../../di";
import {CheckboxInput} from "../blocks/checkbox";
import {RibbonSelectButton} from "../blocks";
import {LabelSelectListItem, SelectList} from "../../../list/select";
import {ChartHistory} from "../../../history";
import {TooltipSettings} from "../../../echart/settings/tooltip";
import {RibbonContentSection, RibbonTab} from "../base";
import {ValueHistory} from "../../../history/value";
import {AxisPointerSection} from "./axisPointer";
import {TooltipBlock} from "../blocks/tooltip";

export class TooltipTab extends RibbonTab{

    @define
    tooltipSettings: TooltipSettings;

    @create(() => new GeneralTooltipContent())
    general: GeneralTooltipContent;

    @create(() => new AxisPointerSection())
    pointer: AxisPointerSection;

    constructor(tooltip: TooltipSettings){
        super();
        this.tooltipSettings = tooltip;
    }

    name = "Tooltip";

    get contents(){
        var res: RibbonContentSection[] = [this.general];
        res.push(this.pointer);
        return res;
    }

}

export class GeneralTooltipContent extends RibbonContentSection{

    @create(() => new GeneralFirstTriple())
    general: GeneralFirstTriple;

    get contents(){
        return [this.general];
    }

    label = "general";

}

class GeneralFirstTriple extends TripleSurface
{
    @inject
    tooltipSettings: TooltipSettings;

    showTrigger = true;

    @create(function(this: GeneralFirstTriple){
        return new ShowInput();
    })
    show: ShowInput;

    @create(() => new TriggerSelect())
    trigger: TriggerSelect;

    get top(){
        return this.show;
    }

    get middle(){
        if (this.showTrigger){
            return this.trigger;
        }
        return null;
    }

}

class ShowInput extends CheckboxInput{

    @inject
    tooltipSettings: TooltipSettings;

    @inject
    history: ChartHistory;

    label = "show";
    tooltip = new TooltipBlock({title: "Show tooltip", content: "If true, will show a tooltip"});

    changeValue(v){
        if (v !== this.value){
            this.history.executeCommand(new ValueHistory(this.tooltipSettings.r_show, v));
        }
    }

    get value(){
        return this.tooltipSettings.show;
    }

    set value(v){
        this.tooltipSettings.show = v;
    }

}

class HideInput extends CheckboxInput{

    @inject
    tooltipSettings: TooltipSettings;

    @inject
    history: ChartHistory;

    label = "hide";
    tooltip = "If true, will hide this series in the tooltip";

    changeValue(v){
        if (v !== this.value){
            this.history.executeCommand(new ValueHistory(this.tooltipSettings.r_show, v));
        }
    }

    get value(){
        return this.tooltipSettings.show;
    }

    set value(v){
        this.tooltipSettings.show = v;
    }

}

const triggerToLabel = {
    item: [{tag: "b", child: "Item"}, " trigger"],
    axis: [{tag: "b", child: "Axis"}, " trigger"]
}

class TriggerSelect extends RibbonSelectButton{

    @inject
    tooltipSettings: TooltipSettings;

    @inject
    history: ChartHistory;

    default = "item";
    triggers = ["item", "axis"];

    get label(){
        return triggerToLabel[(this.tooltipSettings.trigger || this.default)];
    }

    getContent(){
        const dropwdown = new SelectList();
        this.triggers.forEach(tr => {
            dropwdown.items.push(new LabelSelectListItem(triggerToLabel[tr]).setAction(a => {
                this.history.executeCommand(new ValueHistory(this.tooltipSettings.r_trigger, tr));
            }));
        });
        return dropwdown;
    }

    tooltip = new TooltipBlock({title: "Tooltip trigger", content: {
        tag: "html",
        child: `
When to trigger a tooltip.
<ul class="bullet">
<li><b>item</b> Show tooltip when you hover over a rendered data item, e.g. the bar of a bar chart.</li>
<li><b>axis</b> Show tooltip when you hover over the coordinate system.</li>
</ul>
        `
        }})

}

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
 
import {RowSurface, TripleSurface} from "../surface";
import {create, init, inject} from "../../../../../../../di";
import {RibbonSelectButton} from "../index";
import {IconLabelSelectListItem, ILabelAndIcon, SelectList} from "../../../../list/select";
import {
    getLabelForPixelPercent,
    getMetaForSide,
    IPixelPercentPosition, IPixelPercentValue, PixelOrPercent, PositionSide,
    sideToMeta
} from "../../../../echart/settings/position";
import {NumberInput} from "../input";
import {ChartHistory, IHistoryCommand} from "../../../../history";
import {PropertyValueHistory, ValueHistory} from "../../../../history/value";
import {variable} from "../../../../../../../reactive";
import {TooltipBlock} from "../tooltip";

export abstract class PercentPixelPositionInput extends TripleSurface {

    abstract position: IPixelPercentPosition;
    abstract sides: ILabelAndIcon[];

    @create(function(this: PercentPixelPositionInput){
        return new SideSelectButton(this)
    })
    itemSelect: SideSelectButton;

    @create(function(this: PercentPixelPositionInput){
        return new PixelPercentSelectButton(this);
    })
    pixelPercentSelect: PixelPercentSelectButton;

    @create(function(this: PercentPixelPositionInput){
        return new PositionNumberInput(this);
    })
    positionInput: PositionNumberInput;

    @init
    init(){
        this.middle = this.itemSelect;
        this.bottom = new RowSurface([this.positionInput, this.pixelPercentSelect]);
    }

    isPixelPercentDisabled(){
        return false;
    }

}

class SideSelectButton extends RibbonSelectButton{

    constructor(public input: PercentPixelPositionInput){
        super();
    }

    @inject
    history: ChartHistory;

    get icon(){
        return getMetaForSide(this.input.position.side).icon;
    }

    get label(){
        return getMetaForSide(this.input.position.side).label;
    }

    getContent(){
        const dropwdown = new SelectList();
        const self = this;
        this.input.sides.forEach(item => {
            dropwdown.items.push(new IconLabelSelectListItem(item.label, item.icon).setAction(ev => {
                this.history.executeCommand(this.processCommand(new ValueHistory({
                    get value(){
                        return self.input.position.side;
                    },

                    set value(v){
                        self.input.position.side = v;
                    }
                }, item.value), item.value));
            }));
        });
        return dropwdown;
    }

    processCommand(command: IHistoryCommand, side: PositionSide): IHistoryCommand{
        return command;
    }

}

export abstract class AbstractPixelPercentSelectButton extends RibbonSelectButton{

    constructor(){
        super();
        this.tooltip = new TooltipBlock({title: "Unit", content: {
                tag: 'html',
                child: `
<p>The unit of measurement to use when defining a position of length.</p>
Following units can be chosen from:
<ul class="bullet">
<li><b>px</b> The nr of pixels.</li>
<li><b>%</b> The percentage, relative to the width or height of the chart container.</li>
</ul>
                `
            }});
    }

    @inject
    history: ChartHistory;

    get icon(){
        return null;
    }

    get label(){
        return getLabelForPixelPercent(this.pixelOrPercent);
    }

    abstract pixelOrPercent: PixelOrPercent;
    abstract isPixelPercentDisabled();

    getContent(){
        const items: ILabelAndIcon[] = this.items;
        const self = this;
        const dropwdown = new SelectList();
        items.forEach(item => {
            dropwdown.items.push(new IconLabelSelectListItem(item.label, item.icon).setAction(ev => {
                this.history.executeCommand(new ValueHistory({
                    get value(){
                        return self.pixelOrPercent;
                    },

                    set value(v){
                        self.pixelOrPercent = v;
                    }
                }, item.value));
            }));
        });
        return dropwdown;
    }

    items = [{
        label: " px Pixel",
        value: "pixel",
        icon: ""
    },{
        label: " % Percent",
        value: "percent",
        icon: ""
    }]

    get disabled(){
        return this.isPixelPercentDisabled();
    }

}


class PixelPercentSelectButton extends AbstractPixelPercentSelectButton{


    constructor(public input: PercentPixelPositionInput){
        super();
    }

    get pixelOrPercent(){
        return this.input.position.pixelOrPercent;
    }

    set pixelOrPercent(pp){
        this.input.position.pixelOrPercent = pp;
    }

    isPixelPercentDisabled(){
        return this.input.isPixelPercentDisabled();
    }
}

class PositionNumberInput extends NumberInput{

    constructor(public input: PercentPixelPositionInput){
        super();
    }

    @inject
    history: ChartHistory;

    changeValue(v: number){
        this.history.executeCommand(new PropertyValueHistory(this.input.position, "position", v));
    }

    set value(v){
        this.input.position.position = v;
    }

    get value(){
        return this.input.position.position;
    }

    get disabled(){
        return this.input.isPixelPercentDisabled();
    }

    getClass(){
        return super.getClass()+" small-input";
    }

}

export class LeftRightPixelPercentPositionInput extends PercentPixelPositionInput{

    constructor(public position: IPixelPercentPosition){
        super();
    }

    sides: ILabelAndIcon[];

    @inject
    itemName;

    @init
    init(){
        this.top = {
            tag: "div",
            attr: {
                class: "label"
            },
            child: "X-Position"
        }
        super.init();
        const self = this;
        this.itemSelect.tooltip = new TooltipBlock({title: 'Horizontal position mode', content: {tag: "html", child: `
<p>How to calculate the position of the ${this.itemName} on the horizontal line.</p>
<p>Following modes can be selected:</p>
<ul class="bullet">
<li><b>Left: </b>Define the left offset.</li>
<li><b>Right: </b>Define the right offset.</li>
<li><b>Center: </b>The ${this.itemName} will be aligned at the center.</li>
</ul>
<p>The left offset is relative to the left side of the chart container, the right offset is relative to the right side of the chart container.</p>`}});
        this.positionInput.tooltip = new TooltipBlock({get title(){
            switch(self.position.side){
                case "left":
                    return "Left offset";
                case "right":
                    return "Right offset"
            }
            return "";
        }, get content(){
            switch(self.position.side){
                case "left":
                    return "Offset relative to the left side of the chart container";
                case "right":
                    return "Offset relative to the right side of the chart container";
            }
            return "";
        }});
    }

    isPixelPercentDisabled(){
        return this.position.side === "center";
    }

}

LeftRightPixelPercentPositionInput.prototype.sides = [
    sideToMeta.left,
    sideToMeta.center,
    sideToMeta.right
];

export class TopBottomPixelPercentPositionInput extends PercentPixelPositionInput{

    constructor(public position: IPixelPercentPosition){
        super();
    }

    sides: ILabelAndIcon[];

    @inject
    itemName;

    @init
    init(){
        this.top = {
            tag: "div",
            attr: {
                class: "label"
            },
            child: "Y-Position"
        }
        super.init();
        const self = this;
        this.itemSelect.tooltip = new TooltipBlock({title: 'Vertical position mode', content: {tag: "html", child: `
<p>How to calculate the position of the ${this.itemName} on the vertical line.</p>
<p>Following modes can be selected:</p>
<ul class="bullet">
<li><b>Top: </b>Define the top offset.</li>
<li><b>Bottom: </b>Define the bottom offset.</li>
<li><b>Center: </b>The ${this.itemName} will be aligned at the center.</li>
</ul>
<p>The top offset is relative to the top side of the chart container, the bottom offset is relative to bottom side of the chart container.</p>`}});
        this.positionInput.tooltip = new TooltipBlock({get title(){
                switch(self.position.side){
                    case "top":
                        return "Top offset";
                    case "bottom":
                        return "Bottom offset"
                }
                return "";
            }, get content(){
                switch(self.position.side){
                    case "top":
                        return "Offset relative to the top side of the chart container";
                    case "bottom":
                        return "Offset relative to the bottom side of the chart container";
                }
                return "";
            }});
    }

    isPixelPercentDisabled(){
        return this.position.side === "middle";
    }

}

TopBottomPixelPercentPositionInput.prototype.sides = [
    sideToMeta.top,
    sideToMeta.middle,
    sideToMeta.bottom
];


export abstract class PixelPercentInputRow extends RowSurface{

    @inject
    history: ChartHistory;

    @create(function(this: PixelPercentInputRow){
        return new PixelPercentValueTextInput(this.value);
    })
    textInput: PixelPercentValueTextInput;

    @create(function(this: PixelPercentInputRow){
        return new PixelPercentValueSelectButton(this.value);
    })
    selectButton: PixelPercentValueSelectButton;

    abstract value: IPixelPercentValue;
    abstract getLabel(): string;

    changePosition(pos: number){
        this.history.executeCommand(new PropertyValueHistory(this.value, "value", pos));
    }

    public r_width = variable("1.25rem");

    get width(){
        return this.r_width.value;
    }

    set width(v){
        this.r_width.value = v;
    }

    labelPos: "left" | "right" = "left";

    @init
    init(){
        const self = this;
        let res: any[] = [];
        if (this.labelPos === "left"){
            res = [{tag: "div", attr: {class: "label"}, style: {get width(){
                        return self.width;
                    }}, get child(){
                    return self.getLabel();
                }},this.textInput, this.selectButton];

        }
        else
        {
            res = [this.textInput, this.selectButton, {tag: "div", attr: {class: "label"}, style: {get width(){
                        return self.width;
                    }}, get child(){
                    return self.getLabel();
                }}];
        }
        this.children = res;
    }

}

export class HistoryPixelPercentInput extends PixelPercentInputRow{

    value: IPixelPercentValue;
    label: string;

    getLabel(){
        return this.label;
    }

}

class PixelPercentValueTextInput extends NumberInput{

    constructor(public input: IPixelPercentValue){
        super();
    }

    @inject
    history: ChartHistory;

    changeValue(v: number){
        this.history.executeCommand(new PropertyValueHistory(this.input, "value", v));
    }

    set value(v){
        this.input.value = v;
    }

    get value(){
        var v = this.input.value;
        if (v === null || v === void 0){
            return this.default;
        }
        return v;
    }

    getClass(){
        return super.getClass()+" small-input";
    }

}

class PixelPercentValueSelectButton extends AbstractPixelPercentSelectButton{


    constructor(public input: IPixelPercentValue){
        super();
    }

    get pixelOrPercent(){
        return this.input.pixelOrPercent;
    }

    set pixelOrPercent(pp){
        this.input.pixelOrPercent = pp;
    }

    isPixelPercentDisabled(){
        return false;
    }
}


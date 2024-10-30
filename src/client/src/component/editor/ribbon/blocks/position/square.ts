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
 
import {create, init, inject} from "../../../../../../../di";
import {
    getMetaForRange,
    IPixelPercentRange,
    IPixelPercentValue,
    PixelOrPercent,
    PositionSide,
    rangeSideToMeta
} from "../../../../echart/settings/position";
import {IconLabelSelectListItem, ILabelAndIcon, SelectList} from "../../../../list/select";
import {AbstractPixelPercentSelectButton} from "./position";
import {RowSurface, TripleSurface} from "../surface";
import {ChartHistory, IHistoryCommand} from "../../../../history";
import {RibbonSelectButton} from "../index";
import {PropertyValueHistory, ValueHistory} from "../../../../history/value";
import {NumberInput} from "../input";
import {TooltipBlock} from "../tooltip";


export abstract class PercentPixelRangeInput extends TripleSurface {

    abstract position: IPixelPercentRange;
    abstract sides: ILabelAndIcon[];

    @create(function(this: PercentPixelRangeInput){
        var b = new RangeSelectButton(this)
        return b;
    })
    itemSelect: RangeSelectButton;

    @create(function(this: PercentPixelRangeInput){
        return new FirstRangeInputRow(this);
    })
    startInput: FirstRangeInputRow;

    @create(function(this: PercentPixelRangeInput){
        return new SecondRangeInputRow(this);
    })
    endInput: SecondRangeInputRow


    @init
    init(){
        this.top = this.itemSelect;
        this.middle = this.startInput;
        this.bottom = this.endInput;
    }
}

abstract class RangeInputRow extends RowSurface{

    @inject
    history: ChartHistory

    @create(function(this: RangeInputRow){
        return new RangeNumberInput(this);
    })
    positionInput: RangeNumberInput;

    @create(function(this: RangeInputRow){
        return new PixelPercentSelectButton(this);
    })
    pixelPercentInput: PixelPercentSelectButton;


    abstract value: IPixelPercentValue;
    abstract getLabel(): string;
    isPixelPercentDisabled(){
        return false;
    }

    changePosition(pos: number){
        this.history.executeCommand(new PropertyValueHistory(this.value, "value", pos));
    }

    @init
    init(){
        const self = this;
        this.children = [{tag: "div", attr: {class: "label"}, style: {width: "1.25rem"}, get child(){
            return self.getLabel();
            }}, this.positionInput, this.pixelPercentInput];
    }

}

class FirstRangeInputRow extends RangeInputRow{

    constructor(public input: PercentPixelRangeInput){
        super();
    }

    get value(){
        return this.input.position.start;
    }

    set value(v){
        this.input.position.start = v;
    }

    getLabel(){
        switch(this.input.itemSelect.input.position.sides){
            case "left-right":
                return "L: ";
            case "middle-height":
                return "H: ";
            case "center-width":
                return "W: ";
            case "right-width":
                return "R: ";
            case "bottom-height":
                return "B: ";
            case "left-width":
                return "L: "
            case "top-bottom":
                return "T: ";
            case "top-height":
                return "T: ";
        }
    }

}

class SecondRangeInputRow extends RangeInputRow{

    constructor(public input: PercentPixelRangeInput){
        super();
    }

    get value(){
        return this.input.position.end;
    }

    set value(v){
        this.input.position.end = v;
    }

    isPixelPercentDisabled(){
        return this.input.position.sides === "center-width" || this.input.position.sides === "middle-height";
    }

    getLabel(){
        switch(this.input.itemSelect.input.position.sides){
            case "left-right":
                return "R: ";
            case "middle-height":
                return "H: ";
            case "center-width":
                return "W: ";
            case "right-width":
                return "W: ";
            case "bottom-height":
                return "H: ";
            case "left-width":
                return "W: "
            case "top-bottom":
                return "B: ";
            case "top-height":
                return "H: ";
        }
    }

}

class RangeNumberInput extends NumberInput{

    constructor(public input: RangeInputRow){
        super();
    }

    @inject
    history: ChartHistory;

    changeValue(v: number){
        this.input.changePosition(v);
    }

    set value(v){
        this.input.value.value = v;
    }

    get value(){
        return this.input.value.value;
    }

    get disabled(){
        return this.input.isPixelPercentDisabled();
    }

    getClass(){
        return super.getClass()+" small-input";
    }

}

export class PixelPercentSelectButton extends AbstractPixelPercentSelectButton{


    constructor(public input: RangeInputRow){
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
        }})
    }

    get pixelOrPercent(){
        return this.input.value.pixelOrPercent;
    }

    set pixelOrPercent(pp){
        this.input.value.pixelOrPercent = pp;
    }

    isPixelPercentDisabled(){
        return this.input.isPixelPercentDisabled();
    }
}

class RangeSelectButton extends RibbonSelectButton{

    constructor(public input: PercentPixelRangeInput){
        super();
    }

    @inject
    history: ChartHistory;

    get icon(){
        return getMetaForRange(this.input.position.sides).icon;
    }

    get label(){
        return getMetaForRange(this.input.position.sides).label;
    }

    getContent(){
        const dropwdown = new SelectList();
        const self = this;
        this.input.sides.forEach(item => {
            dropwdown.items.push(new IconLabelSelectListItem(item.label, item.icon).setAction(ev => {
                this.history.executeCommand(this.processCommand(new ValueHistory({
                    get value(){
                        return self.input.position.sides;
                    },

                    set value(v){
                        self.input.position.sides = v;
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

export class LeftRightPixelPercentRangeInput extends PercentPixelRangeInput{

    constructor(public position: IPixelPercentRange){
        super();
    }

    sides: ILabelAndIcon[];

    @inject
    itemName

    @init
    init(){
        super.init();
        this.itemSelect.tooltip = new TooltipBlock({title: 'Horizontal position mode', content: {tag: 'html', child: `
<p>How to calculate the position of the ${this.itemName} on the horizontal line.</p>
<p>Following modes can be selected:</p>
<ul class="bullet">
<li><b>Left-Right: </b>Define the left and right offset.</li>
<li><b>Left-Width: </b>Define the left offset and the width of the ${this.itemName}.</li>
<li><b>Right-Width: </b>Define the right offset and the width of the ${this.itemName}.</li>
<li><b>Center-Width: </b>Define the width of the ${this.itemName}. The ${this.itemName} will be aligned at the center.</li>
</ul>
<p>The left offset is relative to the left side of the chart container, the right offset is relative to the right side of the chart container.</p>
        `}});

        const self = this;
        this.startInput.positionInput.tooltip = new TooltipBlock({get title(){
                switch(self.position.sides){
                    case "left-right":
                        return 'Left offset';
                    case "right-width":
                        return 'Right offset';
                    case "left-width":
                        return 'Left offset'
                    case "center-width":
                        return 'Width'
                }}, content: {tag: 'html', get child(){
                    switch(self.position.sides){
                        case "left-right":
                        case "left-width":
                            return 'Offset relative to the left side of the chart container';
                        case "right-width":
                            return 'Offset relative to the right side of the chart container';
                        case "center-width":
                            return `The width of the ${self.itemName}`
                    }
                }}});
        this.endInput.positionInput.tooltip = new TooltipBlock({get title(){
                switch(self.position.sides){
                    case "left-right":
                        return 'Right offset';
                    case "right-width":
                    case "center-width":
                    case "left-width":
                        return 'Width'
                }}, content: {tag: 'html', get child(){
                    switch(self.position.sides){
                        case "left-right":
                            return 'Offset relative to the right side of the chart container';
                        case "right-width":
                        case "center-width":
                        case "left-width":
                            return `The width of the ${self.itemName}`
                    }
                }}});
    }

}

LeftRightPixelPercentRangeInput.prototype.sides = [
    rangeSideToMeta['left-right'],
    rangeSideToMeta['left-width'],
    rangeSideToMeta['right-width'],
    rangeSideToMeta['center-width']
];

export class TopBottomPixelPercentRangeInput extends PercentPixelRangeInput{

    constructor(public position: IPixelPercentRange){
        super();
    }

    sides: ILabelAndIcon[];

    @inject
    itemName

    @init
    init(){
        super.init();
        this.itemSelect.tooltip = new TooltipBlock({title: 'Vertical position mode', content: {tag: 'html', child: `
<p>How to calculate the position of the coordinate system on the verical line.</p>
<p>Following modes can be selected:</p>
<ul class="bullet">
<li><b>Top-Bottom: </b>Define the top and bottom offset.</li>
<li><b>Top-Height: </b>Define the top offset and the height of the ${this.itemName}.</li>
<li><b>Bottom-Height: </b>Define the bottom offset and the height of the ${this.itemName}.</li>
<li><b>Middle-Height: </b>Define the height of the ${this.itemName}. The ${this.itemName} will be aligned at the center.</li>
</ul>
<p>The top offset is relative to the top side of the chart container, the bottom offset is relative to bottom side of the chart container.</p>
        `}});
        const self = this;
        this.startInput.positionInput.tooltip = new TooltipBlock({get title(){
            switch(self.position.sides){
                case "top-bottom":
                    return 'Top offset';
                case "bottom-height":
                    return 'Bottom offset';
                case "top-height":
                    return 'Top offset'
                case "middle-height":
                    return 'Height'
            }}, content: {tag: 'html', get child(){
    switch(self.position.sides){
        case "top-bottom":
        case "top-height":
            return 'Offset relative to the top side of the chart container';
        case "bottom-height":
            return 'Offset relative to the bottom side of the chart container';
        case "middle-height":
            return `The height of the ${self.itemName}`
    }
        }}});
        this.endInput.positionInput.tooltip = new TooltipBlock({get title(){
            switch(self.position.sides){
                case "top-bottom":
                    return 'Bottom offset';
                case "bottom-height":
                case "middle-height":
                case "top-height":
                    return 'Height'
            }}, content: {tag: 'html', get child(){
                switch(self.position.sides){
                    case "top-bottom":
                        return 'Offset relative to the bottom side of the chart container';
                    case "bottom-height":
                    case "middle-height":
                    case "top-height":
                        return `The height of the ${self.itemName}`
                }
            }}});


    }

}

TopBottomPixelPercentRangeInput.prototype.sides = [
    rangeSideToMeta['top-bottom'],
    rangeSideToMeta['top-height'],
    rangeSideToMeta['bottom-height'],
    rangeSideToMeta['middle-height']
];


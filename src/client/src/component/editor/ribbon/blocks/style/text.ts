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
 
import {getIconShape, IconSet} from "../../../../icon";
import {ColorInputButton} from "../input/color";
import {IReactiveVariable} from "../../../../../../../reactive/src/variable";
import {inject} from "../../../../../../../di";
import {ChartHistory} from "../../../../history";
import {ValueHistory} from "../../../../history/value";
import {LabelSelectListItem, SelectList} from "../../../../list/select";
import {TextSelectInput} from "../input/text_select";
import {NumberSelectInput} from "../input/number_select";
import {HistoryRibbonSelectList, HistorySelectableButton} from "../index";
import {TooltipBlock} from "../tooltip";

export class TextColorButton extends ColorInputButton {

    constructor(public r_color: IReactiveVariable<string>){
        super();
    }

    get tooltip(){
        return new TooltipBlock({title: this.colorInputLabel, content:{tag: "html",
                child: `
<p>${this.colorInputLabel}</p>
You can specify the values in any valid css format, e.g:
 <ul class="bullet">
 <li>'rgb(34,100,200)'</li>
 <li>'red'</li>
 <li>'hsla(120, 20, 40)'</li>
</ul>`}});
    }

    colorInputLabel = "Text color"


    icon_shape = IconSet.format_color_text

}

export class BackgroundColorButton extends ColorInputButton{

    constructor(public r_color: IReactiveVariable<string>){
        super();
    }

    labelPrefix = "Color of the background."

    get tooltip(){
        return new TooltipBlock({title: this.colorInputLabel, content:{tag: "html",
            child: `
<p>${this.labelPrefix}</p>
You can specify the values in any valid css format, e.g:
 <ul class="bullet">
 <li>'rgb(34,100,200)'</li>
 <li>'red'</li>
 <li>'hsla(120, 20, 40)'</li>
</ul>`}});
    }

    colorInputLabel = "Background color"

}

export class FontFamily extends TextSelectInput{

    constructor(public r_fontFamily: IReactiveVariable<string>){
        super();
    }

    @inject
    history: ChartHistory;

    placeholder = "Family";

    default = "";

    get value(){
        return this.r_fontFamily.value || this.default;
    }

    set value(v){
        if (v === this.default){
            v = null;
        }
        if (this.r_fontFamily.value === v){
            this.r_fontFamily.$r.changed();
            return;
        }
        this.history.executeCommand(new ValueHistory(this.r_fontFamily, v));
    }

    fonts = ["", "Arial", '"Courier New"', "Helvetica", "monospace", "sans-serif", "serif", '"Times New Roman"',"Verdana"];

    getContent(){
        const dropwdown = new SelectList();
        const fonts = this.fonts;
        fonts.forEach(f => {
            dropwdown.items.push(new LabelSelectListItem(f).setAction(ev => this.value = f));
        });
        return dropwdown;
    }

    tooltip = new TooltipBlock({title: "Font family", content: "If not set, will be taken from the chart theme."});

}

export class FontSize extends NumberSelectInput{

    constructor(public r_fontSize: IReactiveVariable<number>){
        super();
    }

    default = ""

    placeholder = "Size"

    @inject
    history: ChartHistory;

    validateInput(inp){
        const res = super.validateInput(inp);
        return res;
    }

    getClass(){
        return super.getClass()+" small-input";
    }

    get value(){
        return (this.r_fontSize.value || this.default)+"";
    }

    set value(v: any){
        if (v === ""){
            v = null;
        }
        if (typeof v === "string" && v !== ""){
            v = parseInt(v);
        }
        if (v === this.r_fontSize.value){
            this.r_fontSize.$r.changed();
            return;
        }
        this.history.executeCommand(new ValueHistory(this.r_fontSize, v));
    }

    sizes = ["", "8", "9", "10", "11", "12", "14", "16", "18", "20", "22", "24", "26", "28", "36", "48", "72"];

    getContent(){
        const dropwdown = new SelectList();
        const sizes = this.sizes;
        sizes.forEach(f => {
            dropwdown.items.push(new LabelSelectListItem(f).setAction(ev => this.value = f));
        });
        return dropwdown;
    }

    tooltip = new TooltipBlock({title: "Font size", content: "The size of the text. If not set, will be taken from the chart theme."})

}

export class BoldSelect extends HistoryRibbonSelectList{

    items = [{label: "default", value: null, icon: getIconShape(IconSet.format_bold)},
        {label: "normal", value: "normal", icon: getIconShape(IconSet.format_bold)},
        {label: "bold", value: "bold", icon: getIconShape(IconSet.format_bold, {selected: true})}]

    default = null;

    tooltip = new TooltipBlock({title: "Font weight", content: "The boldness of the text. If default, will be determined by the chart theme."});

}

export class ItalicSelect extends HistoryRibbonSelectList{

    items = [{label: "default", value: null, icon: getIconShape(IconSet.format_italic)},
        {label: "normal", value: "normal", icon: getIconShape(IconSet.format_italic)},
        {label: "italic", value: "italic", icon: getIconShape(IconSet.format_italic, {selected: true})}]

    default = null;

    tooltip = new TooltipBlock({title: "Font style", content: " If default, will be determined by the chart theme."});

}

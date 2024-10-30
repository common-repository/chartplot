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
 
import {transaction, variable} from "../../../../../../reactive";
import stream from "../../../../../../reactive/src/event";
import {getIconShape, IconSet} from "../../../icon";
import {create, factory, init, inject} from "../../../../../../di";
import {SelectPopup} from "./input/select";
import {TooltipManager} from "./tooltip";
import {IHtmlNodeShape} from "../../../../../../html/src/html/node";
import {ChartHistory} from "../../../history";
import {IconLabelSelectListItem, LabelSelectListItem, SelectList} from "../../../list/select";
import {IVariable} from "../../../../../../reactive/src/variable";
import {ValueHistory} from "../../../history/value";

const Popper = require("popper.js");

export class RibbonSep{
    tag = "div";
    attr = {
        class: "separator"
    }
}

export class SectionLabel{

    constructor(public label: string){

    }

    tag = "div";
    attr = {
        class: "section-label"
    }

    get child(){
        return this.label;
    }
}

export class RibbonSection{

    label: string;
    tag = "div";
    attr = {
        class: "section"
    }

    get child(){
        return [{
            tag: "div",
            attr: {
                class: "content"
            }
        }, new SectionLabel(this.label)]
    }

}

export class AbstractRibbonButton{

    public r_disabled = variable(false);
    attr: any;
    event: any = {};
    onClick = stream<Event>();
    tooltip: any;
    node: IHtmlNodeShape;
    classPrefix = "";
    stickyTooltip = false;

    @create(function(this: AbstractRibbonButton){return new TooltipManager(this)})
    tooltipManager: TooltipManager

    @init
    init(){
        this.tooltipManager.initEvents(this.event);
    }

    get disabled(){
        return this.r_disabled.value;
    }

    set disabled(v){
        this.r_disabled.value = v;
    }

    public r_selected = variable(null);

    get selected(){
        return this.r_selected.value;
    }

    set selected(v){
        this.r_selected.value = v;
    }

    getClass(){
        var res = this.classPrefix+"chartplot-button";
        if (this.selected){
            res += " selected";
        }
        if (this.disabled){
            res += " disabled";
        }
        return res;
    }

    constructor(){
        const self = this;
        this.attr = {
            get class(){
                return self.getClass();
            }
        }
        this.event = {
            click: (ev) => {
                if (!this.disabled){
                    this.onClick.fire(ev);
                }
            }
        }
    }

}

export class BigRibbonButton extends AbstractRibbonButton{

    tag = "div";
    attr;

    icon: any;
    label: any;

    get child(){
        const self = this;
        return [this.icon, {
            tag: "div",
            attr: {
                class: "label"
            },
            get child(){
                if (Array.isArray(self.label)){
                    return [{
                        tag: "div",
                        attr: {
                            class: "top"
                        },
                        child: self.label[0]
                    }, {
                        tag: "div",
                        attr: {
                            class: "bottom"
                        },
                        child: self.label[1]
                    }]
                }
                return self.label;
            }

        }];
    }

    bigClassName = "big-button";

    getClass(){
        return this.bigClassName+" "+this.classPrefix+"button-hover-highlight "+super.getClass();
    }

}

export class MiddleRibbonButton extends BigRibbonButton {

    bigClassName = "middle-button";

}

export class NormalRibbonButton extends AbstractRibbonButton{

    tag = "div";
    attr;

    icon: any;
    label: any;

    get child(){
        const self = this;
        const res = [this.icon];
        if (self.label){
            res.push({
                tag: "div",
                attr: {
                    class: "label"
                },
                get child(){
                    return self.label;
                }

            });
        }
        return res;
    }

    getClass(){
        return "normal-button "+this.classPrefix+"button-hover-highlight "+super.getClass();
    }

}

export class SelectableButton extends NormalRibbonButton{

    public r_value = variable(false);

    default = false;

    get value(){
        return this.getValue();
    }

    getValue(){
        var v = this.r_value.value;
        if (v === null){
            return this.default;
        }
        return v;
    }

    set value(v){
        this.setValue(v);
    }

    setValue(v){
        this.r_value.value = v;
    }

    changeValue(){
        var v = this.value;
        this.value = !v;
    }

    get selected(){
        return this.value;
    }

    @init
    init(){
        this.onClick.observe(c => {
            this.changeValue();
        });
    }

}

export class HistorySelectableButton extends SelectableButton{

    @inject
    history: ChartHistory;

    setValue(v){
        if (v !== this.r_value.value){
            this.history.executeCommand(new ValueHistory(this.r_value, v));
        }
    }

}

export function buttonRadioGroup(buttons: AbstractRibbonButton[], selected = 0){
    const b = buttons[selected];
    if (b){
        b.selected = true;
    }
    buttons.forEach((b, indx) => {
        b.onClick.observe(cl => {
            transaction(() => {
                if (indx !== selected){
                    let b = buttons[selected];
                    if (b){
                        b.selected = false;
                    }
                    b = buttons[indx];
                    if (b){
                        b.selected = true;
                    }
                    selected = indx;
                }
            });
        });
    })
}

export class RibbonSelectButton extends AbstractRibbonButton{

    tag = "div";
    icon: any;
    label: any;
    node: any;
    showDropDownIcon = true;
    @create(() => {
        var res = new SelectPopup();
        return res;
    })
    selectPopup: SelectPopup;

    get child(){
        const self = this;
        const res = [this.icon || ""];
        if (self.label){
            res.push({
                tag: "div",
                attr: {class: "label"},
                get child(){
                    return self.label;
                }
            });
        }
        if (this.showDropDownIcon){
            res.push(getIconShape(IconSet.arrow_drop_down_small_width));
        }
        return res;
    }

    getClass(){
        return "select-button button-hover-highlight "+super.getClass();
    }

    getContent(): any{
        return "";
    }

    @init
    init(){
        super.init();
        this.onClick.observe(c => {
            if (!this.selectPopup.clicked(this.node.element, (popup) => this.getContent())){
                return;
            }
            this.selected = true;
            this.selectPopup.popup.onClosed.observe(() => {
                this.selected = false;
            });
        });
    }

}

export class BigRibbonSelectButton extends RibbonSelectButton{

    getClass(){
        return "select-big-button " + super.getClass();
    }

}

export interface ILabelAndIcon{

    icon?: any;
    label?: any;
    value: any;

}

export class HistoryRibbonSelectList extends RibbonSelectButton{

    r_value: IVariable<any>;

    items: ILabelAndIcon[];

    @inject
    history: ChartHistory;

    changeValue(v){
        if (v !== this.r_value.value){
            this.history.executeCommand(new ValueHistory(this.r_value, v));
        }
    }

    default: any;

    findLabelIcon(val){
        for (var i=0; i < this.items.length; i++){
            var it = this.items[i];
            if (it.value === val){
                return it;
            }
        }
        return null;
    }

    get label(){
        var val = this.r_value.value;
        if (val === null){
            val = this.default;
        }
        var it = this.findLabelIcon(val);
        if (it){
            return it.label || it.value;
        }
        return "";
    }

    get icon(){
        var val = this.r_value.value;
        if (val === null){
            val = this.default;
        }
        var it = this.findLabelIcon(val);
        if (it){
            return it.icon;
        }
        return null;
    }

    getContent(){
        var l = new SelectList();
        this.items.forEach(it => {
            if (it.icon){
                l.items.push(new IconLabelSelectListItem(it.label || it.value, it.icon).setAction(a => {
                    this.changeValue(it.value);
                }));
            }
            else
            {
                l.items.push(new LabelSelectListItem(it.label || it.value).setAction(a => {
                    this.changeValue(it.value);
                }));
            }
        });
        return l;
    }


}

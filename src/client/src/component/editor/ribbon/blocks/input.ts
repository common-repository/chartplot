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
 
import {AbstractInput} from "./base";
import {getIconShape, IconSet} from "../../../icon";
import {IReactiveVariable} from "../../../../../../reactive/src/variable";
import {ValueHistory} from "../../../history/value";
import {inject} from "../../../../../../di";
import {ChartHistory} from "../../../history";

export class AbstractTextInput<E> extends AbstractInput<E>{

    inputType: string;

    setInputValue(val, node){
        node.value = val;
    }

    getInputValue(node){
        return node.value;
    }

}

AbstractTextInput.prototype.inputType = "text";

export class TextInput extends AbstractTextInput<string> {

}

export class TextAreaInput extends AbstractTextInput<string>{

    constructor(){
        super();
        delete this.inputEvent.keypress;
        delete this.inputEvent.keyup;
    }

    inputType: string;

    createInputShape(){
        var cis = super.createInputShape();
        cis.tag = "textarea";
        cis.attr = {};
        return cis;
    }

    large = false;

    getClass(){
        var s = super.getClass();
        s = s +" ribbon-input-textarea";
        if (this.large){
            s += " large";
        }
        return s;
    }

}

export class HistoryTextAreaInput extends TextAreaInput{

    @inject
    history: ChartHistory;

    default = "";

    changeValue(v){
        if (this.value !== v){
            this.history.executeCommand(new ValueHistory(this.r_value, v));
        }
    }

    get value(){
        var v = this.r_value.value;
        if (v === null){
            return this.default;
        }
        return v;
    }

    set value(v){
        this.value = v;
    }

}

export class HistoryTextInput extends TextInput{

    @inject
    history: ChartHistory;

    default = "";

    changeValue(v){
        if (this.value !== v){
            this.history.executeCommand(new ValueHistory(this.r_value, v));
        }
    }

    get value(){
        var v = this.r_value.value;
        if (v === null){
            return this.default;
        }
        return v;
    }

    set value(v){
        this.value = v;
    }

}

export class NumberInput extends AbstractTextInput<number>{

    addButton: any;
    removeButton: any;
    step = 1;
    max = Number.MAX_VALUE;
    min = -Number.MAX_VALUE;

    isSmall = false;

    constructor(){
        super();
        const self = this;
        this.addButton = {
            tag: "div",
            attr: {
                get class(){
                    if (self.disabled){

                        return "number-button disabled" ;
                    }
                    return "number-button";
                }
            },
            child: getIconShape(IconSet.arrow_drop_up_full),
            event: {
                click: () => {
                    if (self.disabled){
                        return;
                    }
                    let val: any = (this.value || 0)+this.step;
                    val = this.validateNumber(val);
                    this.changeValue(val);
                }
            }
        }
        this.removeButton = {
            tag: "div",
            attr: {
                get class(){
                    if (self.disabled){

                        return "number-button disabled" ;
                    }
                    return "number-button";
                }
            },
            child: getIconShape(IconSet.arrow_drop_down_full),
            event: {
                click: () => {
                    if (self.disabled){
                        return;
                    }
                    let val: any = (this.value || 0) - this.step;
                    val = this.validateNumber(val);
                    this.changeValue(val);
                }
            }
        }
    }

    getClass(){
        var res = super.getClass()+" number-input";
        if (this.isSmall){
            res += " small-input";
        }
        return res;
    }

    validateInput(inp: string){
        if (inp === ""){
            return null;
        }
        if (!isNaN(<any>inp)){
            return this.validateNumber(parseFloat(inp));
        }
        return this.value;
    }

    validateNumber(n: number){
        return Math.max(this.min, Math.min(this.max, n));
    }

    getInputChildPart(){
        var res = super.getInputChildPart();
        res.push({
            tag: "div",
            attr: {
                class: "add-remove-number"
            },
            child: [this.addButton, this.removeButton]
        })
        return res;
    }

}

export class HistoryNumberInput extends NumberInput{

    @inject
    history: ChartHistory;

    default = 0;

    changeValue(v){
        if (this.value !== v){
            this.history.executeCommand(new ValueHistory(this.r_value, v));
        }
    }

    get value(){
        var v = this.r_value.value;
        if (v === null){
            return this.default;
        }
        return v;
    }

    set value(v){
        this.value = v;
    }

}

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
 
import {procedure, variable} from "../../../../../../reactive";
import {IHtmlNodeShape} from "../../../../../../html/src/html/node";
import {IProcedure} from "../../../../../../reactive/src/procedure";
import {create, init, inject} from "../../../../../../di";
import {SinglePopupSystem} from "../../../popup";
import {TooltipManager} from "./tooltip";

export abstract class AbstractInput<E>{

    tag = "div";

    attr: any;
    inputEvent: any;
    inputShape: any;
    node: IHtmlNodeShape;
    label: any;
    inputType: string;
    tooltip: any;
    event: any = {};
    default: any = null;
    placeholder: any;
    stickyTooltip = false;

    @create(function(){return new TooltipManager(this)})
    tooltipManager: TooltipManager

    constructor(){
        const self = this;
        this.attr = {
            get class(){
                return self.getClass();
            }
        }
        this.inputEvent = {
            change: (ev) => {
                this.applyNodeValue(ev.target);
            },
            keydown: (ev) => {
                if (ev.key === "Enter"){
                    this.applyNodeValue(ev.target);
                }
            },
            keyup: (e) => {
                if (e.key === "Enter"){
                    e.preventDefault();
                    return false;
                }
            },
            keypress: (e) => {
                if (e.key === "Enter"){
                    e.preventDefault();
                    return false;
                }
            }
        }
        this.inputShape = this.createInputShape();
    }

    createInputShape(){
        const self = this;
        return <any>{
            tag: "input",
            attr: {
                type: this.inputType,
                get placeholder(){
                    return self.placeholder;
                }
            },
            prop: {
                get disabled(){
                    return self.disabled;
                }
            },
            get event(){
                return self.inputEvent;
            }
        };
    }

    immediateChange(){
       this.inputEvent.keyup = (ev) => {
           this.applyNodeValue(ev.target);
       }
    }

    @init
    init(){
        this.tooltipManager.initEvents(this.event);
    }

    protected applyNodeValue(target: HTMLInputElement){
        var val = this.getInputValue(target);
        try{
            val = this.validateInput(val);
            this.error = null;
        }catch(err){
            this.error = err.message;
        }
        this.changeValue(val);
        this.setInputValue(val, target);
    }

    private _proc: IProcedure;

    onAttached(){
        this.setInputValue(this.value, (<HTMLInputElement>this.inputShape.node.element));
        this._proc = procedure(p => {
            const v = this.value;
            if (this.node){
                this.setInputValue(v, (<HTMLInputElement>this.inputShape.node.element));
            }
        });
    }

    protected abstract getInputValue(node: HTMLInputElement): E;
    protected abstract setInputValue(v: E, node: HTMLInputElement);

    changeValue(v: E){
        this.value = v;
    }

    onDetached(){
        this._proc.cancel();
    }

    public r_disabled = variable(false);

    get disabled(){
        return this.r_disabled.value;
    }

    set disabled(v){
        this.r_disabled.value = v;
    }

    public r_value = variable<E>(null);

    get value(){
        if (this.r_value.value === null || this.r_value.value === void 0){
            return this.default;
        }
        return this.r_value.value;
    }

    set value(v){
        this.r_value.value = v;
    }

    public r_error = variable(null);

    get error(){
        return this.r_error.value;
    }

    set error(v){
        this.r_error.value = v;
    }

    getClass(){
        var res = "ribbon-input";
        if (this.disabled){
            res += " disabled";
        }
        if (this.error){
            res += " input-error";
        }
        return res;
    }

    validateInput(input: any): E{
        return input;
    }

    getInputChildPart(){
        const self = this;
        return <any[]>[this.inputShape];
    }

    getChild(){
        const self = this;
        let chartInput = this.getInputChildPart();
        const res: any[] = [{
            tag: "div",
            attr: {
                class :"input-part"
            },
            child: chartInput,
            style: {
                position: "relative"
            }
        }]
        if (this.label){
            res.push({
                tag: "div",
                attr: {class: "label"},
                child: this.label
            });
        }
        return res;
    }

    get child(){
        return this.getChild();
    }
}

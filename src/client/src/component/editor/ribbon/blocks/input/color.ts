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
 
import {RibbonSelectButton} from "../index";
import {getIconShape, IconSet} from "../../../../icon";
import {colorChooser, IColorChooser} from "../../../../input/color";
import {colourNameToHex, default as color, hsl} from "../../../../../color";
import {procedure, variable} from "../../../../../../../reactive";
import {init, inject} from "../../../../../../../di";
import stream from "../../../../../../../reactive/src/event";
import {ChartHistory} from "../../../../history";
import {ValueHistory} from "../../../../history/value";
import {IVariable} from "../../../../../../../reactive/src/variable";

export abstract class ColorInputButton extends RibbonSelectButton {

    icon_shape = IconSet.format_color_fill;

    protected colButton: ColorButton;
    protected colChooser: IColorChooser;
    colorInputLabel = "Color"

    get icon(){
        const self = this;
        const res: any = getIconShape(this.icon_shape);
        res.style = {
            get color(){
                return self.color && self.color.toString() || "";
            }
        }
        return res;
    }

    abstract r_color: IVariable<string>;

    get color(){
        return this.r_color.value;
    }

    set color(v){
        this.r_color.value = v;
    }

    private lastColor: string;

    @inject
    history: ChartHistory;

    @init
    init(){
        super.init();
        this.selectPopup.closeOn = "down-outside";
        const self = this;
        const colButton = new ColorButton({
            get value(){
                return self.color;
            },
            set value(v){
                self.color = v;
            }
        });
        this.colButton = colButton;
        colButton.onChanged.observe(c => {
            if (c){
                this.colChooser.color.value = color(c);
            }
        });
    }

    applyColor(){
        const self = this;
        const col = self.color;
        self.color = self.lastColor;
        if (col !== self.color){
            self.history.executeCommand(new ValueHistory(self.r_color, col));
        }
    }

    getOkLabel(){
        return "Ok";
    }

    getContent(){
        const self = this;
        this.lastColor = this.color;
        this.selectPopup.popup.onClosed.observe(c => {
            self.applyColor();
        });
        const chooser = colorChooser({
            color: self.color ? color(self.color) : null
        });
        this.colChooser = chooser;
        this.colChooser.color.value = this.color ? color(this.color) : color(hsl(100, 50, 50));
        var first = true;
        procedure(() => {
            const col = chooser.color.value;
            if (!first){
                self.color = col.toString();
                this.colButton.error = null;
            }
            first = false;
        });
        return {
                tag: "div",
                attr: {
                    class: "general-form"
                },
                style: {
                    width: "300px"
                },
                get child(){
                    return {
                        tag: "form",
                        get child(){
                            const res: any[] = [{
                                tag: "form-row",
                                child: {
                                    tag: "div",
                                    attr: {class: "form-group"},
                                    child: [
                                        {tag:"label", child: self.colorInputLabel},
                                        self.colButton
                                       // {tag: "div", attr:{class: "form-text text-muted"}, child: "Valid colors are 'rgb(234, 100, 100)', 'red' or 'hsla(121, 60%, 26%, 0.4)'. Leave empty for auto color."}
                                    ]
                                },
                                attr: {
                                    class: "mb-2"
                                }
                            },{tag: "hr"},{
                                tag: "form-row",
                                child: self.colChooser
                            },{tag: "hr"},{
                                tag: "div",
                                attr: {
                                    class: "btn btn-success btn-sm mr-2"
                                },
                                child: self.getOkLabel(),
                                event: {
                                    click: () => {
                                        self.selectPopup.popup.close();
                                    }
                                }
                            },{
                                tag: "div",
                                attr: {
                                    class: "btn btn-danger btn-sm"
                                },
                                child: "Cancel",
                                event: {
                                    click: () => {
                                        self.color = self.lastColor;
                                        self.selectPopup.popup.close();
                                    }
                                }
                            }];
                            return res;
                        }
                    }
                }
        }
    }
}

export interface IColorSettings{
    value: string;
}

class ColorButton{

    public tag: "div" = "div";
    public r_isChoosing = variable(false);
    public attr: any;
    public r_error = variable(false);
    public inputGroup: any;
    public colorInput: any;
    public colorAppend: any;
    onChanged = stream<string>();

    get error(){
        return this.r_error.value;
    }

    set error(v){
        this.r_error.value = v;
    }

    private change(v){
        const self = this;
        if (!v){
            self.settings.value = "";
            self.error = null;
            this.onChanged.fire("");
            return;
        }
        try{
            var col = color(v);
            if (!colourNameToHex(v)){
                self.settings.value = col.toString();
            }else {
                self.settings.value = v;
            }
            this.onChanged.fire(self.settings.value);
            self.error = false;
        }catch(err){
            self.error = true;
        }
    }

    constructor(public settings: IColorSettings){
        this.attr = {
            class: "color-chooser"
        }
        var self = this;

        this.colorInput = {
            tag: "input",
            type: "text",
            attr: {
                get class(){
                    var left = "form-control form-control-sm";
                    if (self.error){
                        return left+" is-invalid";
                    }
                    else {
                        return left;
                    }
                }
            },
            prop: {
                get value(){
                    return self.settings.value;
                }
            },
            event: {
                change: (ev) => {
                    var v = ev.target.value;
                    this.change(v);
                },
                keydown: (ev) => {
                    if (ev.key === "Enter"){
                        this.change(ev.target.value);
                    }
                }
            }
        }

        this.colorAppend =  {
            tag: "div",
            attr: {
                class: "input-group-append"
            },
            get child(){
                if (self.settings.value){
                    return {
                        tag: "button",
                        attr: {
                            class: "btn btn-outline-danger btn-sm",
                            type: "button"
                        },
                        child: getIconShape(IconSet.bin),
                        event: {
                            click: () => {
                                self.settings.value = null;
                                self.error = null;
                            }
                        }
                    }
                }
                return [];
            }
        }

        this.inputGroup = {
            tag: "div",
            attr: {
                class: "input-group"
            },
            get child(){
                var res = [self.colorInput];
                if (self.settings.value){
                    res.push(self.colorAppend);
                }
                return res;
            }
        }

    }

    get child(){
        return [this.inputGroup];
    }

}

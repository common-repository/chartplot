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
 
import {createSteppingPointerPositionProvider, getPointerPosition, SlideButton} from "./slider";
import color, {Hsla, IColor} from "../../color";
import {IPointInterval} from "../../geometry/interval";
import {transaction, variable} from "../../../../reactive";
import {IHtmlConfig, IHtmlShape} from "../../../../html/src/html/node";
import {DocumentMovement} from "../../html/interaction/document";
import {IHtmlRenderContext} from "../../../../html/src/html/node/context";
import {IVariable} from "../../../../reactive/src/variable";

class ColorSliderBackground{

    public tag = "canvas";
    public child: any;

    public r_width = variable(null);
    public r_height = variable(null);
    public node: IHtmlShape;
    public prop: any;
    public attr: any;

    get height(){
        return this.r_height.value;
    }

    set height(v){
        this.r_height.value = v;
    }

    get width(){
        return this.r_width.value;
    }

    set width(v){
        this.r_width.value = v;
    }

    constructor(public color: variable.IVariable<IColor>){
        var self = this;
        this.prop = {
            get width(){
                return self.width;
            },

            get height(){
                return self.height;
            }
        }
        this.attr = {
            get width(){
                return self.width+"px";
            },

            get height(){
                return self.height+"px";
            }
        }
    }

    public render(ctx: IHtmlRenderContext){
        this.node.renderAll();
        var c = (<HTMLCanvasElement>this.node.element).getContext("2d");
        c.clearRect(0, 0, c.canvas.width, c.canvas.height);
        var grd = c.createLinearGradient(0, 0, c.canvas.width, 0);
        for (var i=0; i < 100; i++){
            var col = this.getColorAt(i);
            grd.addColorStop(i/100, col.toString());
        }
        c.fillStyle = grd;
        c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    }

    public changeValue(newVal: number){

    }

    public getValue(): number{
        return null;
    }

    public getColorAt(val: number): IColor{
        return null;
    }

}

class Slider{

    public tag = "div";
    public style: any;
    public event: any;
    public slideButton = new SlideButton();
    public newPosCalc: (source: IPointInterval, target: IPointInterval, value: number) => number;
    public node: IHtmlShape;
    public r_version = variable(0);

    get version(){
        return this.r_version.value;
    }

    set version(v){
        this.r_version.value = v;
    }

    refresh(){
        this.version++;
    }

    constructor(public background: ColorSliderBackground, step: number, public from: number, public to: number){
        this.newPosCalc = createSteppingPointerPositionProvider(step);
        this.style = {
            height: "1.5rem",
            padding: "0",
            border: "none",
            margin: "0",
            position: "relative"
        }
        this.event = {
            mousedown: (ev: MouseEvent) => {
                var cr = (<HTMLElement>this.node.element).getBoundingClientRect();
                var x = ev.clientX - cr.left;
                var y = ev.clientY - cr.top;
                this.newPos(x, y);
                var self = this;
                ev.preventDefault();
                new DocumentMovement({
                    move(ev){
                        x = ev.clientX - cr.left;
                        y = ev.clientY - cr.top;
                        self.newPos(x, y);
                    }
                });
            }
        }
        var self = this;
        this.subChild = {
            tag: "div",
            style: {
                position: "absolute",
                left: "0px",
                top: "0px",
                get width(){
                    return self.background.width+"px"
                },
                get height(){
                    return self.background.height+"px"
                }
            },
            get child(){
                return [self.background, self.slideButton]
            }
        }
    }

    public subChild: IHtmlConfig;

    public onAttached(){

    }

    render(){
        this.version;
        this.node.renderStyles()
        this.node.renderEvents()
        this.node.renderAttributes()
        this.node.renderStyles()
        this.node.renderChildren()
        var cr = (<HTMLElement>this.node.element).getBoundingClientRect();
        this.background.width = cr.width
        this.background.height = cr.height
        this.slideButton.height = cr.height;
        this.newColor()
    }

    public onDetached(){

    }

    get child(){
        return this.subChild;
    }

    public newPos(x: number, y: number){

    }

    public newColor(){
        var x = getPointerPosition({start: this.from, end: this.to}, {start:0, end: this.background.width}, this.background.getValue());
        this.slideButton.goToPoint(x, this.background.height / 2);
    }


}

class XSlider extends Slider{

    constructor(public background: ColorSliderBackground, step: number, public from: number, public to: number){
        super(background, step, from, to);
        this.slideButton.width = 4;
    }

    public newPos(x: number, y: number){
        var newVal = this.newPosCalc({start:0,end: this.background.width}, {start: this.from, end: this.to}, x);
        this.background.changeValue(newVal);
    }

}

class HColorSliderBackground extends ColorSliderBackground{

    public getColorAt(val: number): IColor{
        var hsl = this.refColor.toHSL();
        hsl.h = val/100 * 359;
        return hsl;
    }

    public changeValue(newVal: number){
        var col = this.color.value.toHSL();
        col.h = Math.max(0, Math.min(359, newVal));
        this.color.value = col;
    }

    private refColor = color("hsla(0, 100%, 50%, 1)");

    getValue(){
        return this.color.value.toHSL().h;
    }

}

class SColorSliderBackground extends ColorSliderBackground{

    public getColorAt(val: number): IColor{
        var hsl = this.color.value.toHSL();
        hsl.s = val;
        hsl.l = 50;
        hsl.a = 1;
        return hsl;
    }

    public changeValue(newVal: number){
        var col = this.color.value.toHSL();
        col.s = Math.max(0, Math.min(100, newVal));
        this.color.value = col;
    }

    getValue(){
        return Math.round(this.color.value.toHSL().s);
    }

}

class LColorSliderBackground extends ColorSliderBackground{

    public getColorAt(val: number): IColor{
        var hsl = this.color.value.toHSL();
        hsl.l = val;
        hsl.s = 50;
        hsl.a = 1;
        return hsl;
    }

    public changeValue(newVal: number){
        var col = this.color.value.toHSL();
        col.l = Math.max(0, Math.min(100, newVal));
        this.color.value = col;
    }

    getValue(){
        return Math.round(this.color.value.toHSL().l);
    }

}

class AColorSliderBackground extends ColorSliderBackground{

    public getColorAt(val: number): IColor{
        var hsl = this.color.value.toHSL();
        hsl.a = val / 100;
        return hsl;
    }

    public changeValue(newVal: number){
        var col = this.color.value.toHSL();
        col.a = Math.max(0, Math.min(1, newVal));
        this.color.value = col;
    }

    getValue(){
        return this.color.value.toHSL().a;
    }

}

/*
class Pointer{

    public style: any;
    public node: HTMLChildrenRenderer;
    public child: any;
    public tag = "div";


    constructor(public model: IVariable<IColor>, public palette: PaletteHolder){
        this.style = {
            position: "fixed",
            width: "7px",
            height: "7px",
            border: "2px dashed black",
            pointerEvents: "none"
        }
    }

    public render(ctx: IHtmlRenderContext){
        var tl = this.palette.calculateTopLeft();
        var col = this.model.value.toRGB();
        var pt = this.palette.palette.getColorCoordinates(col.r, col.g, col.b);
        (<HTMLElement>this.node.element).style.left = (tl.left + pt.x - 5)+"px";
        (<HTMLElement>this.node.element).style.top = (tl.top + pt.y - 5)+"px";
        this.node.renderAll(ctx);
    }

}*/

/*
class PaletteHolder{

    public tag = "div";
    public style: any;
    public node: HTMLChildrenRenderer;
    public palette = new ColorPalette();
    public event: any;

    public calculateTopLeft(){
        var cr = this.palette.node.element.getBoundingClientRect();
        var mes = measureElement(this.palette.node.element);
        var l = cr.left + mes.paddingLeft + mes.borderLeft;
        var t = cr.top + mes.paddingTop + mes.borderTop;
        return {
            top: t,
            left: l
        }
    }

    constructor(public color: IVariable<IColor>){
        this.style = {
            padding: "8px",
            margin: "0",
            border: "none"
        }
        this.palette.width = 150;
        this.palette.height = 100;

        var self = this;

        function changeColor(ev, t, l){
            var x = ev.clientX - l;
            var y = ev.clientY - t;
            var col = self.palette.chooseColor(x, y);
            inTransaction(() => {
                model.r = col.r;
                model.g = col.g;
                model.b = col.b;
            });
        }

        this.event = {
            mousedown:(ev: MouseEvent) => {
                var tl = this.calculateTopLeft();
                var t = tl.top;
                var l = tl.left;
                changeColor(ev, t, l);
                new DocumentMovement({
                    move(ev){
                        changeColor(ev, t, l);
                    },
                    stop(){

                    }
                })
            }
        }
    }

    public get child(){
        return [this.palette];
    }

}
*/

export interface IColorChooserSettings{

    color?: IColor;
    model?: IColorModel;

}

export interface IColorModel{
    color: IColor;
}

class ColorShower{

    public style: any;
    public node: IHtmlShape;
    public tag = "div";

    constructor(public model: variable.IVariable<IColor>){
        this.style = {
            height: "15px"
        }
    }

    public render(ctx: IHtmlShape){
        this.node.renderAll();
        var el = <HTMLElement> this.node.element;
        var m = this.model.value.toRGB();
        el.style.background = "rgba("+m.r+", "+m.g+", "+m.b+", "+m.a+")";
    }
}

class ColorInputText{

    public tag = "input";
    public attr: any;
    public style: any;
    public prop: any;
    public event: any;

    constructor(public background: ColorSliderBackground){
        this.attr = {
            type: "text"
        }
        this.style = {
            width: "40px"
        }
        this.prop = {
            get value(){
                return background.getValue()+"";
            }
        }
        this.event = {
            change: (ev) => {
                var p = parseInt(ev.target.value) || 0;
                background.changeValue(p);
            },
            keydown: (ev) => {
                if (ev.key === "Enter"){
                    var p = parseInt(ev.target.value) || 0;
                    background.changeValue(p);
                }
            }
        }
    }


}

function colorChooserRow(slider: Slider, name: string){
    return {
        tag: "tr",
        child: [{
            tag: "td",
            style: {
                padding: "5px"
            },
            child: name
        },{
            tag: "td",
            style: {
                padding: "5px",
                width: "100%"
            },
            child: slider
        },{
            tag: "td",
            style: {
                padding: "5px"
            },
            child: new ColorInputText(slider.background)
        }]
    }
}

class ResultColor{

    public tag = "div";

    public style: any;

    constructor(public color: variable.IVariable<IColor>){
        this.style = {
            width: "100%",
            height: "30px",
            get background(){
                return color.value.toString();
            }
        }
    }
}

export interface IColorChooser extends IHtmlConfig{
    refresh();
    color: IVariable<IColor>;
}

export function colorChooser(settings: IColorChooserSettings): IColorChooser{
    if (!settings.model){
        var color: variable.IVariable<IColor> = variable<IColor>(settings.color || new Hsla(0, 0, 0));
        var model = {
            get color(){
                return color.value;
            },
            set color(c){
                color.value = c;
            }
        }
        settings.model = model;
    }
    else {
        model = settings.model;
        color = {
            get value(){
                return model.color;
            },
            set value(v){
                model.color = v;
            }
        }
    }

    var slider = new XSlider(new HColorSliderBackground(color), 1, 0, 359);

    var sslider = new XSlider(new SColorSliderBackground(color), 1, 0, 100);

    var lslider = new XSlider(new LColorSliderBackground(color), 1, 0, 100);

    var aslider = new XSlider(new AColorSliderBackground(color), 0.01, 0, 1);

    var chooser = {
        tag: "table",
        attr: {
            class: "color-table"
        },
        child: {
            tag: "tbody",
            child: [colorChooserRow(slider, "H"),
                colorChooserRow(sslider, "S"),
                colorChooserRow(lslider, "L"),
                colorChooserRow(aslider, "A"),{
                tag: "tr",
                    child: {
                        tag: "td",
                        style: {
                            padding: "5px"
                        },
                        attr: {
                            colspan: "3"
                        },
                        child: new ResultColor(color)
                    }
                }]
        }
    }


    return {
        tag: "div",
        color: color,
        child: [chooser],
        refresh: () => {
            transaction(() => {
                slider.refresh()
                sslider.refresh()
                lslider.refresh()
                aslider.refresh()
            });
        }
    };
}

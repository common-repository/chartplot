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
 
import {variable} from "../../../../../reactive";
import {IChartSettingsComponent} from "./base";
import {getIconShape, IconSet} from "../../icon";
import {ILabelAndIcon} from "../../list/select";
import {removeEmptyProperties} from "../../../../../core/src/object";
import rounder from "../../../math/round";
import {inject} from "../../../../../di";
import {Editor} from "../../editor";
import {IPointRectangle} from "../../../geometry/rectangle";

export type PositionSide = "left" | "right" | "top" | "bottom" | "center" | "middle";

export type RangeSides = "left-right" | "right-width" |
    "left-width" | "center-width" | "top-bottom" | "top-height" | "bottom-height" | "middle-height";

export type PixelOrPercent = "pixel" | "percent";

export interface IPixelPercentPosition {

    position: number;
    side: PositionSide;
    pixelOrPercent: PixelOrPercent;

}

export interface IPixelPercentValue{
    value: number;
    pixelOrPercent: PixelOrPercent;
}

export interface IPixelPercentRange {
    sides: RangeSides;
    start: IPixelPercentValue;
    end: IPixelPercentValue;
}

export const sideToMeta: {[s in PositionSide]: ILabelAndIcon} = {
    left: {
        icon: getIconShape(IconSet.border_left),
        label: "Left",
        value: "left"
    },
    right: {
        icon: getIconShape(IconSet.border_right),
        label: "Right",
        value: "right"
    },
    top: {
        icon: getIconShape(IconSet.border_top),
        label: "Top",
        value: "top"
    },
    bottom: {
        icon: getIconShape(IconSet.border_bottom),
        label: "Bottom",
        value: "bottom"
    },
    center: {
        icon: getIconShape(IconSet.border_vertical),
        label: "Center",
        value: "center"
    },
    middle: {
        icon: getIconShape(IconSet.border_horizontal),
        label: "Middle",
        value: "middle"
    }
}

export const rangeSideToMeta: {[s in RangeSides]: ILabelAndIcon} = {

    "bottom-height": {
        icon: getIconShape(IconSet.border_bottom_height),
        label: "Bottom-Height",
        value: "bottom-height"
    },
    "center-width": {
        icon: getIconShape(IconSet.border_horizontal),
        label: "Center-Width",
        value: "center-width"
    },
    "left-right": {
        icon: getIconShape(IconSet.border_left_right),
        label: "Left-Right",
        value: "left-right"
    },
    "left-width": {
        icon: getIconShape(IconSet.border_left_width),
        label: "Left-Width",
        value: "left-width"
    },
    "middle-height": {
        icon: getIconShape(IconSet.border_vertical),
        label: "Middle-Height",
        value: "middle-height"
    },
    "right-width": {
        icon: getIconShape(IconSet.border_right_width),
        label: "Right-Width",
        value: "right-width"
    },
    "top-bottom": {
        icon: getIconShape(IconSet.border_top_bottom),
        label: "Top-Bottom",
        value: "top-bottom"
    },
    "top-height": {
        icon: getIconShape(IconSet.border_top_height),
        label: "Top-Height",
        value: "top-height"
    }

}


export function getMetaForSide(posSide: PositionSide){
    return sideToMeta[posSide];
}

export function getMetaForRange(posRange: RangeSides){
    return rangeSideToMeta[posRange];
}

const pixelPercentToIcon = {
    pixel: getIconShape(IconSet.grid),
    percent: getIconShape(IconSet.percent)
}

const pixelPercentToLabel = {
    pixel: "px",
    percent: "%"
}

export function getIconForPixelPercent(pp: PixelOrPercent){
    return pixelPercentToIcon[pp];
}

export function getLabelForPixelPercent(pp: PixelOrPercent){
    return pixelPercentToLabel[pp];
}

export class PixelPercentValue implements IPixelPercentValue, IChartSettingsComponent{

    defaultValue: number = null;
    defaultPixelPercent: PixelOrPercent = null;

    public r_value = variable(null);

    get value(){
        return typeof this.r_value.value === "number" ? this.r_value.value : this.defaultValue;
    }

    set value(v){
        this.r_value.value = v;
    }

    public r_pixelOrPercent = variable<PixelOrPercent>(null);

    get pixelOrPercent(){
        return this.r_pixelOrPercent.value || this.defaultPixelPercent;
    }

    set pixelOrPercent(v){
        this.r_pixelOrPercent.value = v;
    }

    applyConfig(c){
        if ("value" in c){
            this.value = c.value;
        }
        else{
            this.value = null;
        }
        this.pixelOrPercent = c.pixelOrPercent || null;
    }

    createConfig(){
        return removeEmptyProperties({
            value: this.r_value.value,
            pixelOrPercent: this.r_pixelOrPercent.value
        })
    }

    getEchartValue(){
        if (this.value === null || this.value === void 0){
            return null;
        }
        return EChartPositionUtils.getPosition(this.value, this.pixelOrPercent);
    }

}

export class DefaultPixelPercentValue implements IPixelPercentValue{
    constructor(public ppVal: IPixelPercentValue, public offset = 0){

    }

    get value(){
        return typeof this.ppVal.value === "number" ? this.ppVal.value : this.offset;
    }

    set value(v){
        this.ppVal.value = v;
    }

    get pixelOrPercent(){
        return this.ppVal.pixelOrPercent || "pixel";
    }

    set pixelOrPercent(v){
        this.ppVal.pixelOrPercent = v;
    }

}

export class PixelPercentRange implements IPixelPercentRange, IChartSettingsComponent{

    public r_sides = variable<RangeSides>(null);

    get sides(){
        return this.r_sides.value;
    }

    set sides(v){
        this.r_sides.value = v;
    }

    public start = new PixelPercentValue();
    public end = new PixelPercentValue();

    createConfig(){
        return removeEmptyProperties({
            sides: this.sides,
            start: this.start.createConfig(),
            end: this.end.createConfig()
        })
    }

    applyConfig(c){
        this.sides = c.sides || null;
        if (c.start){
            this.start.applyConfig(c.start);
        }
        if (c.end){
            this.end.applyConfig(c.end);
        }
    }

}

export class PixelPercentPosition implements IPixelPercentPosition, IChartSettingsComponent{

    public r_position = variable<number>(null);

    get position(){
        return this.r_position.value;
    }

    set position(v){
        this.r_position.value = v;
    }

    public r_side = variable<PositionSide>(null);

    get side(){
        return this.r_side.value;
    }

    set side(v){
        this.r_side.value = v;
    }

    public r_pixelOrPercent = variable<PixelOrPercent>(null);

    get pixelOrPercent(){
        return this.r_pixelOrPercent.value;
    }

    set pixelOrPercent(v){
        this.r_pixelOrPercent.value = v;
    }

    createConfig(){
        return {
            position: this.r_position.value,
            side: this.r_side.value,
            pixelOrPercent: this.r_pixelOrPercent.value
        }
    }

    applyConfig(c){
        if ("position" in c){
            this.position = c.position;
        }
        if ("side" in c){
            this.side = c.side;
        }
        if ("pixelOrPercent" in c){
            this.pixelOrPercent = c.pixelOrPercent;
        }
    }
}

export class LeftRightDefaultPixelPercentPosition implements IPixelPercentPosition{

    constructor(public pos: IPixelPercentPosition){

    }

    get position(){
        return typeof this.pos.position === "number" ? this.pos.position : 0;
    }

    set position(p){
        this.pos.position = p;
    }

    defaultSide: PositionSide = "left";

    get side(){
        return this.pos.side || this.defaultSide;
    }

    set side(v){
        this.pos.side = v;
    }

    get pixelOrPercent(){
        return this.pos.pixelOrPercent || "pixel";
    }

    set pixelOrPercent(p){
        this.pos.pixelOrPercent = p;
    }

}

export class TopBottomDefaultPixelPercentPosition extends LeftRightDefaultPixelPercentPosition{

    get side(){
        return this.pos.side || "top";
    }

    set side(v){
        this.pos.side = v;
    }

}

export class LeftRightDefaultPixelPercentRange implements IPixelPercentRange{

    public start: IPixelPercentValue;
    public end: IPixelPercentValue;

    constructor(public pos: IPixelPercentRange, offset = 0){
        this.start = new DefaultPixelPercentValue(this.pos.start, offset);
        this.end = new DefaultPixelPercentValue(this.pos.end, offset);
    }

    get sides(){
        return this.pos.sides || "left-right"
    }

    set sides(v){
        this.pos.sides = v;
    }
}

export class TopBottomDefaultPixelPercentRange extends LeftRightDefaultPixelPercentRange{

    get sides(){
        return this.pos.sides || "top-bottom";
    }

    set sides(v){
        this.pos.sides = v;
    }

}

export class EChartPositionUtils{

    static applyLeftRightConfig(settings: any, position: IPixelPercentPosition){
        var side = position.side;
        if ((side === "left" || side === "right") && position.position){
            var pos: any = position.position;
            if (position.pixelOrPercent === "percent"){
                pos = pos+"%";
            }
            if (position.side === "right"){
                settings.right = pos;
            }
            else
            {
                settings.left = pos;
            }
        }
        else
        {
            settings.left = side;
        }
    }

    static getPosition(pos: number, pixelOrPercent: PixelOrPercent){
        var res: any = pos;
        if (pixelOrPercent === "percent"){
            res = res+"%";
        }
        return res;
    }

    static getPercentFromPixelSize(pos: number, size: number){
        return Math.round(pos/size*100);
    }

    static calculateSizePixelVal(size: number, value: IPixelPercentValue){
        return EChartPositionUtils.calculateSize(size, value.value, value.pixelOrPercent);
    }

    static calculateSize(size: number, value: number, pixelOrPercent: PixelOrPercent){
        if (pixelOrPercent === "percent"){
            return size * (value *0.01);
        }
        return value;
    }

    static applyTopBottomConfig(settings: any, position: IPixelPercentPosition){
        var side = position.side;
        if ((side === "top" || side === "bottom") && position.position){
            var pos: any = position.position;
            if (position.pixelOrPercent === "percent"){
                pos = pos+"%";
            }
            if (position.side === "top"){
                settings.top = pos;
            }
            else {
                settings.bottom = pos;
            }
        }
        else
        {
            settings.top = side;
        }
    }

    static notSet(setting){
        return setting === void 0 || setting === null || setting === "auto";
    }

    static applyLeftRightWidthConfig(settings: any, xPos: IPixelPercentRange, offset = 0){
        switch(xPos.sides){
            case "center-width":
                settings.left = "center";
                if (!xPos.end){
                    settings.width = "40%";
                }
                else
                {
                    settings.width = EChartPositionUtils.getPosition(xPos.start.value, xPos.start.pixelOrPercent);
                }
                break;
            case "left-right":
                if (xPos.start){
                    settings.left = EChartPositionUtils.getPosition(xPos.start.value, xPos.start.pixelOrPercent);
                }
                else
                {
                    settings.left = offset;
                }
                if (xPos.end){
                    settings.right = EChartPositionUtils.getPosition(xPos.end.value, xPos.end.pixelOrPercent);
                }
                else{
                    settings.right = offset;
                }
                break;
            case "left-width":
                if (xPos.start){
                    settings.left = EChartPositionUtils.getPosition(xPos.start.value, xPos.start.pixelOrPercent);
                }
                else
                {
                    settings.left = offset;
                }
                if (xPos.end){
                    settings.width = EChartPositionUtils.getPosition(xPos.end.value, xPos.end.pixelOrPercent);
                }
                else{
                    settings.width = "40%";
                }
                break;
            case "right-width":
                if (xPos.start){
                    settings.right = EChartPositionUtils.getPosition(xPos.start.value, xPos.start.pixelOrPercent);
                }
                else
                {
                    settings.right = offset;
                }
                if (xPos.end){
                    settings.width = EChartPositionUtils.getPosition(xPos.end.value, xPos.end.pixelOrPercent);
                }
                else{
                    settings.width = "40%";
                }
                break;
        }
    }

    static applyTopBottomHeightConfig(settings: any, yPos: IPixelPercentRange, offset = 0){
        switch(yPos.sides){
            case "middle-height":
                settings.top = "middle";
                if (!yPos.end){
                    settings.height = "40%";
                }
                else
                {
                    settings.height = EChartPositionUtils.getPosition(yPos.start.value, yPos.start.pixelOrPercent);
                }
                break;
            case "top-bottom":
                if (yPos.start){
                    settings.top = EChartPositionUtils.getPosition(yPos.start.value, yPos.start.pixelOrPercent);
                }
                else
                {
                    settings.top = offset;
                }
                if (yPos.end){
                    settings.bottom = EChartPositionUtils.getPosition(yPos.end.value, yPos.end.pixelOrPercent);
                }
                else{
                    settings.bottom = offset;
                }
                break;
            case "top-height":
                if (yPos.start){
                    settings.top = EChartPositionUtils.getPosition(yPos.start.value, yPos.start.pixelOrPercent);
                }
                else
                {
                    settings.top = offset;
                }
                if (yPos.end){
                    settings.height = EChartPositionUtils.getPosition(yPos.end.value, yPos.end.pixelOrPercent);
                }
                else{
                    settings.height = "40%";
                }
                break;
            case "bottom-height":
                if (yPos.start){
                    settings.bottom = EChartPositionUtils.getPosition(yPos.start.value, yPos.start.pixelOrPercent);
                }
                else
                {
                    settings.bottom = offset;
                }
                if (yPos.end){
                    settings.height = EChartPositionUtils.getPosition(yPos.end.value, yPos.end.pixelOrPercent);
                }
                else{
                    settings.height = "40%";
                }
                break;
        }
    }

    static applyDynamicSquareConfigSide(settings: IDynamicSquareSideSettings){
        switch(settings.pos.sides) {
            case "right-width":
            case "bottom-height":
                var s = settings.size - EChartPositionUtils.calculateSizePixelVal(settings.size, settings.pos.start);
                var h = EChartPositionUtils.calculateSizePixelVal(settings.size, settings.pos.end);
                settings.componentSide.start = s - h;
                settings.componentSide.end = s;
                break;
            case "left-width":
            case "top-height":
                settings.componentSide.start = EChartPositionUtils.calculateSizePixelVal(settings.size, settings.pos.start);
                settings.componentSide.end = settings.componentSide.start +  EChartPositionUtils.calculateSizePixelVal(settings.size, settings.pos.end);
                break;
            case "left-right":
            case "top-bottom":
                settings.componentSide.start = settings.pos.start ? EChartPositionUtils.calculateSizePixelVal(settings.size, settings.pos.start) : settings.offset;
                settings.componentSide.end = settings.size - (settings.pos.end ? EChartPositionUtils.calculateSizePixelVal(settings.size, settings.pos.end) : settings.offset);
                break;
            case "center-width":
            case "middle-height":
                let w = settings.pos.start ? EChartPositionUtils.calculateSizePixelVal(settings.size, settings.pos.start) : settings.size * 0.4;
                settings.componentSide.start = (settings.size - w) / 2;
                settings.componentSide.end = settings.componentSide.start + w;
                break;
        }
    }

}

var horizontalPos = {
    left: true,
    right: true,
    center: true
}

export class PointCalculator{

    public xFromVal: number;
    public val: number;

    valToPos: (n: number) => number;
    posToVal: (n: number) => number;

    calculate(x: number){
        this.val = this.posToVal(x);
        this.xFromVal = this.valToPos(this.val);
    }

}

export class ChartPixelPercentRounderBuilder {

    @inject
    editor: Editor;

    constructor(public component: IPointRectangle){

    }

    _direction: "x" | "y" = "x";
    _percent = false;
    _side: "start" | "end";
    _rounder: (n: number) => number;
    _startPos: boolean = false;

    startPos(sp: boolean){
        this._startPos = sp;
        return this;
    }

    rounder(n: number){
        if (typeof n === "number"){
            this._rounder = rounder(n);
        }
        else
        {
            this._rounder = null;
        }
        return this;
    }

    side(s: "start" | "end"){
        this._side = s;
        return this;
    }

    direction(d: "x" | "y"){
        this._direction = d;
        return this;
    }

    percent(d: boolean){
        this._percent = d;
        return this;
    }

    build() {
        var posToVal: (n: number) => number;
        var valToPos: (n: number) => number;
        var dimComp: () => number;
        var dimCont: () => number;
        if (this._direction === "x"){
            dimComp = () => (this.component.xe - this.component.xs);
            dimCont = () => this.editor.chartPreview.getShapeDimensions().width;
        }
        else
        {
            dimComp = () => (this.component.ye - this.component.ys);
            dimCont = () => this.editor.chartPreview.getShapeDimensions().height;
        }
        if (this._percent){
            valToPos = (n) => EChartPositionUtils.calculateSize(dimCont(), n, "percent");
        }
        else{
            valToPos = (n) => n;
        }
        var ovtp = valToPos;
        if (this._startPos){
            posToVal = (n) => n + dimComp();
        }
        else{
            posToVal = (n) => n;
        }
        var optv0 = posToVal;
        if (this._side === "start"){
            posToVal = (n) => optv0(n);
            valToPos = (n) => ovtp(n);
        }
        else
        {
            posToVal = (n) => dimCont() - optv0(n);
            valToPos = (n) => dimCont() - ovtp(n);
        }
        var ovtp1 = valToPos;
        if (this._startPos){
            valToPos = (n) => ovtp1(n) - dimComp();
        }
        if (this._percent){
            var optv = posToVal;
            posToVal = (n) => EChartPositionUtils.getPercentFromPixelSize(optv(n), dimCont());
        }
        if (this._rounder){
            var optv2 = posToVal;
            var r = this._rounder;
            posToVal = (n) => r(optv2(n));
        }
        var calc = new PointCalculator();
        calc.posToVal = posToVal;
        calc.valToPos = valToPos;
        return calc;
    }

    buildForPos(pos: IPixelPercentPosition){
        switch(pos.side){
            case "right":
            case "bottom":
                this.side("end");
                break;
            default:
                this.side("start");
                break;
        }
        this.percent(pos.pixelOrPercent ===  "percent");
        this.rounder(pos.pixelOrPercent === "percent" ? this.editor.editorSettings.options.view.getGrid() : this.editor.editorSettings.options.view.getPixelGrid());
        if (pos.side in horizontalPos){
            this.direction("x");
        }
        else
        {
            this.direction("y");
        }
        return this.build();
    }

}

export interface IDynamicSquareSideSettings{

    pos: IPixelPercentRange;
    size: number;
    componentSide: {start: number, end: number}
    offset: number;

}

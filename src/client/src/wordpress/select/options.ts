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
 
import {TextInput} from "../../component/editor/ribbon/blocks/input";
import {TripleSurface} from "../../component/editor/ribbon/blocks/surface";
import {create, init, inject} from "../../../../di";
import {variable} from "../../../../reactive";

export class Options{

    tag = "div";
    attr: any;

    constructor(){
        this.attr = {
            class: "chartplot-selection-options"
        }
    }

    @create(() => new ChartDimensionTriple())
    dimension: ChartDimensionTriple;

    public r_width = variable<string>("");
    public r_height = variable("");
    public r_autoResize = variable(true);
    public r_variable = variable("");

    public r_initialized = variable(false);

    get initialized(){
        return this.r_initialized.value;
    }

    set initialized(v){
        this.r_initialized.value = v;
    }

    get variable(){
        return this.r_variable.value;
    }

    set variable(v){
        this.r_variable.value = v;
    }

    get autoResize(){
        return this.r_autoResize.value;
    }

    set autoResize(v){
        this.r_autoResize.value = v;
    }

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

    get child(){
        return (<any[]>[this.dimension]);
    }

    toJson(){
        return {
            width: this.width,
            height: this.height
        }
    }

    fromJson(opts){
        this.width = opts.width || "100%";
        this.height = opts.height || "500px";
        if ("autoResize" in opts){
            this.autoResize = opts.autoResize;
        }
        this.variable = opts.variable || "";
    }

}

class ChartDimensionTriple extends TripleSurface{

    @create(() => new ChartWidth())
    width: ChartWidth;

    @create(() => new ChartHeight())
    height: ChartHeight;

    @init
    init(){
        this.top = "Dimensions";
        this.middle = this.width;
        this.bottom = this.height;
    }

}

export class ChartWidth extends TextInput{

    @inject
    options: Options;

    label = "width";

    tooltip = "The width of the chart. All legal css sizes are accepted, e.g. '300px', '100%', '20rem', ..."

    @init
    init(){
        super.init();
        this.r_value = this.options.r_width;
    }

    get disabled(){
        return !this.options.initialized;
    }

}

export class ChartHeight extends TextInput{

    @inject
    options: Options;

    label = "height";

    tooltip = "The height of the chart. All legal css sizes are accepted, e.g. '300px', '100%', '20rem', ..."

    @init
    init(){
        super.init();
        this.r_value = this.options.r_height;
    }

    get disabled(){
        return !this.options.initialized;
    }

}

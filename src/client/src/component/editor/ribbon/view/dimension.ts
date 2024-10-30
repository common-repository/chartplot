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
 
import {RibbonContentSection} from "../base";
import {create, init, inject} from "../../../../../../di";
import {TripleSurface} from "../blocks/surface";
import {RibbonSelectButton} from "../blocks";
import {procedure} from "../../../../../../reactive";
import {getIconShape, IconSet} from "../../../icon";
import {NumberInput} from "../blocks/input";
import {IconLabelSelectListItem, SelectList} from "../../../list/select";
import {IReactiveVariable} from "../../../../../../reactive/src/variable";
import {EditorSettings} from "../../settings";
import {ChartHistory} from "../../../history";
import {ValueHistory} from "../../../history/value";
import {TooltipBlock} from "../blocks/tooltip";

class SelectDimension extends RibbonSelectButton{

    constructor(public r_activeScreen: IReactiveVariable<string>){
        super();
    }

    get activeScreen(){
        return this.r_activeScreen.value || "default";
    }

    set activeScreen(v){
        this.r_activeScreen.value = v;
    }

    get icon(){
        switch(this.activeScreen){
            case "default":
                return getIconShape(IconSet.square)
            case "mobile":
                return getIconShape(IconSet.mobile)
            case "tablet":
                return getIconShape(IconSet.tablet_mac)
            case "desktop":
                return getIconShape(IconSet.display)
            case "fullscreen":
                return getIconShape(IconSet.enlarge)
            case "custom":
                return getIconShape(IconSet.square2)
        }
    }

    @init
    init(){
        super.init();
    }

    tooltip = new TooltipBlock({title: "Canvas size", content: {tag: "html", child: `
The size of the canvas. Select to see how your chart looks on different screen sizes.
`}})

    get label(){
        switch(this.activeScreen){
            case "default":
                return "Default";
            case "mobile":
                return "320 × 480";
            case "tablet":
                return "480 × 800";
            case "desktop":
                return "1280 × 1024";
            case "fullscreen":
                return "Fullscreen";
            case "custom":
                return "Custom";
        }
    }

    getContent(){
        const dropwdown = new SelectList();
        dropwdown.items.push(new IconLabelSelectListItem("Default",getIconShape(IconSet.square)).setAction(ev => this.activeScreen = "default"));
        dropwdown.items.push(new IconLabelSelectListItem("320 × 480",getIconShape(IconSet.mobile)).setAction(ev => this.activeScreen = "mobile"));
        dropwdown.items.push(new IconLabelSelectListItem("480 × 800",getIconShape(IconSet.tablet_mac)).setAction(ev => this.activeScreen = "tablet"));
        dropwdown.items.push(new IconLabelSelectListItem("1280 × 1024",getIconShape(IconSet.display)).setAction(ev => this.activeScreen = "desktop"));
        dropwdown.items.push(new IconLabelSelectListItem("Fullscreen",getIconShape(IconSet.enlarge)).setAction(ev => this.activeScreen = "fullscreen"));
        dropwdown.items.push(new IconLabelSelectListItem("Custom",getIconShape(IconSet.square2)).setAction(ev => this.activeScreen = "custom"));
        return dropwdown;
    }

}

class DimensionInput extends NumberInput{

    @inject
    history: ChartHistory;

    changeValue(v){
        this.history.executeCommand(new ValueHistory(this.r_nvalue, v));
    }

    get value(){
        return this.r_nvalue.value;
    }

    set value(v){
        this.r_nvalue.value = v;
    }

    constructor(public r_nvalue: IReactiveVariable<number>){
        super();
    }

    validateInput(inp: string){
        var res = super.validateInput(inp);
        if (!res){
            return res;
        }
        if (res < 0){
            res = 0;
        }
        return res;
    }

}

class DimensionTriple extends TripleSurface{

    @inject
    editorSettings: EditorSettings;

    @create(function(this: DimensionTriple){
        return new SelectDimension(this.editorSettings.options.view.r_activeScreen);
    })
    dimension: SelectDimension;

    @create(function(this: DimensionTriple){
        var r = new DimensionInput(this.editorSettings.options.view.r_width);
        r.tooltip = new TooltipBlock({title: "Canvas width", content: 'The width of the canvas.'})
        return r;
    })
    width: DimensionInput;

    @create(function(this: DimensionTriple){
        var r = new DimensionInput(this.editorSettings.options.view.r_height);
        r.tooltip = new TooltipBlock({title: "Canvas height", content: 'The height of the canvas.'})
        return r;
    })
    height: DimensionInput;

    @init
    init(){
        this.width.label = "width";
        this.height.label = "height";
        procedure(() => {
            if (this.dimension.activeScreen === "custom"){
                this.width.disabled = false;
                this.height.disabled = false;
            }
            else
            {
                this.width.disabled = true;
                this.height.disabled = true;
            }
        });
        this.top = this.dimension;
        this.middle = this.width;
        this.bottom = this.height;
    }

}

export class CanvasSizeSection extends RibbonContentSection{

    label = "canvas size";

    @create(() => new DimensionTriple())
    dimension: DimensionTriple

    get contents(){
        return [this.dimension];
    }

}

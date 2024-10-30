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
 
import {SingleDimensionPositionRibbonSection} from "../blocks/position/ribbon";
import {create, define, init, inject} from "../../../../../../di";
import {IPixelPercentPosition} from "../../../echart/settings/position";
import {EChartLegendSettings} from "../../../echart/settings/components/legend";
import {
    BackgroundColorButton, BoldSelect,
    FontFamily,
    FontSize, ItalicSelect,
    TextColorButton
} from "../blocks/style/text";
import {TripleSurface} from "../blocks/surface";
import {RibbonContentSection} from "../base";
import {HistoryRibbonSelectList} from "../blocks";
import {TooltipBlock} from "../blocks/tooltip";
import {HistoryTextInput} from "../blocks/input";

export class LegendComponentPart{

    constructor(selectedComponent: EChartLegendSettings){
        this.selectedComponent = selectedComponent;
    }

    @define
    selectedComponent: EChartLegendSettings;

    @create(() => new LegendPositionSection())
    position: LegendPositionSection;

    @create(() => new LegendStyleSection())
    style: LegendStyleSection;

    @create(() => new LegendGeneralSection())
    legend: LegendGeneralSection;

    get contents(){
        return [this.legend, this.position, this.style];
    }

}

class LegendGeneralSection extends RibbonContentSection{

    @inject
    selectedComponent: EChartLegendSettings;

    label = "general";

    @create(function(this: LegendGeneralSection){
        var t = new HistoryRibbonSelectList();
        t.default = null;
        t.items = [{value: null, label: "Plain"},
            {value: "scroll", label: "Scrollable"}];
        t.r_value = this.selectedComponent.r_echartType;
        t.tooltip = new TooltipBlock({title: "Legend type", content: {
            tag: "html",
            child: `
The type of the legend.
<ul class="bullet">
    <li><b>Plain: </b>All legend items will be rendered. If not all items fit on the same line, they will be rendered on the next line.</li>
    <li><b>Scrollable: </b>If not all items can be rendered on the same line, a scrollbar will be shown</li>
</ul>
            `
        }})
        return t;
    })
    type: HistoryRibbonSelectList;

    @create(function(this: LegendGeneralSection){
        var r = new HistoryTextInput();
        r.label = "Name";
        r.r_value = this.selectedComponent.r_name;
        return r;
    })
    name: HistoryTextInput;

    @create(function(this: LegendGeneralSection){
        var r = new HistoryRibbonSelectList();
        r.r_value = this.selectedComponent.r_orientation;
        r.default = "horizontal";
        r.items = [{label: "Horizontal", value: "horizontal"},
            {label: "Vertical", value: "vertical"}];
        r.tooltip = new TooltipBlock({title: "Orientation", content: "Whether to align the legend items horizontally or vertically"});
        return r;
    })
    orientation: HistoryRibbonSelectList;

    get contents(){
        var f = this.tripleSurface({
            top: this.type,
            middle: this.name,
            bottom: this.orientation
        });
        return [f];
    }

}

export class LegendPositionSection extends SingleDimensionPositionRibbonSection{

    @define
    itemName = "Legend";

    @inject
    selectedComponent: EChartLegendSettings;

    @create(function(this: LegendPositionSection){
        return this.selectedComponent.xPosDefault;
    })
    leftRightPosition: IPixelPercentPosition;

    @create(function(this: LegendPositionSection){
        return this.selectedComponent.yPosDefault;
    })
    topBottomPosition: IPixelPercentPosition;

}

export class LegendStyleSection extends RibbonContentSection{

    label = "style"

    @create(() => new StyleTriple())
    triple: StyleTriple

    get contents(){
        return [this.triple];
    }

}

class StyleTriple extends TripleSurface{

    @inject
    selectedComponent: EChartLegendSettings;


    @create(function(this: StyleTriple){return new TextColorButton(this.selectedComponent.textStyle.r_color)})
    textColor: TextColorButton;

    @create(function(this: StyleTriple){return new BackgroundColorButton(this.selectedComponent.r_backgroundColor)})
    backgroundColor: BackgroundColorButton;

    @create(function(this: StyleTriple){
        return new FontFamily(this.selectedComponent.textStyle.r_fontFamily);
    })
    font: FontFamily;

    @create(function(this: StyleTriple){
        return new FontSize(this.selectedComponent.textStyle.r_fontSize);
    })
    fontSize: FontSize;

    @create(function(this: StyleTriple){
        var res = new BoldSelect();
        res.r_value = this.selectedComponent.textStyle.r_fontWeight;
        return res;
    })
    bold: BoldSelect;

    @create(function(this: StyleTriple){
        var is = new ItalicSelect();
        is.r_value = this.selectedComponent.textStyle.r_fontStyle;
        return is;
    })
    italic: ItalicSelect

    @init
    init(){
        this.top = [this.font, this.fontSize];
        this.middle = [this.textColor, this.backgroundColor];
        this.bottom = [this.bold, this.italic];

    }

}

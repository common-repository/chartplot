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
import {EChartTitleSettings} from "../../../echart/settings/components/title";
import {IPixelPercentPosition} from "../../../echart/settings/position";
import {RibbonContentSection} from "../base";
import {TripleSurface} from "../blocks/surface";
import {
    BackgroundColorButton, BoldSelect,
    FontFamily,
    FontSize,
    ItalicSelect,
    TextColorButton
} from "../blocks/style/text";
import {HistoryCheckboxInput} from "../blocks/checkbox";
import {TooltipBlock} from "../blocks/tooltip";
import {HistoryTextAreaInput} from "../blocks/input";

export class TitleComponentPart{

    constructor(selectedComponent: EChartTitleSettings){
        this.selectedComponent = selectedComponent;
    }

    @define
    selectedComponent: EChartTitleSettings;

    @create(() => new TitlePositionSection())
    position: TitlePositionSection;

    @create(() => new TitleStyleSection())
    style: TitleStyleSection;

    @create(() => new GeneralSection())
    general: GeneralSection;

    get contents(){
        return [this.general, this.position, this.style];
    }

}

export class TitlePositionSection extends SingleDimensionPositionRibbonSection{

    @define
    itemName = "Title";

    @inject
    selectedComponent: EChartTitleSettings;

    @create(function(this: TitlePositionSection){
        return this.selectedComponent.xPosDefault;
    })
    leftRightPosition: IPixelPercentPosition

    @create(function(this: TitlePositionSection){
        return this.selectedComponent.yPosDefault;
    })
    topBottomPosition: IPixelPercentPosition

}

export class TitleStyleSection extends RibbonContentSection{

    label = "style"

    @create(() => new StyleTriple())
    triple: StyleTriple

    get contents(){
        return [this.triple];
    }

}

class StyleTriple extends TripleSurface{

    @inject
    selectedComponent: EChartTitleSettings;


    @create(function(this: StyleTriple){return new TextColorButton(this.selectedComponent.textStyle.r_color)})
    textColor: TextColorButton;

    @create(function(this: StyleTriple){return new BackgroundColorButton(this.selectedComponent.r_backgroundColor)})
    backgroundColor: BackgroundColorButton;

    @create(function(this: StyleTriple){
        return new FontFamily(this.selectedComponent.textStyle.r_fontFamily);
    })
    font: FontFamily;

    @create(function(this: StyleTriple){
        var res = new FontSize(this.selectedComponent.textStyle.r_fontSize);
        return res;
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

class TextInput extends HistoryTextAreaInput{

    @inject
    selectedComponent: EChartTitleSettings;

    @init
    init(){
        super.init();
        this.r_value = this.selectedComponent.r_text;
        this.tooltip = new TooltipBlock({title: "Text", content: "The text to show"});
    }

    get disabled(){
        return this.selectedComponent.showChartTitle;
    }
}

class GeneralSection extends RibbonContentSection {

    label = "Text"

    @inject
    selectedComponent: EChartTitleSettings;

    @create(function(this: GeneralSection){
        var r = new HistoryCheckboxInput();
        r.r_value = this.selectedComponent.r_showChartTitle;
        r.label = "Chart title";
        r.tooltip = new TooltipBlock({title: "Show chart title", content: `Whether to show the chart title as text.`})
        return r;
    })
    showChartTitle: HistoryCheckboxInput;

    @create(function(this: GeneralSection){
        var r = new TextInput();
        return r;

    })
    text: TextInput;

    get contents(){
        return [this.tripleSurface({
            top: this.showChartTitle,
            middle: this.text
        })];
    }

}

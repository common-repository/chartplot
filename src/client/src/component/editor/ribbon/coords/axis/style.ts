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
 
import {create, init, inject} from "../../../../../../../di";
import {
    BackgroundColorButton,
    BoldSelect,
    FontFamily,
    FontSize,
    ItalicSelect,
    TextColorButton
} from "../../blocks/style/text";
import {TripleSurface} from "../../blocks/surface";
import {RibbonContentSection, RibbonTab} from "../../base";
import {GridAxis} from "../../../../echart/settings/coordinates/grid/axis";

export class AxisStyleTab extends RibbonTab{

    name = "Style";

    @create(() => new LabelStyleSection())
    label: LabelStyleSection;

    get contents(){
        return [this.label];
    }

}

export class LabelStyleSection extends RibbonContentSection{

    label = "label style"

    @create(() => new LabelStyleTriple())
    triple: LabelStyleTriple

    get contents(){
        return [this.triple];
    }

}

class LabelStyleTriple extends TripleSurface{

    @inject
    axis: GridAxis;


    @create(function(this: LabelStyleTriple){return new TextColorButton(this.axis.axisLabel.r_color)})
    textColor: TextColorButton;

    @create(function(this: LabelStyleTriple){return new BackgroundColorButton(this.axis.axisLabel.r_backgroundColor)})
    backgroundColor: BackgroundColorButton;

    @create(function(this: LabelStyleTriple){
        return new FontFamily(this.axis.axisLabel.r_fontFamily);
    })
    font: FontFamily;

    @create(function(this: LabelStyleTriple){
        return new FontSize(this.axis.axisLabel.r_fontSize);
    })
    fontSize: FontSize;

    @create(function(this: LabelStyleTriple){
        var res = new BoldSelect();
        res.r_value = this.axis.axisLabel.r_fontWeight;
        return res;
    })
    bold: BoldSelect;

    @create(function(this: LabelStyleTriple){
        var is = new ItalicSelect();
        is.r_value = this.axis.axisLabel.r_fontStyle;
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

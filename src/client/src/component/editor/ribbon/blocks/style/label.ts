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
 
import {BackgroundColorButton, BoldSelect, FontFamily, FontSize, ItalicSelect, TextColorButton} from "./text";
import {create} from "../../../../../../../di";
import {TripleSurface} from "../surface";
import {IReactiveVariable} from "../../../../../../../reactive/src/variable";

export interface ITextStyleSettings{

    r_color: IReactiveVariable<string>;
    r_fontFamily: IReactiveVariable<string>;
    r_backgroundColor: IReactiveVariable<string>;
    r_fontSize: IReactiveVariable<number>;
    r_fontWeight: IReactiveVariable<string>;
    r_fontStyle: IReactiveVariable<string>;

}

export class LabelStyleTriple extends TripleSurface{

    constructor(public settings: ITextStyleSettings){
        super();
    }

    @create(function(this: LabelStyleTriple){return new TextColorButton(this.settings.r_color)})
    textColor: TextColorButton;

    @create(function(this: LabelStyleTriple){return new BackgroundColorButton(this.settings.r_backgroundColor)})
    backgroundColor: BackgroundColorButton;

    @create(function(this: LabelStyleTriple){
        return new FontFamily(this.settings.r_fontFamily);
    })
    font: FontFamily;

    @create(function(this: LabelStyleTriple){
        var res = new FontSize(this.settings.r_fontSize);
        return res;
    })
    fontSize: FontSize;

    @create(function(this: LabelStyleTriple){
        var res = new BoldSelect();
        res.r_value = this.settings.r_fontWeight;
        return res;
    })
    bold: BoldSelect;

    @create(function(this: LabelStyleTriple){
        var is = new ItalicSelect();
        is.r_value = this.settings.r_fontStyle;
        return is;
    })
    italic: ItalicSelect;

    getMiddle(): any[]{
        return [this.textColor, this.backgroundColor];
    }

    getTop(): any[]{
        return [this.font, this.fontSize];
    }

    getBottom(): any[]{
        return [this.bold, this.italic];
    }

    get top(){
        return this.getTop();
    }

    get middle(){
        return this.getMiddle();
    }

    get bottom(){
        return this.getBottom();
    }

}

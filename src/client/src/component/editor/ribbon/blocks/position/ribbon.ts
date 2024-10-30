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
 
import {RibbonContentSection} from "../../base";
import {IPixelPercentPosition, IPixelPercentRange} from "../../../../echart/settings/position";
import {LeftRightPixelPercentPositionInput, TopBottomPixelPercentPositionInput} from "./position";
import {create} from "../../../../../../../di";
import {SpaceSurface} from "../surface";
import {LeftRightPixelPercentRangeInput, TopBottomPixelPercentRangeInput} from "./square";

export abstract class SingleDimensionPositionRibbonSection extends RibbonContentSection{

    label = "position";

    abstract leftRightPosition: IPixelPercentPosition;
    abstract topBottomPosition: IPixelPercentPosition;

    @create(function(this: SingleDimensionPositionRibbonSection){
        return new TopBottomPixelPercentPositionInput(this.topBottomPosition);
    })
    topBottomPositionInput: TopBottomPixelPercentPositionInput;

    @create(function(this: SingleDimensionPositionRibbonSection){
        return new LeftRightPixelPercentPositionInput(this.leftRightPosition);
    })
    leftRightPositionInput: LeftRightPixelPercentPositionInput;

    get contents(){
        return [this.leftRightPositionInput, new SpaceSurface(), this.topBottomPositionInput];
    }

}

export abstract class SquareDimensionPositionRibbonSection extends RibbonContentSection {
    label = "position";

    abstract leftRightPosition: IPixelPercentRange;
    abstract topBottomPosition: IPixelPercentRange;

    @create(function(this: SquareDimensionPositionRibbonSection){
        return new TopBottomPixelPercentRangeInput(this.topBottomPosition);
    })
    topBottomPositionInput: TopBottomPixelPercentRangeInput;

    @create(function(this: SquareDimensionPositionRibbonSection){
        return new LeftRightPixelPercentRangeInput(this.leftRightPosition);
    })
    leftRightPositionInput: LeftRightPixelPercentRangeInput;

    getContents(){
        return [this.leftRightPositionInput, new SpaceSurface(), this.topBottomPositionInput];
    }

    get contents(){
        return this.getContents();
    }

}

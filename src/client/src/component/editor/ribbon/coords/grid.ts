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
 
import {SquareDimensionPositionRibbonSection} from "../blocks/position/ribbon";
import {GridSettings} from "../../../echart/settings/coordinates/grid";
import {create, define, init, inject} from "../../../../../../di";
import {IPixelPercentRange} from "../../../echart/settings/position";
import {SpaceSurface, TripleSurface} from "../blocks/surface";
import {CheckboxInput} from "../blocks/checkbox";
import {RibbonContentSection} from "../base";
import {TooltipBlock} from "../blocks/tooltip";
import {HistoryTextInput} from "../blocks/input";

export class GridPart {

    constructor(selectedCoordinate: GridSettings){
        this.selectedCoordinate = selectedCoordinate;
    }

    @define
    selectedCoordinate: GridSettings;

    @create(() => new GridPositionRibbonSection())
    position: GridPositionRibbonSection;

    @create(() => new GridGeneralRibbonSection())
    general: GridGeneralRibbonSection;

    get contents(): RibbonContentSection[]{
        return [this.general, this.position];
    }

}

export class GridGeneralRibbonSection extends RibbonContentSection{

    @inject
    selectedCoordinate: GridSettings;

    @create(function(this: GridGeneralRibbonSection){
        var r = new HistoryTextInput();
        r.label = "Name";
        r.r_value = this.selectedCoordinate.r_name;
        return r;
    })
    name: HistoryTextInput;

    get contents(){
        return [this.tripleSurface({
            top: this.name
        })];
    }

}

export class GridPositionRibbonSection extends SquareDimensionPositionRibbonSection {

    @define
    itemName = "coordinate system"

    @inject
    selectedCoordinate: GridSettings;

    @create(() => new ContainLabelTriple())
    containLabel: ContainLabelTriple;

    @create(function(this: GridPositionRibbonSection){
        return this.selectedCoordinate.xPosDefault;
    })
    leftRightPosition: IPixelPercentRange;

    @create(function(this: GridPositionRibbonSection){
        return this.selectedCoordinate.yPosDefault;
    })
    topBottomPosition: IPixelPercentRange;

    getContents(){
        return super.getContents().concat([new SpaceSurface(),this.containLabel]);
    }

}

export class ContainLabelTriple extends TripleSurface{

    @create(() => new ContainLabelCheckbox())
    containLabel: ContainLabelCheckbox;

    @init
    init(){
        this.top = this.containLabel;
    }

}

export class ContainLabelCheckbox extends CheckboxInput {

    label = "include axes"

    @inject
    selectedCoordinate: GridSettings;

    get value(){
        return this.selectedCoordinate.containLabel;
    }

    set value(v){
        this.selectedCoordinate.containLabel = v;
    }

    tooltip = new TooltipBlock({title: "Include axes", content: `If checked, will put the axis labels inside the coordinate System, otherwise outside. 
    If inside, the coordinate system will include the axes when calculating its dimensions.`})

}

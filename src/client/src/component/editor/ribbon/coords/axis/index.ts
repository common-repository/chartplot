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
 
import {RibbonContentSection, RibbonTab} from "../../base";
import {AxisCollectionSelection} from "./collection";
import {create, define, factory, inject} from "../../../../../../../di";
import {EditorSettings} from "../../../settings";
import {RibbonOptions} from "../../../settings/options/ribbon";
import {GridSettings} from "../../../../echart/settings/coordinates/grid";
import {AxisSelectedPart} from "./selected";
import {GridAxis} from "../../../../echart/settings/coordinates/grid/axis";
import {TooltipBlock} from "../../blocks/tooltip";

export class AxisRibbonTab extends RibbonTab {

    name = "Axes"

    @inject
    editorSettings: EditorSettings;

    constructor(coordinate: GridSettings){
        super();
        this.coordinate = coordinate;
    }

    @define
    public coordinate: GridSettings;

    @create(function(this: AxisRibbonTab){
        return new AxisCollectionSelection();
    })
    collection: AxisCollectionSelection;

    get contents(){
        let res: RibbonContentSection[] =  [this.collection.ribbonSection];
        const axis = this.collection.selectList.selectedItem;
        if (axis){
            return res.concat(this.createAxisPart(axis).contents);
        }
        return res;
    }

    @factory
    createAxisPart(axis: GridAxis){
        return new AxisSelectedPart(axis);
    }

    activate(){
        this.editorSettings.options.chart.editMode = "axis";
    }

    additionalIndexes = [RibbonOptions.COORDINATE_RIBBON_INDEX];

    tooltip = new TooltipBlock({title: 'Cartesian axes menu', content: 'Manage the axes of the cartesian coordinate here. Each cartesian coordinate needs to have at least one x- and y-Axis.'})

}

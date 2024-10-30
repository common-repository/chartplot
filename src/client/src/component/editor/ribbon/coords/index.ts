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
 
import {RibbonContentSection, RibbonTab} from "../base";
import {CoordinateCollectionSelection} from "./collection";
import {create, factory, inject} from "../../../../../../di";
import {EditorSettings} from "../../settings";
import {GridSettings} from "../../../echart/settings/coordinates/grid";
import {GridGeneralRibbonSection, GridPart} from "./grid";
import {ICoordinateSettings} from "../../../echart/settings/coordinates";
import {TooltipBlock} from "../blocks/tooltip";

export class CoordinatesRibbonTab extends RibbonTab{

    name = "Coordinate"

    @create(() => new CoordinateCollectionSelection())
    collection: CoordinateCollectionSelection;

    @inject
    editorSettings: EditorSettings;

    get contents(){
        let res: RibbonContentSection[] = [this.collection.ribbonSection];
        const sel = <ICoordinateSettings>this.collection.selectList.selectedItem;
        if (sel){
            switch(sel.type){
                case "grid":
                    res = res.concat(this.createGridPart(<GridSettings>sel).contents)
                    break;
            }
        }
        return res;
    }

    @factory
    createGridPart(grid: GridSettings){
        return new GridPart(grid);
    }

    activate(){
        this.editorSettings.options.chart.editMode = "coordinate";
    }

    tooltip = new TooltipBlock({title: "Coordinate menu", content: {
        tag: "html",
        child: `
<p>
Some series types, like 'line', 'scatter' or 'candlestick', need a coordinate system in order to be rendered. 
You can define the coordinate systems here. 
</p>
        `
        }})

}

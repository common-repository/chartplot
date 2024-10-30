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
 
import {EditorSettings} from "../../settings";
import {create, init, inject} from "../../../../../../di";
import {variable} from "../../../../../../reactive";
import {ICoordinateSettings} from "../../../echart/settings/coordinates";
import {RibbonSelectButton} from "../blocks";
import {getIconShape, IconSet} from "../../../icon";
import {IconLabelSelectListItem, SelectList} from "../../../list/select";
import {executeInAnimationFrame} from "../../../../../../reactive/src/procedure";
import {IReactiveVariable} from "../../../../../../reactive/src/variable";
import {addButtonTooltip, ChartCollection, ListItem, SelectedItemList} from "../blocks/collection";

export class CoordinateCollectionSelection extends ChartCollection{

    constructor(){
        super();
        this.elementName = 'coordinate system';
    }

    @inject
    editorSettings: EditorSettings;

    @create(function(this: CoordinateCollectionSelection){
        return this.editorSettings.chart.coordinates.coordinates;
    })
    collection

    @create(function(this: CoordinateCollectionSelection){
        return this.editorSettings.options.coordinates.r_selected;
    })
    selectedIndex

    @create(function(this: CoordinateCollectionSelection){
        return new SelectedCoordinate();
    })
    selectList: SelectedCoordinate;

    @create(() => new CoordinateAddButton())
    add: CoordinateAddButton;

    label = "Coordinates";
    

}

class CoordinateAddButton extends RibbonSelectButton{

    icon = getIconShape(IconSet.plus);

    label = "Add"

    @inject
    collection: CoordinateCollectionSelection;

    @inject
    editorSettings: EditorSettings

    @inject
    selectedIndex: IReactiveVariable<number>;

    @inject
    selectList: SelectedCoordinate;

    @inject
    elementName: any;

    getContent(){
        const dropwdown = new SelectList();
        dropwdown.items.push(new IconLabelSelectListItem("Cartesian",getIconShape(IconSet.bar_chart)).setAction(ev => {
            const ni = this.editorSettings.chart.coordinates.addNewGrid(this.selectedIndex.value + 1);
            this.selectedIndex.value = ni;
            executeInAnimationFrame(f => {
                this.selectList.scrollTo(this.selectedIndex.value);
            });
        }));
        return dropwdown;
    }

    getClass(){
        return super.getClass();
    }

    @init
    init() {
        super.init();
        this.tooltip = addButtonTooltip(this.elementName, `You can add following coordinate systems
        <ul class="bullet">
        <li><b>Cartesian:</b> Coordinate system with an orthogonal x- and y-axis. Used for categorical, linear or candlestick charts.</li>
        </ul>
        <p>* More to come in future releases</p>
        `);
    }

}


class CoordinateListItem extends ListItem{


    item: ICoordinateSettings;
    public r_selected = variable<boolean>(false);

    get icon(){
        return this.item && this.item.icon;
    }


}

export class SelectedCoordinate extends SelectedItemList{

    createListItem(item, selected){
        return new CoordinateListItem(item, selected);
    }

}

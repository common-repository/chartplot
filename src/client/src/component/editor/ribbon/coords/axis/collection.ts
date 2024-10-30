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
 
import {variable} from "../../../../../../../reactive";
import {create, init, inject} from "../../../../../../../di";
import {EditorSettings} from "../../../settings";
import {GridAxis} from "../../../../echart/settings/coordinates/grid/axis";
import {IReactiveArray} from "../../../../../../../reactive/src/array";
import {IReactiveVariable, IVariable} from "../../../../../../../reactive/src/variable";
import {GridSettings} from "../../../../echart/settings/coordinates/grid";
import {RibbonSelectButton} from "../../blocks";
import {getIconShape, IconSet} from "../../../../icon";
import {IconLabelSelectListItem, SelectList} from "../../../../list/select";
import {executeInAnimationFrame} from "../../../../../../../reactive/src/procedure";
import {addButtonTooltip, ChartCollection, ListItem, SelectedItemList} from "../../blocks/collection";

export class AxisCollectionSelection extends ChartCollection{

    constructor(){
        super();
        this.elementName = "Axis";
    }

    @inject
    editorSettings: EditorSettings;

    @inject
    coordinate: GridSettings;

    @create(function(this: AxisCollectionSelection){
        return this.coordinate.axes.axes;
    })
    collection: IReactiveArray<GridAxis>

    @create(function(this: AxisCollectionSelection){
        return this.editorSettings.options.coordinates.axes.r_selected;
    })
    selectedIndex: IVariable<number>;

    @create(function(this: AxisCollectionSelection){
        return new SelectedAxis();
    })
    selectList: SelectedAxis;

    @create(() => new AddAxis())
    add;

    label = "Cartesian axes"

}


class AxisListItem extends ListItem{

    item: GridAxis;
    public r_selected = variable<boolean>(false);

    get icon(){
        return this.item && this.item.getIcon();
    }

}

export class SelectedAxis extends SelectedItemList{

    createListItem(item, selected){
        return new AxisListItem(item, selected);
    }

}

class AddAxis extends RibbonSelectButton{

    label = "Add";

    icon = getIconShape(IconSet.plus);

    @inject
    editorSettings: EditorSettings

    @inject
    selectedIndex: IReactiveVariable<number>;

    @inject
    selectList: SelectedAxis;

    @inject
    coordinate: GridSettings;

    @inject
    elementName;

    @init
    init(){
        super.init();
        this.tooltip = addButtonTooltip(this.elementName);
    }

    getContent(){
        const dropwdown = new SelectList();
        dropwdown.items.push(new IconLabelSelectListItem("X-Axis",getIconShape(IconSet.x_axis)).setAction(ev => {
            const ni = this.coordinate.axes.addNewAxis("x", this.selectedIndex.value + 1);
            this.selectedIndex.value = ni;
            executeInAnimationFrame(f => {
                this.selectList.scrollTo(this.selectedIndex.value);
            });
        }));
        dropwdown.items.push(new IconLabelSelectListItem("Y-Axis",getIconShape(IconSet.y_axis)).setAction(ev => {
            const ni = this.coordinate.axes.addNewAxis("y", this.selectedIndex.value + 1);
            this.selectedIndex.value = ni;
            executeInAnimationFrame(f => {
                this.selectList.scrollTo(this.selectedIndex.value);
            });
        }));
        return dropwdown;
    }

}

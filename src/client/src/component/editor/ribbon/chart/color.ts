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
 
import {ListItem, ListRibbonSection, SelectedItemList} from "../blocks/collection/list";
import {create, inject} from "../../../../../../di";
import {EditorSettings} from "../../settings";
import {Editor} from "../../index";
import {variable} from "../../../../../../reactive";
import {ColorInputButton} from "../blocks/input/color";
import {EChartSettings} from "../../../echart/settings";
import {InsertArrayItemCommand} from "../../../history/array";
import {getIconShape, IconSet} from "../../../icon";
import {IVariable} from "../../../../../../reactive/src/variable";
import {executeInAnimationFrame} from "../../../../../../reactive/src/procedure";

export class ChartColorCollectionSelection extends ListRibbonSection{

    label = "color palette";

    @create(() => new ChartColorAddButton())
    add: ChartColorAddButton;

    @inject
    editorSettings: EditorSettings;

    @create(function(this: ChartColorCollectionSelection){
        return this.editorSettings.chart.color;
    })
    collection

    @create(function(this: ChartColorCollectionSelection){
        return variable(0);
    })
    selectedIndex

    @create(function(this: ChartColorCollectionSelection){
        return new SelectedChartColor();
    })
    selectList: SelectedChartColor;


}


class ChartColorListItem extends ListItem{


    item: string;

    get icon(){
        return null;
    }

    get content(){
        const self = this;
        return {
            tag: "div",
            child: [{
                tag: "div",
                get style(){
                    var style = {
                        background: self.item,
                        width: "0.75rem",
                        height: "0.75rem",
                        display: "inline-block"
                    }
                    return style;
                }
            }, " "+this.item]
        };
    }

    processNode(shape){
        shape.style = {
            minWidth: "1rem"
        }
    }


}

export class SelectedChartColor extends SelectedItemList{

    @inject
    editor: Editor;

    @inject
    editorSettings: EditorSettings;

    selectedItem: string;

    createListItem(item, selected){
        return new ChartColorListItem(item, selected);
    }

}

class ChartColorAddButton extends ColorInputButton{

    @inject
    settings: EChartSettings;

    @inject
    editor: Editor

    @inject
    selectedIndex: IVariable<number>;

    showDropDownIcon = false;

    r_color = variable(null);

    get icon(){
        return getIconShape(IconSet.plus);
    }

    getOkLabel(){
        return "Add";
    }

    applyColor(){
        const indx = Math.max(0, Math.min(this.selectedIndex.value + 1, this.settings.color.length));
        this.history.executeCommand(new InsertArrayItemCommand(this.settings.color, this.color, indx));
        this.editor.menu.ribbon.chart.color.selectList.selectedIndex.value = indx;
        executeInAnimationFrame(f => {
            this.editor.menu.ribbon.chart.color.selectList.scrollTo(indx);
        });
    }

    getClass(){
        return super.getClass()+" bg-white-col";
    }



}

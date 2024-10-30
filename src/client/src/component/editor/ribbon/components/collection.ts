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
 
import {create, define, init, inject} from "../../../../../../di";
import {EditorSettings} from "../../settings";
import {IComponentSettings} from "../../../echart/settings/components";
import {Editor} from "../../index";
import {RibbonSelectButton} from "../blocks";
import {getIconShape, IconSet} from "../../../icon";
import {IReactiveVariable} from "../../../../../../reactive/src/variable";
import {executeInAnimationFrame} from "../../../../../../reactive/src/procedure";
import {IconLabelSelectListItem, SelectList} from "../../../list/select";
import {
    AddButton as BasicAddButton,
    addButtonTooltip,
    ChartCollection,
    ListItem,
    SelectedItemList
} from "../blocks/collection";

export class ComponentCollectionSelection extends ChartCollection{

    constructor(){
        super();
        this.elementName = "component";
    }

    @create(() => new AddButton())
    add: AddButton;

    @inject
    editorSettings: EditorSettings;

    @create(function(this: ComponentCollectionSelection){
        return this.editorSettings.chart.components.components;
    })
    collection

    @create(function(this: ComponentCollectionSelection){
        return this.editorSettings.options.components.r_selected;
    })
    selectedIndex

    @create(function(this: ComponentCollectionSelection){
        return new SelectedComponent();
    })
    selectList: SelectedComponent;

    label = "Components";

}


class ComponentListItem extends ListItem{


    item: IComponentSettings;

    get icon(){
        return this.item && this.item.icon;
    }

}

class AddButton extends RibbonSelectButton{

    tooltip = BasicAddButton.prototype.tooltip

    label = "Add";

    icon = getIconShape(IconSet.plus);

    @inject
    collection: ComponentCollectionSelection;

    @inject
    editorSettings: EditorSettings

    @inject
    selectedIndex: IReactiveVariable<number>;

    @inject
    selectList: SelectedComponent;

    @inject
    chartCollection: ChartCollection;

    @inject
    elementName = 'item';

    getContent(){
        const dropwdown = new SelectList();
        dropwdown.items.push(new IconLabelSelectListItem("Title",getIconShape(IconSet.title)).setAction(ev => {
            const ni = this.editorSettings.chart.components.insertComponent({type: "title"},this.selectedIndex.value + 1);
            this.selectedIndex.value = ni;
            executeInAnimationFrame(f => {
                this.selectList.scrollTo(this.selectedIndex.value);
            });
        }));
        dropwdown.items.push(new IconLabelSelectListItem("Legend",getIconShape(IconSet.list)).setAction(ev => {
            const ni = this.editorSettings.chart.components.insertComponent({type: "legend", name: "Legend "+(this.selectList.items.length + 1)},this.selectedIndex.value + 1);
            this.selectedIndex.value = ni;
            executeInAnimationFrame(f => {
                this.selectList.scrollTo(this.selectedIndex.value);
            });
        }));
        return dropwdown;
    }

    @init
    init(){
        super.init();
        this.tooltip = addButtonTooltip(this.elementName, `
You can add following components: 

<ul class="bullet">
<li><b>Title:</b> Displays the chart title. Can also display arbitrary text.</li>
<li><b>Legend:</b> Displays a legend with all series of the chart.</li>
</ul>

<p>* More to come in future releases</p>
        `);
    }

}

export class SelectedComponent extends SelectedItemList{

    @inject
    editor: Editor;

    @inject
    editorSettings: EditorSettings;

    selectedItem: IComponentSettings;

    createListItem(item, selected){
        return new ComponentListItem(item, selected);
    }

    @init
    init(){
        super.init();
        this.onClick.observe(selected => {
            let index = selected.index;
            const selComp = <IComponentSettings>this.collection.get(index);
            index = this.editorSettings.chart.components.getRelativeIndexForComponent(selComp);
            const echartComp = this.editor.chartPreview.chartSelection.selector.chartComponentIndex.getComponent(selComp.type, index);
            this.editor.chartPreview.chartSelection.selected = echartComp;
        });
    }

}

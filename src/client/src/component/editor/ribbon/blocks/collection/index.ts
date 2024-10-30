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
 
import {component, create, define, init, inject} from "../../../../../../../di";
import {ChartHistory, HistoryCommandGroup} from "../../../../history";
import {IReactiveArray} from "../../../../../../../reactive/src/array";
import {IVariable} from "../../../../../../../reactive/src/variable";
import {NormalRibbonButton} from "../../blocks";
import {InsertArrayItemCommand, MoveArrayItemCommand, RemoveArrayItemCommand} from "../../../../history/array";
import {ValueHistory} from "../../../../history/value";
import {getIconShape, IconSet} from "../../../../icon";
import {TripleSurface} from "../../blocks/surface";
import {RibbonContentSection} from "../../base";
import {AbstractSelectList, ISelectListItem} from "../../blocks/list";
import {procedure, variable} from "../../../../../../../reactive";
import {LeftContentSettingsSection} from "../../../content/left";
import {TooltipBlock} from "../tooltip";

export class UpButton extends NormalRibbonButton{

    icon = getIconShape(IconSet.arrow_thick_up)

    @inject
    elementName

    label = "move up"

    @inject
    history: ChartHistory;

    @inject
    selectedIndex: IVariable<number>;

    @inject
    collection: IReactiveArray<any>;

    @init
    init() {
        super.init();
        this.onClick.observe(c => {
            const sel = this.selectedIndex.value;
            const serColl = this.collection;
            if (sel >= 1 && sel < serColl.length) {
                this.history.executeCommand(new HistoryCommandGroup([new MoveArrayItemCommand(serColl, sel, sel - 1),
                    new ValueHistory(this.selectedIndex, sel - 1)]));
            }
        });
        const self = this;
        this.tooltip = new TooltipBlock({
            title: "Move up",
            content: `Moves the currently selected ${self.elementName} up in the list.`
        });
    }

}

export class DownButton extends NormalRibbonButton {

    icon = getIconShape(IconSet.arrow_thick_down);

    label = "move down"

    @inject
    elementName

    @inject
    history: ChartHistory;

    @inject
    selectedIndex: IVariable<number>;

    @inject
    collection: IReactiveArray<any>;

    @init
    init(){
        super.init();
        this.onClick.observe(c => {
            const sel = this.selectedIndex.value;
            const serColl = this.collection;
            if (sel >= 0 && sel < serColl.length - 1){

                this.history.executeCommand(new HistoryCommandGroup([new MoveArrayItemCommand(serColl, sel, sel + 1),
                    new ValueHistory(this.selectedIndex, sel + 1)]));
            }
        });
        this.tooltip = new TooltipBlock({title: "Move down", content: `Moves the currently selected ${this.elementName} down in the list.`});
    }



}

export class RemoveButton extends NormalRibbonButton {

    icon = getIconShape(IconSet.bin)

    label = "delete"

    @inject
    elementName

    @inject
    history: ChartHistory;

    @inject
    selectedIndex: IVariable<number>;

    @inject
    collection: IReactiveArray<any>;

    getClass(){
        return super.getClass()+" red";
    }

    @init
    init(){
        super.init();
        this.onClick.observe(c => {
            const sel = this.selectedIndex.value;
            const serColl = this.collection;
            if (sel >= 0 && sel < serColl.length){
                const newSelIndex = Math.max(0, Math.min(serColl.length - 2, this.selectedIndex.value));
                this.history.executeCommand(new HistoryCommandGroup([new RemoveArrayItemCommand(serColl, sel),
                    new ValueHistory(this.selectedIndex, newSelIndex)]));

            }
        });
        this.tooltip = new TooltipBlock({title: "Delete", content: `Removes the currently selected ${this.elementName} from the list.`});
    }

}

export class AddButton extends NormalRibbonButton{

    icon = getIconShape(IconSet.plus);

    label = "Add";

    @inject
    elementName

    @init
    init() {
        super.init();
        this.tooltip = addButtonTooltip(this.elementName);
    }

}

export function addButtonTooltip(elementName: string, additional = ''){
    return new TooltipBlock({
        title: `Add new ${elementName}`,
        content: {
            tag: "html",
            child: `<p>Adds a new ${elementName} below the currently selected ${elementName}.</p>${additional}`
        }
    });
}

export class CloneButton extends NormalRibbonButton{

    icon = getIconShape(IconSet.content_copy);

    label = "Clone";

    @inject
    elementName

    @inject
    history: ChartHistory;

    @inject
    selectedIndex: IVariable<number>;

    @inject
    collection: IReactiveArray<any>;

    @init
    init() {
        super.init();
        this.onClick.observe(c => {
            const sel = this.selectedIndex.value;
            const serColl = this.collection;
            if (sel >= 0 && sel < serColl.length) {
                const newSelIndex = sel + 1;
                var selected = serColl.get(sel);
                this.history.executeCommand(new HistoryCommandGroup([new InsertArrayItemCommand(this.collection, selected.clone(), sel),
                    new ValueHistory(this.selectedIndex, newSelIndex)]));

            }
        });
        this.tooltip = new TooltipBlock({
            title: "Clone",
            content: `Clones the currently selected ${this.elementName}.`
        });
    }

}

export class CollectionModifySection extends TripleSurface{

    @inject
    add: AddButton;

    @create(() => new CloneButton())
    clone: CloneButton;

    @create(() => new RemoveButton())
    remove: RemoveButton;

    get top(){
        return this.add;
    }

    get middle(){
        return this.clone;
    }

    get bottom(){
        return this.remove;
    }

}

export class CollectionRightSection extends TripleSurface{

    @create(() => new UpButton())
    up: UpButton;

    @create(() => new DownButton())
    down: DownButton;

    get top(){
        return this.up;
    }

    get middle(){
        return this.down;
    }

}

export class ListRibbonSection extends RibbonContentSection{

    label = "collection"

    @create(() => new CollectionModifySection())
    modify: CollectionModifySection;

    @create(() => new CollectionRightSection())
    right: CollectionRightSection;

    get contents(){
        return [this.modify, this.right];
    }

    @inject
    elementName

    @init
    init(){
        this.tooltip = new TooltipBlock({title: `Manage ${this.elementName} collection`, content: `Controls to manipulate your collection of ${this.elementName}`});
    }

}

export abstract class ListItem implements ISelectListItem{

    constructor(public item: any, public selectedItem: SelectedItemList){

    }

    abstract icon: any;

    public r_selected = variable<boolean>(false);

    get selected(){
        return this.item === this.selectedItem.selectedItem;
    }

    get content(){
        return (<any>this.item).name || "no name";
    }

}

export abstract class SelectedItemList extends AbstractSelectList{

    @inject
    selectedIndex: IVariable<number>;

    @inject
    collection: IReactiveArray<any>;

    public r_selectedItem = variable<any>(null);

    get selectedItem(){
        return this.r_selectedItem.value;
    }

    set selectedItem(v){
        this.r_selectedItem.value = v;
    }

    get label(){
        return this.r_selectedItem && (<any>this.r_selectedItem).name || "none";
    }

    abstract createListItem(item, selectedItem: SelectedItemList): ListItem;

    getClass(){
        return super.getClass()+" content-select-list";
    }

    get items(){
        const res: ISelectListItem[] = [];
        this.collection.values.forEach((ser, indx) => {
            res.push(this.createListItem(ser, this));
        });
        return res;
    }

    getSelectedItem(){
        const l = this.collection.length;
        if (l > 0){
            let sel = this.selectedIndex.value;
            return this.collection.get(sel);
        }
        return null;
    }

    @init
    init(){
        procedure(() => {
            this.selectedItem = this.getSelectedItem();
        });
        this.onClick.observe(ser => {
            this.selectedIndex.value = ser.index;
        });
    }

    onAttached(){
        super.onAttached();
        this.scrollTo(this.selectedIndex.value);
    }

}

@component("chartCollection")
export abstract class ChartCollection{

    @create(() => new AddButton())
    add: NormalRibbonButton;

    @define
    elementName = 'item';

    abstract collection: IReactiveArray<any>;
    abstract selectedIndex: IVariable<number>;
    abstract selectList: SelectedItemList;
    abstract label: any;

    @create(() => new ListRibbonSection())
    ribbonSection: ListRibbonSection;

    @create(function(this: ChartCollection){
        var r = new LeftContentSettingsSection();
        r.label = this.label;
        r.content = this.selectList;
        return r;
    })
    section: LeftContentSettingsSection;

}

ChartCollection.prototype.elementName = 'item';

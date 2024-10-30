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
 
import {component, create, factory, init, inject} from "../../../../../../../di";
import {ChartHistory, HistoryCommandGroup} from "../../../../history";
import {IReactiveArray} from "../../../../../../../reactive/src/array";
import {IVariable} from "../../../../../../../reactive/src/variable";
import {NormalRibbonButton} from "../../blocks";
import {MoveArrayItemCommand, RemoveArrayItemCommand} from "../../../../history/array";
import {ValueHistory} from "../../../../history/value";
import {getIconShape, IconSet} from "../../../../icon";
import {TripleSurface} from "../../blocks/surface";
import {RibbonContentSection} from "../../base";
import {AbstractSelectList, ISelectListItem} from "../../blocks/list";
import {procedure, variable} from "../../../../../../../reactive";
import {DownOutsideEventFirer, SinglePopupSystem} from "../../../../popup";
import {Editor} from "../../../index";

export class UpButton extends NormalRibbonButton{

    icon = getIconShape(IconSet.arrow_thick_up)

    @inject
    history: ChartHistory;

    @inject
    selectedIndex: IVariable<number>;

    @inject
    collection: IReactiveArray<any>;

    @init
    init(){
        this.onClick.observe(c => {
            const sel = this.selectedIndex.value;
            const serColl = this.collection;
            if (sel >= 1 && sel < serColl.length){

                this.history.executeCommand(new HistoryCommandGroup([new MoveArrayItemCommand(serColl, sel, sel - 1),
                    new ValueHistory(this.selectedIndex, sel - 1)]));
            }
        });
    }

    getClass(){
        return super.getClass()+" bg-white-col";
    }

}

export class DownButton extends NormalRibbonButton {

    icon = getIconShape(IconSet.arrow_thick_down);

    @inject
    history: ChartHistory;

    @inject
    selectedIndex: IVariable<number>;

    @inject
    collection: IReactiveArray<any>;

    @init
    init(){
        this.onClick.observe(c => {
            const sel = this.selectedIndex.value;
            const serColl = this.collection;
            if (sel >= 0 && sel < serColl.length - 1){

                this.history.executeCommand(new HistoryCommandGroup([new MoveArrayItemCommand(serColl, sel, sel + 1),
                    new ValueHistory(this.selectedIndex, sel + 1)]));
            }
        });
    }

    getClass(){
        return super.getClass()+" bg-white-col";
    }

}

export class RemoveButton extends NormalRibbonButton {

    icon = getIconShape(IconSet.bin)

    @inject
    history: ChartHistory;

    @inject
    selectedIndex: IVariable<number>;

    @inject
    collection: IReactiveArray<any>;

    getClass(){
        return super.getClass()+" bg-white-col red";
    }

    @init
    init(){
        this.onClick.observe(c => {
            const sel = this.selectedIndex.value;
            const serColl = this.collection;
            if (sel >= 0 && sel < serColl.length){
                const newSelIndex = Math.max(0, Math.min(serColl.length - 2, this.selectedIndex.value));
                this.history.executeCommand(new HistoryCommandGroup([new RemoveArrayItemCommand(serColl, sel),
                    new ValueHistory(this.selectedIndex, newSelIndex)]));
            }
        });
    }

}

export class AddButton extends NormalRibbonButton{

    icon = getIconShape(IconSet.plus);

    getClass(){
        return super.getClass()+" bg-white-col";
    }

}

export class CloneButton extends NormalRibbonButton{

    icon = getIconShape(IconSet.content_copy);

    getClass(){
        return super.getClass()+" bg-white-col";
    }

}

export class ExpandButton extends NormalRibbonButton{

    get icon(){
        return this.ribbonSection.expanded ? getIconShape(IconSet.expand_less) : getIconShape(IconSet.expand_more);
    }


    @inject
    popupSystem: SinglePopupSystem;

    @inject
    ribbonSection: ListRibbonSection;

    getClass(){
        return super.getClass()+" bg-white-col";
    }

    @init
    init(){
        this.onClick.observe(c => {
            this.ribbonSection.expanded = !this.ribbonSection.expanded;
        });
        super.init();
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

    @create(() => new ExpandButton())
    expand: ExpandButton;

    get top(){
        return this.up;
    }

    get middle(){
        return this.down;
    }

    get bottom(){
        return this.expand;
    }

}

@component("ribbonSection")
export abstract class ListRibbonSection extends RibbonContentSection{

    label = "collection"

    abstract collection: IReactiveArray<any>;
    abstract selectedIndex: IVariable<number>;
    abstract selectList: SelectedItemList;

    @inject
    editor: Editor;

    public r_expanded = variable(false);

    get expanded(){
        return this.r_expanded.value;
    }

    set expanded(v){
        this.r_expanded.value = v;
    }

    @create(() => new CollectionModifySection())
    modify: CollectionModifySection;

    @create(() => new AddButton())
    add: AddButton;

    @create(() => new CollectionRightSection())
    right: CollectionRightSection;

    @factory
    createOutsideEventListener(element: HTMLElement, onClose: () => void){
        return new DownOutsideEventFirer(element, onClose);
    }

    get contents(){
        const self = this;
        if (this.expanded){
            return {
                tag: "div",
                attr: {
                    class: "expanded-list-selection"
                },
                onAttached: function(){
                    var recalc = () => {
                        var el = this.node.element;
                        var bcr = el.getBoundingClientRect();
                        var cel = el.childNodes[0];
                        cel.style.top = bcr.top+"px";
                        cel.style.left = bcr.left+"px";
                    }
                    recalc();
                    this.resize = () => {
                        recalc();
                    }
                    self.editor.resizeComponents.onResize.observe(this.resize);

                },
                onDetached: function(){
                    self.editor.resizeComponents.onResize.unobserve(this.resize);
                },
                child: {
                    tag: "div",
                    attr: {class: "list-selection-container"},
                    child: [{
                        tag: "div",
                        child: [this.modify, this.right],
                        attr: {
                            class: "controls"
                        }
                    }, this.selectList],
                    onAttached: function(){
                        this.firer = self.createOutsideEventListener(this.node.element, () => {
                            self.expanded = false;
                        });
                    },
                    onDetached: function(){
                        this.firer.close();
                    }
                }
            }
        }
        return [this.modify, this.selectList, this.right];
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
        this.scrollTo(this.selectedIndex.value);
    }

}

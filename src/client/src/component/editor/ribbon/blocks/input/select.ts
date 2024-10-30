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
 
import {factory, inject} from "../../../../../../../di";
import {IPopupSettings, PopupSurface, SinglePopupSystem} from "../../../../popup";
import {IHtmlShapeTypes} from "../../../../../../../html/src/html/node";
import {variable} from "../../../../../../../reactive";

export class SelectPopup{

    closeOn: PopupSurface['closeOn'] = "click";
    placement: string;
    public r_popup = variable<PopupSurface>(null);

    get popup(){
        return this.r_popup.value;
    }

    set popup(v){
        this.r_popup.value = v;
    }
    created = false;

    @inject
    popupSystem: SinglePopupSystem;

    @factory
    createSurface(settings: IPopupSettings){
        return this.popupSystem.createPopup(settings);
    }

    clicked(target: Element, content: (popup: PopupSurface) => IHtmlShapeTypes | IHtmlShapeTypes[]){
        if (this.created){
            return false;
        }
        var popup = this.createSurface({
            content: (popup) => {
                this.popup = popup;
                return content(popup);
            },
            target: target,
            closeOn: this.closeOn
        });
        this.popup = popup;
        if (this.placement){
            this.popup.placement = this.placement;
        }
        popup.attach();
        this.created = true;
        this.popup.onClosed.observe(closed => {
            this.created = false;
            this.popup = null;
        });
        return true;
    }

}

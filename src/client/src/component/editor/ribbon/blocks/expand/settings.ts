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
 
import {RibbonSinglePopupSystem, SinglePopupSystem} from "../../../../popup";
import {create} from "../../../../../../../di";

export class ExpandedSettings{

    @create(() => {
        var p = new RibbonSinglePopupSystem();
        p.layer = 1;
        return p;
    })
    popupSystem: RibbonSinglePopupSystem;

    tag = "div";

    attr = {
        class: "expanded-settings"
    }

    child: any[] = [];

    section(label: any){
        var section = new SettingsSection();
        section.label = label;
        this.child.push(section);
        return section;
    }
}

export class SettingsSection{

    label: any;

    tag = "div";

    attr = {
        class: "settings-section"
    }

    settings: SettingsRow[] = [];

    row(){
        var res = new SettingsRow();
        this.settings.push(res);
        return res;
    }

    get child(){
        return (<any[]>[{tag: "div", attr: {class: "title"}, child: this.label}]).concat(this.settings);
    }

}

export class SettingsRow{

    tag = "div";

    attr = {
        class: "settings-row"
    }

    child: any[] = [];

    item(element: any){
        this.child.push(element);
        return this;
    }

}

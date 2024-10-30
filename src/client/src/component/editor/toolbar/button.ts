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
 
import {variable} from "../../../../../reactive";

export abstract class ToolbarButton{

    tag: "div";
    attr: any;
    event: any;

    public r_selected = variable(false);

    get selected(){
        return this.r_selected.value;
    }

    set selected(v){
        this.r_selected.value = v;
    }

    public r_disabled = variable(false);

    get disabled(){
        return this.r_disabled.value;
    }

    set disabled(v){
        this.r_disabled.value = v;
    }

    abstract action(ev: Event);

    constructor(){
        this.event = {
            click: (ev) => {
                if (!this.disabled){
                    this.action(ev);
                }
            }
        }
        const self = this;
        this.attr = {
            get class(){
                var res = self.getClass();
                if (self.disabled){
                    res += " disabled";
                }
                if (self.selected){
                    res += " selected";
                }
                return res;
            }
        }
    }

    getClass(){
        return "toolbar-button";
    }

}

ToolbarButton.prototype.tag = "div";

export class ToolbarButtonGroup{

    tag: "div";
    attr: any;

}

ToolbarButtonGroup.prototype.tag = "div";
ToolbarButtonGroup.prototype.attr = {
    class: "toolbar-button-group"
}

export class ToolbarButtonDivider{
    tag: "div";
    attr: any;
}

ToolbarButtonDivider.prototype.tag = "div";
ToolbarButtonDivider.prototype.attr = {
    class: "toolbar-button-divider"
};

export class ToolbarButtonDropdown{

    tag: "div";
    attr: any;
    private button: _ToolbarDropdownButton;

    constructor(){
        this.attr = {
            class: "dropdown"
        }
        this.button = new _ToolbarDropdownButton(this);
    }

    get child(){
        const self = this;
        return [this.button, {
            tag: "div",
            attr: {
                class: "dropdown-menu"
            },
            get child(){
                return self.dropdownMenu();
            }
        }];
    }

    action(){

    }

    dropdownMenu(): any{
        return {
            tag: "div",
            child: "Hello world"
        }
    }

    buttonContent(): any{
        return "";
    }

}

ToolbarButtonDropdown.prototype.tag = "div";

export class _ToolbarDropdownButton extends ToolbarButton{

    constructor(public parent: ToolbarButtonDropdown){
        super();
        this.attr["data-toggle"] = "dropdown";
    }

    getClass(){
        return "toolbar-button dropdown-toggle";
    }

    action(){
        this.parent.action();
    }

    get child(){
        return this.parent.buttonContent();
    }

}

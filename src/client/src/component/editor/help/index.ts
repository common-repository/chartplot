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
 
import {MainPage} from "./pages/main";
import {create, init} from "../../../../../di";
import {HelpPage} from "./page";
import {variable} from "../../../../../reactive";
import {HelpMenu} from "./menu";

class Header{

}

export class HelpSystem {

    tag = "div";

    attr: any;

    @create(() => new MainPage())
    mainPage: MainPage;

    @create(() => new HelpMenu())
    menu: HelpMenu

    public r_loadedPage = variable<HelpPage>(null);

    get loadedPage(){
        return this.r_loadedPage.value;
    }

    set loadedPage(v){
        this.r_loadedPage.value = v;
    }


    constructor(){
        this.attr = {
            class: "help-container"
        }
    }

    loadPage(name: string[]){
        var p = this.mainPage;
        for (var i=0; i < name.length; i++) {
            var n = name[i];
            if (p.children){
                const c = p.children.filter(c => c.name === n);
                if (c.length > 0){
                    p = c[0];
                }
                else
                {
                    return;
                }
            }
            else
            {
                return;
            }
        };
        this.loadedPage = p;

    }

    @init
    init(){
        this.loadPage([]);
    }

    get child(){
        const self = this;
        const content = {
            tag: "div",
            attr: {
                class: "content"
            },
            get child(){
                return self.loadedPage ? self.loadedPage.content : "";
            }
        }
        return [this.menu, content];
    }

}

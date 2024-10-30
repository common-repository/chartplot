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
 
import {create} from "../../../../../di";
import {Templates} from "./templates";
import {variable} from "../../../../../reactive";
import {IntroHelp} from "./help";

export class ChartIntro{

    tag = "div";
    attr: any;

    @create(() => new Templates())
    template: Templates;

    @create(() => new IntroHelp())
    help: IntroHelp;

    public r_activeTab = variable("Templates");

    get activeTab(){
        return this.r_activeTab.value;
    }

    set activeTab(v){
        this.r_activeTab.value = v;
    }

    constructor(){
        this.attr = {
            class: "intro"
        }
    }

    tab(label: string){
        const self = this;
        return {
            tag: "li",
            event: {
                click: () => {
                    self.activeTab = label;
                }
            },
            attr: {class: "nav-item"},
            child: {tag: "a", attr: {get class(){
                var res = "nav-link";
                if (label === self.activeTab){
                    res = res + " active";
                }
                return res;
            }},
                child: label
            }
        }
    }

    get child(){
        const self = this;
        return [{
            tag: "ul",
            attr:{class: "nav nav-tabs"},
            child: [this.tab("Templates"),this.tab("Help")]
        },{
            tag: "div",
            attr:{class: "nav-content"},
            get child(){
                switch(self.activeTab){
                    case "Templates":
                        return self.template;
                    case "Help":
                        return self.help;
                    default:
                        return "";
                }
            }
        }]
    }

}

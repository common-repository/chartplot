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
 
import {getWordpressChartplotUrl} from "../../../../wordpress/path";
import {inject} from "../../../../../../di";
import {Editor} from "../../index";

export class Template{

    tag = "div";
    event: any;
    attr: any;

    @inject
    editor: Editor;

    constructor(public title: string, public img: string, public config: any){
        this.event = {
            click: () => {
                this.editor.editorSettings.applyConfig(this.config);
                this.editor.isIntro = false;
                this.afterSet();
            }
        }
        this.attr = {
            class: "card"
        }
    }

    protected afterSet(){

    }

    get child(){
        return [{
            tag: "div",
            attr: {class: "card-header"},
            child: this.title
        },{
            tag: "img",
            attr: {
                class: "card-img-top",
                src: getWordpressChartplotUrl()+"img/templates/"+this.img+".png"
            }
        }];
    }
}

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
 
import {component, create, init} from "../../../../di";
import {WordpressEditor} from "../editor";

declare var jQuery: any;

@component("dashboard")
export class Dashboard {

    tag = "div";

    @create(() => new WordpressEditor())
    public editor: WordpressEditor;

    get child(){
        const self = this;
        return {
            tag: "div",
            attr: {
                class: "postbox"
            },
            child: {
                tag: "div",
                attr: {
                    class: "inside"
                },
                style: {
                    height: "70vh",
                    position: "relative",
                    margin: "0px",
                    padding: "0px"
                },
                get child(){
                    return self.editor
                }
            }
        }
    }

    synchronizeContent(){
        const content = <HTMLInputElement>document.getElementById("content");
        const val = content.value;
        if (val){
            try{
                const contentConfig = JSON.parse(atob(val));
                this.editor.editorSettings.applyConfig(contentConfig);
                this.editor.isIntro = false;
            }catch (err) {
                console.error(err);
            }
        }
        else{
            this.editor.isIntro = true;
        }
    }

    @init
    init(){
        this.editor.start();
        this.synchronizeContent();
        const title = document.getElementById("title");
        this.editor.editorSettings.title = (<HTMLInputElement>title).value;
        title.addEventListener("change", (ev) => {
            this.editor.editorSettings.title = (<HTMLInputElement>ev.target).value;
        });

        document.getElementById("post").addEventListener("submit", () => {
            this.editor.save();
        });
    }

}

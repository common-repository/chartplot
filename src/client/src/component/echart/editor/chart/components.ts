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
 
import {variable} from '../../../../../../reactive';
import {IHtmlNodeShape} from "../../../../../../html/src/html/node";

export class ResizableSurfaceComponent{

    public tag: string;
    public style: any;
    public attr: any;
    public r_modus: any = variable({type: "max", width: 640, height: 480});
    public event: any;

    node: IHtmlNodeShape;

    constructor(public content: any){

    }

    public r_tdContent = variable(null);

    get tdContent(){
        return this.r_tdContent.value;
    }

    set tdContent(v){
        this.r_tdContent.value = v;
    }

    get modus(){
        return this.r_modus.value;
    }

    set modus(v){
        this.r_modus.value = v;
    }

    fullscreen(){
        this.modus = {type: "full"}
    }

    maxScreen(width, height){
        this.modus = {type: "max", width: width, height: height};
    }

    fixedScreen(width, height){
        this.modus = {type: "fixed", width: width, height: height};
    }

    get child(){
        const self = this;
        return {
            tag: "tbody",
            child: {tag: "tr", child: {tag: "td",
                    style: {
                        height: "100%",
                        width: "100%"
                    },
                    get child(){
                        var r = [{
                            tag: "div",
                            get style(){
                                switch(self.modus.type){
                                    case "full":
                                        return {
                                            width: "100%",
                                            height: "100%",
                                            position: "relative",
                                            padding: "10px"
                                        }
                                    case "max":
                                        return {
                                            maxWidth: self.modus.width+"px",
                                            maxHeight: self.modus.height+"px",
                                            position: "relative",
                                            height: "100%",
                                            margin: "auto",
                                            padding: "10px"
                                        }
                                    default:
                                        return {
                                            width: self.modus.width+20+"px",
                                            height: self.modus.height+20+"px",
                                            position: "relative",
                                            margin: "auto",
                                            padding: "10px"
                                        }
                                }
                            },
                            get child(){
                                return self.content;
                            }
                        }];
                        if (self.tdContent){
                            r.push(self.tdContent);
                        }
                        return r;
                    }
                }}
        }
    }

}

ResizableSurfaceComponent.prototype.tag = "table";
ResizableSurfaceComponent.prototype.attr = {
    class: "chart-table"
}

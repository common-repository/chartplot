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
 
import {IBaseShape} from "../../render";
import {IHTMLChildrenRenderer, IHtmlConfig, IHtmlNodeComponent} from "../node";
import {HTMLChildrenRenderer} from '../node/shape';
import {isNode} from "../../util";
import {createTextShape} from "../node/text";
import {IHtmlShape} from "../node/index";

export var svgns = "http://www.w3.org/2000/svg";

export function renderSVG(config: ISVGConfig | string | IBaseShape): IHtmlNodeComponent{
    if (isNode(config)){
        return <IHtmlNodeComponent>config;
    }
    if (typeof config !== "object")
    {
        return createTextShape({
            text: config
        });
    }
    var r =  createSVGShape(<ISVGConfig>config);
    return r;
}


export default renderSVG;

/**
 * A virtual dom element representing a svg element.
 */
export interface ISVGConfig extends IHtmlConfig{

}

/**
 * A virtual dom element node representing a svg element
 */
export interface ISvgShape extends IHtmlShape{
    element: SVGSVGElement;
}

interface ISVGChildrenRenderer extends IHTMLChildrenRenderer{

    element:SVGSVGElement;

}

export class SVGRenderer extends HTMLChildrenRenderer implements ISVGChildrenRenderer{

    public element:SVGSVGElement;
    public children: SVGRenderer[];

    constructor(config: IHtmlConfig) {
        super(config);
    }
    
    public renderChild(config: ISVGConfig){
        return <SVGRenderer>renderSVG(<any>config);
    }

    createElement(){
        var t = this.settings.tag;
        var r = createSvgElement(t);
        (<any>r)._fromContext = true;
        return r;
    }

}

export function createSvgElement(tag: string){
    var element = <SVGSVGElement> document.createElementNS(svgns, tag in svgGroupNodeNames ? "g" : tag);
    return element;
}

var svgGroupNodeNames = {
    g: "g",
    group: "g",
    div: "g",
    span: "g"
}

export function createSVGShape(config: ISVGConfig): ISvgShape{
    var r = new SVGRenderer(config);
    config.node = r;
    return r;
}

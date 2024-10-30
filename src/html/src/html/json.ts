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
 
import {IHtmlConfig, IHtmlNodeComponent, IHtmlShapeTypes} from "./node";
import {ITextNodeConfig} from "./node/text";
import {merge as mergeMain} from './index';

export interface Jsonizer{
    jsonize(element: Node): IHtmlShapeTypes;
}

function jsonizeFlat(element: HTMLElement): IHtmlConfig{
    var config: IHtmlConfig = {

    }
    config.tag = element.tagName;
    if (!config.attr){
        config.attr = {};
    }
    for (var i=0; i < element.attributes.length; i++){
        var el = element.attributes[i];
        config.attr[el.name] = el.value;
    }
    return config;
}

function jsonizeChildren(element: HTMLElement, jsonizer?: Jsonizer): IHtmlShapeTypes[]{
    var res: IHtmlShapeTypes[] = [];
    const children = element.childNodes;
    for (var i = 0; i < children.length; i++){
        const el = children[i];
        res.push(jsonize(el, jsonizer));
    }
    return res;
}

export function jsonize(element: Node, jsonizer: Jsonizer = null): IHtmlShapeTypes{
    if (element.nodeType === Node.TEXT_NODE){
        return <ITextNodeConfig>{
            tag: "text",
            _useElement: element,
            text: element.nodeValue
        }
    }
    var res: IHtmlShapeTypes;
    if (jsonizer){
        res = jsonizer.jsonize(element);
    }
    if (res){
        (<IHtmlConfig>res)._useElement = element;
        return res;
    }
    const config = jsonizeFlat(<HTMLElement>element);
    config._useElement = element;
    config.child = jsonizeChildren(<HTMLElement>element, jsonizer);
    return config;
}

export function jsonizeMerge(element: Node, jsonizer: Jsonizer = null): IHtmlNodeComponent{
    return mergeMain(element, jsonize(element, jsonizer));
}



export namespace jsonize{
    export const children = jsonizeChildren;
    export const shallow = jsonizeFlat;
    export const merge = jsonizeMerge;
}

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
 
import {createHTMLElementShape, IHtmlConfig, IHtmlNodeShape, IHtmlShapeTypes} from "../html/node";
import {isNode} from "../util";
import {createTextShape} from "./node/text";
import renderSVG from "./svg";
import {procedure, variable} from "../../../reactive";
import {DummyRenderContext, HtmlRootContext, IHtmlRenderContext, IIndexedHtmlRenderContext} from "./node/context";
import {CustomHTMLShape, HtmlHtmlShape, ICustomHtmlConfig} from "./node/shape";
import {IElementConfig, IHtmlNodeComponent} from "./node";

const tagToRenderer: {[s: string]: (config: IElementConfig) => IHtmlNodeComponent} = {

}

export function registerRenderer(tag: string, render: (config: IElementConfig) => IHtmlNodeComponent){
    tagToRenderer[tag] = render;
}

export interface IRenderOptions{
    type: "attach" | "merge";
    element?: Node;
}

export function renderHTML(config: IHtmlShapeTypes): IHtmlNodeComponent{
    if (isNode(config)){
        return <IHtmlNodeShape>config;
    }
    if (typeof config !== "object")
    {
        return createTextShape({
            text: config
        });
    }
    else{
        var conf = tagToRenderer[(<IHtmlConfig>config).tag];
        if (conf){
            return conf(<IHtmlConfig>config);
        }
        switch((<IHtmlConfig>config).tag){
            case "svg":
                return <any>renderSVG(<any> config);
            case "custom":
                var shape = new CustomHTMLShape(<any>config);
                (<ICustomHtmlConfig>config).node = shape;
                return shape;
            case "text":
                return createTextShape(<any>config);
            case "html":
                return new HtmlHtmlShape(<any>config);
            default:
                var gr = createHTMLElementShape((<IHtmlConfig>config));
                return gr;
        }
    }
}

var animId = null;

export function animationId(){
    return animId;
}

/**
 * Attaches the given virtual dom element or virtual dom element node to the given element
 * @param {Node} element The element ot attach to
 * @param {IHtmlShapeTypes} config The virtual dom being attached
 * @returns {IHtmlNodeComponent} The virtual dom element node attached
 */
export function attach(element: Node, config: IHtmlShapeTypes): IHtmlNodeComponent{
    return _attach(element, config, new HtmlRootContext(element));
}

function _attach(element: Node, config: IHtmlShapeTypes, ctx: IIndexedHtmlRenderContext){
    if (typeof config !== "string" && !isNode(config) && (<IHtmlConfig | IElementConfig>config).node){
        if ((<any>(<IHtmlConfig | IElementConfig>config).node).__attached){
            return (<IHtmlConfig | IElementConfig>config).node;
        }
    }
    if (isNode(config)){
        if ((<any>(config)).__attached){
            return <IHtmlNodeComponent>config;
        }
    }
    var node = <IHtmlNodeShape>renderHTML(config);
    (<any>ctx)._isRoot = true;
    var anim = 0;
    (<any>node).__attached = {
        proc: procedure.animationFrame(p => {
            node.render(ctx);
            ctx.stop();
        }),
        ctx: ctx
    }
    return node;
}

export function merge(element: Node, config: IHtmlShapeTypes): IHtmlNodeComponent{
    var root = element.parentElement;
    return _attach(root, config, new DummyRenderContext(root));
}

function fillMissing(element: Element, config: IHtmlConfig){
    config.tag = element.tagName;
    if (config.attr){
        for (var i=0; i < element.attributes.length; i++){
            var el = element.attributes[i];
            config.attr[el.name] = el.value;
        }
    }
    const children = element.childNodes;
    if (!config.child){
        config.child = [];
    }
    config._useElement = element;
    for (var i = 0; i < children.length; i++){
        const el = children[i];
        if (el.nodeType === Node.TEXT_NODE){
            var ch = config.child[i];
            if ((typeof ch) !== "string"){
                (<any[]>config.child).splice(i, 0, el.nodeValue);
            }
            continue;
        }
        var ch = config.child[i];
        if (ch){
            fillMissing(<Element>children[i], ch);
        }
        else{
            ch = variable.transformProperties({
                child: []
            });
            fillMissing(<Element> children[i], ch);
            (<any>config.child).push(ch);
        }
    }
}

/**
 * Removes the given virtual dom element or virtual dom element node from the DOM.
 * @param {IHtmlNodeComponent | IElementConfig} node
 */
export function detach(node: IHtmlNodeComponent | IElementConfig){
    if (!isNode(node)){
        if (isNode((<IElementConfig>node).node)){
            node = (<IElementConfig>node).node;
        }
    }
    if (!(<any>node).__attached){
        return;
    }
    (<any>node).__attached.proc.cancel();
    node.onDetached();
    (<any>node).__attached.ctx.destroy();
    delete (<any>node).__attached;
}

export default renderHTML;

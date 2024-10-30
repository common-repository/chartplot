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
 
import {array} from "../../../../reactive";
import {IBaseShape, IShapeConfig} from "../../render";
import {IHtmlRenderContext} from "./context";
import {HTMLChildrenRenderer} from "./shape";
import {IRenderOptions} from "../index";

/**
 * A general base class for virtual dom element nodes.
 */
export interface IHtmlNodeComponent extends IBaseShape{

    settings: IElementConfig;

    render(ctx: IHtmlRenderContext);

    /**
     * A method called whenever this shape or one of its ancestors is attached to the html-body.
     *
     *
     * Put in here code that requires the shape to be attached in the DOM, for example to measure
     * the dimensions of a html element.
     */
    onAttached?(): void;
    /**
     * A method called whenever this shape or one of its ancestors is detached from the html-body
     */
    onDetached?(): void;
}

/**
 * A virtual dom element node representing a html node
 */
export interface IHtmlNodeShape extends IBaseShape, IHtmlNodeComponent{

    parent: IHtmlNodeComponent;

    parentModel: IElementConfig;
    settings: IElementConfig;
    /**
     * The html node
     */
    element: Node;

}

/**
 * A virtual dom element node representing a html element, like "div" or "table".
 */
export interface IHtmlElementShape extends IHtmlNodeShape{
    /**
     * The html element
     */
    element: HTMLElement;
}

/**
 * Configuration for a virtual dom element representing a html element.
 */
export interface IElementConfig extends IShapeConfig{
    /**
     * Called when this is attached to the DOM, just before calling "render"
     */
    onAttached?: () => void;
    /**
     * Called after this is detached from the dom
     */
    onDetached?: () => void;

    /**
     * Called every time the element needs to be rerenderd.
     * @param {IHtmlRenderContext} ctx
     */
    render?(ctx: IHtmlRenderContext);

    /**
     * The virtual dom element node associated with this virtual dom element
     */
    node?: IHtmlNodeComponent;
    _useElement?: Node;
}

/**
 * A virtual dom element node representing a HTML element
 */
export interface IHtmlShape extends IHtmlNodeShape{
    children: IHtmlNodeComponent[];
    ctx: IHtmlRenderContext;

    /**
     * Equivalent to calling "renderAttributes", "renderStyles", "renderEvents", "renderChildren", "renderProperties"
     */
    renderAll();

    /**
     * Renders the children
     */
    renderChildren();

    /**
     * Renders the attributes
     */
    renderAttributes();

    /**
     * Renders the properties
     */
    renderProperties();

    /**
     * Renders the styles
     */
    renderStyles();

    /**
     * Renders the events
     */
    renderEvents();
}


export type IHtmlShapeTypes = string | IHtmlConfig | IElementConfig | IHtmlNodeShape;


export interface IHtmlAttributesAndProperties{
    /**
     * Attributes of this element
     */
    attr?: any;
    /**
     * The properties this element will have
     */
    prop?: any;
    /**
     * The style of the shape.
     */
    style?: any;
}


/**
 * A virtual dom element eepresenting a html element. The "tag" property defines the tag the element will have, e.g.:
 *
 * ```
 * var shape = avisul.html({
 *  tag: "div",
 *  style: {
 *      backgroundColor: "blue"
 *  },
 *  attr:{
 *      id: "myElement"
 *  }
 *  
 * });
 * 
 * // Shape represents a "div"-element with given style and attributes.
 * ```
 */
export interface IHtmlConfig extends IElementConfig, IHtmlAttributesAndProperties{

    /**
     * The events to listen to.
     */
    event?: any;
    /**
     * Any child nodes can be defined here.
     */
    child?: IHtmlShapeTypes | IHtmlShapeTypes[] | array.IReactiveArray<IHtmlShapeTypes>;

    /**
     * Called everytime this node needs to rerender.
     * @param {IHtmlRenderContext} ctx
     */
    renderDirect?(ctx: IHtmlRenderContext);
    node?: IHtmlShape;
    context?: "managed" | "unmanaged";
}


export function initHTMLShape(el: IHtmlNodeShape, config: IHtmlConfig){
    var shape = config;
    if (shape.style) {
        if (Array.isArray(shape.style)){
            for (var i=0; i < shape.style.length; i++){
                var kv = shape.style[i];
                (<any>el.element).style[kv.key] = kv.value;
            }
        }
        else {
            for (var p in shape.style){
                (<any>el.element).style[p] = shape.style[p];
            }
        }
    }
    if (shape.attr) {
        for (var p in shape.attr){
            (<any>el.element).setAttribute(p, shape.attr[p]);
        }
    }
    if (shape.prop){
        for (var p in shape.prop){
            (<any>el.element)[p] = shape.prop[p];
        }
    }
    if (shape.event){
        for (var p in shape.event){
            var evs = shape.event[p];
            if (typeof evs === "function"){
                el.element.addEventListener(p, evs);
            }
            else {
                if (Array.isArray(evs)){
                    evs.forEach(f => {
                        if (typeof f === "function"){
                            el.element.addEventListener(p, f);
                        }
                        else
                        {
                            el.element.addEventListener(p, f.handler, f.useCapture);
                        }
                    });
                }
                else {
                    var f = evs;
                    if (typeof f === "function"){
                        el.element.addEventListener(p, f);
                    }
                    else
                    {
                        el.element.addEventListener(p, f.handler, f.useCapture);
                    }
                }

            }
            el.element.addEventListener(p, shape.event[p]);
        }
    }
}

export function createHTMLElementShape(this: void, config:IHtmlConfig) {
    var el = new HTMLChildrenRenderer(config);
    config.node = el;
    return el;
}

export function createHTMLElement(shape: IHtmlNodeShape, element: string){
    shape.element = document.createElement(element);
}



export interface IHTMLChildrenRenderer extends IHtmlNodeShape{

    parent: IHtmlNodeComponent;

}

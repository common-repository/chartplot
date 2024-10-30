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
 
import * as htmlModule from './src/html';
import * as svgMod from './src/html/svg';
import * as nodeMod from "./src/html/node";
import * as util from "./src/util";
import {cachingMapper} from './src/children/map';
import * as childMod from "./src/html/node/child";
import * as contextMod from "./src/html/node/context";
import * as baseMod from './src/render';
import * as styleMod from './src/html/style';
import {getShapeForElement} from "./src/html/node/shape";
export {jsonize} from './src/html/json';


/**
 * Attaches the given virtual dom object to the DOM
 * @param {Node} element the DOM element
 * @param {IHtmlShapeTypes} config The virtual DOM object
 * @returns {IHtmlNodeComponent} The virtual DOM object node
 */
export function attach(element: Node, config: nodeMod.IHtmlShapeTypes): nodeMod.IHtmlNodeComponent{
    return htmlModule.attach(element, config);
}

export type IBaseShape = baseMod.IBaseShape;
export type IShapeConfig = baseMod.IShapeConfig;

/**
 * Create the node for a virtual DOM object
 * @param {IHtmlShapeTypes} config The virtual dom object
 * @returns {IHtmlNodeComponent} the virtual dom object node
 */
export function html(config: nodeMod.IHtmlShapeTypes): nodeMod.IHtmlNodeComponent{
    return htmlModule.default(config);
}

export namespace html{
    export type IHtmlShape = nodeMod.IHtmlShape;
    export type IHtmlShapeTypes = nodeMod.IHtmlShapeTypes;
    export type IHtmlNodeComponent = nodeMod.IHtmlNodeComponent;
    export type IElementConfig = nodeMod.IElementConfig;
    export type IHtmlConfig = nodeMod.IHtmlConfig;
    export type IHtmlRenderContext = contextMod.IHtmlRenderContext;
    export type IIndexedHtmlRenderContext = contextMod.IIndexedHtmlRenderContext;
    export type ICSSStyle = styleMod.ICSSStyle;
    export const childRenderer = childMod.default;
    export type IChildRenderer = childMod.IChildRenderer;
    export type IChildRendererSettings = childMod.IChildRendererSettings;
    export type IHtmlElementShape = nodeMod.IHtmlElementShape;
    export type IHtmlNodeShape = nodeMod.IHtmlNodeShape;
    export type IHtmlAttributesAndProperties = nodeMod.IHtmlAttributesAndProperties;

    export const shapeFromElement = getShapeForElement;

    /**
     * Creates a new rendering context for the given node
     * @param {Node} element
     * @returns {IIndexedHtmlRenderContext}
     */
    export function context(element: Node): contextMod.IIndexedHtmlRenderContext{
        return new contextMod.HtmlRenderContext(element);
    }

    /**
     * Registers a new renderer for the given tag
     * @param {string} tag The tag name
     * @param {(config: IElementConfig) => IHtmlNodeComponent} renderer A function returning a virtual dom element node for the given virtual dom element
     */
    export function register(tag: string, renderer: (config: nodeMod.IElementConfig) => nodeMod.IHtmlNodeComponent){
        htmlModule.registerRenderer(tag, renderer);
    }

}

export const merge = htmlModule.merge;

/**
 * Creates a svg virtual dom element node for a given svg virtual dom element
 * @param {ISVGConfig | string | attach.IBaseShape} config
 * @returns {attach.html.IHtmlNodeComponent}
 */
export function svg(config: svgMod.ISVGConfig | string | IBaseShape): html.IHtmlNodeComponent{
    return svgMod.default(config);
}

export namespace svg{
    export type ISVGConfig = svgMod.ISVGConfig;
    export type ISvgShape = svgMod.ISvgShape;
}

export const detach = htmlModule.detach;
export const isNode = util.isNode;
export const mapper = cachingMapper;


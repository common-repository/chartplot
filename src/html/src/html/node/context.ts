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
 
/**
 * This interface is used to attach real nodes to other nodes during the rendering of a virtual dom element.
 */
export interface IHtmlRenderContext {

    /**
     * The element nodes will be attached to using "push"
     */
    element: Node;

    /**
     * Attaches the given node to the element.
     * @param {Node} node
     */
    push(node: Node);

    /**
     * Removes the last node from the element.
     * @param {number} nr If specified, removes the last nr of nodes from the element.
     */
    pop(nr?: number);
}

export interface IIndexedHtmlRenderContext extends IHtmlRenderContext{
    /**
     * The current position elements will be attached to
     */
    index: number;

    /**
     * Called after all children have been attached. Removes all nodes that have not been reattached.
     */
    stop();
}

function nextIndex(indx, el){
    for (var i=indx; i < el.childNodes.length; i++){
        var e = el.childNodes[i];
        if (e._fromContext){
            return i;
        }
    }
    return i;
}

export class HtmlRenderContext implements IIndexedHtmlRenderContext{

    public index = 0;

    constructor(public element: Node){

    }

    public push(node: Node){
        var el = this.element;
        (<any>el)._fromContext = true;
        var ni = nextIndex(this.index, el);
        if (ni ===  el.childNodes.length){
            el.appendChild(node);
        }
        else if (el.childNodes[ni] !== node){
            el.replaceChild(node, el.childNodes[this.index]);
        }
        this.index = ni+1;
    }

    public pop(nr = 1){
        this.index -= nr;
    }

    public stop(){
        var el = this.element;
        var cn = el.childNodes;
        var l = cn.length;
        var ni = nextIndex(this.index, el);
        for (; ni < l; ni = nextIndex(ni+1, el)){
            el.removeChild(cn[ni]);
            l--;
            ni -= 1;
        }
        this.index = 0;
    }

}

export class DummyRenderContext implements IHtmlRenderContext{

    constructor(public element: Node){

    }

    index: 0;
    stop(){

    }
    push(node: Node){

    }

    pop(nr = 1){

    }
}

export class HtmlRootContext extends HtmlRenderContext{


    constructor(public element: Node){
        super(element);
    }


    public destroy(){
        this.index = 0;
        this.stop();
    }

}

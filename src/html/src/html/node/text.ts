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
 
import {IElementConfig, IHtmlNodeShape} from "./index";
import {IHtmlRenderContext} from "./context";
import {procedure} from "../../../../reactive";

export interface ITextNodeConfig extends IElementConfig{

    text: string;

}

export class HTMLTextRenderer implements IHtmlNodeShape
{
    
    public element: Text;
    public parent: IHtmlNodeShape;
    public __shape_node: boolean;
    private _proc: procedure.IProcedure;
    private _first = true;

    constructor(public settings: ITextNodeConfig) {
        if (settings._useElement){
            this.element = <Text>this.settings._useElement;
            delete this.settings._useElement;
        }
        else {
            this.element = document.createTextNode("");
        }
        (<any>this.element)._fromContext = true;
    }

    public render(ctx: IHtmlRenderContext){
        if (this._first){
            this._first = false;
            this.onAttached();
        }
        ctx.push(this.element);
    }

    get parentModel(){
        return this.parent && this.parent.settings;
    }

    public destroy(){
    }

    set text(t: string){
        this.settings.text = t;
    }

    get text(){
        return this.settings.text;
    }

    onDetached(){
        this._proc.cancel();
        this._first = true;
        this.settings.onDetached && this.settings.onDetached();
    }

    onAttached(){
        this._proc = procedure(() => {
            this.element.nodeValue = this.settings.text;
        });
        this.settings.onAttached && this.settings.onAttached();
    }


}

HTMLTextRenderer.prototype.__shape_node = true;

export function createTextShape(config: ITextNodeConfig){
    var txt = new HTMLTextRenderer(config);
    return txt;

}

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
 
import * as html from '../../html';

function findHelpElement(el: EventTarget){
    const node = html.html.shapeFromElement(el);
    if (!node){
        return null;
    }
}

function findHelpNode(node){
    if (!node){
        return null;
    }
    if (node.help){
        return node;
    }
    return node.parent;
}

export interface IHelpSelectSettings{

    onMoved?(node);
    onClicked?(node);

}

export function selectHelpElement(settings: IHelpSelectSettings){

    function moveListener(ev){
        ev.preventDefault();
        const target = findHelpElement(ev.target);
        settings.onMoved && settings.onMoved(target);
        return false;
    }

    function listener(ev){
        ev.preventDefault();
        const target = findHelpElement(ev.target);
        settings.onClicked && settings.onClicked(target);
        document.removeEventListener("click", listener, false);
        document.removeEventListener("mousemove", moveListener, false);
        return false;
    }

    document.addEventListener("click", listener, false);
    document.addEventListener("mousemove", moveListener, false);
}

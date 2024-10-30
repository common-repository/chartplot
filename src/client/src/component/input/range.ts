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
 
import rounder from "../../math/round";
import {IRectangle} from "../../geometry/rectangle";
import {map1d} from "../../math/transform";
import {procedure, variable} from "../../../../reactive";
import {DocumentMovement} from "../../html/interaction/document";
import {IHtmlShape} from "../../../../html/src/html/node";
import {IHtmlRenderContext} from "../../../../html/src/html/node/context";
import {deep} from "../../../../core/src/extend";

export interface IButtonSettings{
    class?: string;
    ext?: any;
}

export interface IRangeInputSettings{

    class?: string;
    from: number;
    to: number;
    step?: number;
    value: number;
    button?: IButtonSettings;
    ext?: any;

}

export function rangeInput(settings: IRangeInputSettings){

    var but = settings.button || {};
    var step = settings.step || 1;
    var from = settings.from;
    var to = settings.to;
    var mouse = variable.transformProperties({
        cx: 0,
        cy: 0,
        moving: false
    })
    var slideButton = {
        tag: "button",
        attr: {
            class: but.class ? but.class : ""
        },
        style: variable.transformProperties({
            position: "absolute",
            width: "6px",
            height: "30px",
            top: "0px",
            left: "0px",
            padding: "0"
        })
    }
    if (but.ext){
        deep(slideButton, but.ext);
    }

    var round = rounder(step);
    var dims = variable<IRectangle>({
        width: 100,
        height: 30,
        x: 0,
        y: 0
    });

    var proc: procedure.IProcedure;

    function changeValue(){
        var d = dims.value;
        var w = d.width;
        var cx = mouse.cx - d.x;
        var newVal = round(map1d({start:0, end: w}).to({start: from, end: to}).create()(cx));
        newVal = Math.min(to, Math.max(from, newVal));
        settings.value = newVal;
    }

    var res = {
        tag: "div",
        attr: {
            class: settings.class ? settings.class : ""
        },
        style: {
            position: "relative",
            background: "rgb(200, 200, 200)"
        },
        event: {
            mousedown: (ev) => {
                mouse.moving = true;
                mouse.cx = ev.clientX;
                changeValue();
                new DocumentMovement({
                    stop(){
                        mouse.moving = false;
                    },
                    move(ev){
                        mouse.cx = ev.clientX;
                        changeValue();
                    }
                });
            }
        },
        node: <IHtmlShape> null,
        child: slideButton,
        onAttached: () => {
            proc = procedure(p => {
                var d = dims.value;
                var w = d.width;
                var inpVal = settings.value;
                slideButton.style.height = d.height+"px";
                var xPos = map1d({start: from, end: to}).to({start: 0, end: w}).create()(inpVal);
                slideButton.style.left = (xPos - 2)+"px";
            });
        },
        onDetached: () => {
            proc.cancel();
        },
        render: (ctx: IHtmlRenderContext) => {
            res.node.renderAll();
            var cr = (<HTMLElement>res.node.element).getBoundingClientRect();
            dims.value = {
                width: cr.width,
                height: cr.height,
                x: cr.left,
                y: cr.top
            }
        }
    }
    if (settings.ext){
        deep(res, settings.ext);
    }
    return res;
}

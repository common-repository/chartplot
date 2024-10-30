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
 
import {transaction, procedure, unobserved, variable} from "../../../../reactive";

export interface IUnifiedEvent{

    original: UIEvent;
    clientX: number;
    clientY: number;
    preventDefault();
    stopPropagation();

}

export interface IDocumentMovementEvents{
    move?(ev: IUnifiedEvent): void;
    stop?(ev: IUnifiedEvent): void;
}

export class DocumentMovement{

    private lastMouseMove = variable(null);
    private procedure: procedure.IAnimationFrameExecution;

    public bodyMousemove = (e: MouseEvent) =>{
        e.preventDefault();
        this.lastMouseMove.value = e;
    };
    public bodyMouseup = (e: MouseEvent) =>{
        transaction(() => {
            this.cancel(e);
        });
    };

    public bodyMouseleave = (e: MouseEvent) => {
        if (e.target === document.body) {
            transaction(() => {
                this.cancel(e);
            });
        }
    };

    public bodyTouchMove = (ev: TouchEvent) => {
        ev.preventDefault();
        (<any>ev).clientX = ev.touches[0].clientX;
        (<any>ev).clientY = ev.touches[0].clientY;
        this.bodyMousemove(<any>ev);
    }

    public bodyTouchEnd = (ev: TouchEvent) => {
        ev.preventDefault();
        this.bodyMouseup(<any>ev);
    }

    public bodyTouchCancel = (ev: TouchEvent) => {
        ev.preventDefault();
        this.bodyMouseleave(<any>ev);
    }

    constructor(public listener: IDocumentMovementEvents){
        window.addEventListener("mousemove", this.bodyMousemove, true);
        window.addEventListener("touchmove", this.bodyTouchMove, true);
        window.addEventListener("touchend", this.bodyTouchEnd, true);
        window.addEventListener("touchcancel", this.bodyTouchCancel, true);
        window.addEventListener("mouseup", this.bodyMouseup, true);
        document.body.addEventListener("mouseleave", this.bodyMouseleave, true);
        this.procedure = procedure.animationFrame(() => {
            var e = this.lastMouseMove.value;
            if (e){
                unobserved(() => {
                    listener.move && listener.move({
                        clientY: e.clientY,
                        clientX: e.clientX,
                        preventDefault: () => {
                            e.preventDefault();
                        },
                        stopPropagation: () => {
                            e.stopPropagation();
                        },
                        original: e
                    });
                });
            }
        });
    }

    public cancel(e: MouseEvent){
        this.procedure.cancel();
        window.removeEventListener("mousemove", this.bodyMousemove, true);
        window.removeEventListener("mouseup", this.bodyMouseup, true);
        document.body.removeEventListener("mouseleave", this.bodyMouseleave, true);
        window.removeEventListener("touchmove", this.bodyTouchMove, true);
        window.removeEventListener("touchend", this.bodyTouchEnd, true);
        window.removeEventListener("touchcancel", this.bodyTouchCancel, true);
        this.listener.stop && this.listener.stop({
            clientX: e.clientX,
            clientY: e.clientY,
            preventDefault: () => {
                e.preventDefault();
            },
            stopPropagation: () => {
                e.stopPropagation();
            },
            original: e
        });
    }

}

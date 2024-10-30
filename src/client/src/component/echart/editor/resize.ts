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
 
import {event, procedure} from "../../../../../reactive";
import * as di from '../../../../../di';
import {ICancellable} from "../../../../../reactive/src/cancellable";

class BrowserResizeEvent{

    public recalc(){

    }

    public start(){
        var self = this;
        function recalc(){
            self.recalc();
        }
        window.addEventListener("resize", recalc);
        window.addEventListener("scroll", recalc);
        this.cancel = () => {
            window.removeEventListener("resize", recalc);
            window.removeEventListener("scroll", recalc);
        }
    }

    public cancel(){

    }

}

export function globalResize(cancels: ICancellable[], triggerResize: () => void){
    var event = new BrowserResizeEvent();
    event.recalc = triggerResize;
    cancels.push(event);
    event.start();
}

export class ResizeComponents{

    @di.inject
    cancels

    @di.create(function(this: ResizeComponents){
        var proc = procedure.timeout(() => {
            this.onResize.fire(null);
        }, 100);
        return () => {
            proc.changedDirty();
        }
    })
    triggerResize: () => void

    @di.create(function(this: ResizeComponents){
        return event();
    })
    onResize: event.IStream<any>

}

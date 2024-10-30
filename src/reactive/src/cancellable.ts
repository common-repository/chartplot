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
 
import stream from "./event";

var nullCancel = {
    cancel: function(){
        
    }
}

/**
 * An object that can be cancelled
 */
export interface ICancellable{

    /**
     * Cancel this cancellable
     */
    cancel(): void;
}

class Cancellable{

    private _onCancelled = stream<() => void>();

    /**
     * True if this cancellable is cancelled
     */
    public cancelled = false;

    /**
     *
     * @param observer will be called when this cancellable is cancelled
     */
    public onCancelled(observer: (a: any) => void){
        if (this.cancelled) {
            observer(null);
            return nullCancel;
        }
        else {
            return this._onCancelled.observe(observer);
        }
    }
    public cancel(){
        if (!this.cancelled){
            this.cancelled = true;
            this._onCancelled.fire(null);
        }
    }
}

export function cancellable(handler: () => void): ICancellable{
    var c = new Cancellable();
    c.onCancelled(handler);
    return c;
}

export function cancelIf(cancellable: any){
    if (typeof cancellable.cancel === "function"){
        cancellable.cancel();
    }
}

export var nullCancellable = <ICancellable>{
    cancelled: false,
    onCancelled: function(observer: (a: any) => void){
        return nullCancel;
    },
    cancel: function(){
        
    },
    add: function(){
        
    }
}

export var none: ICancellable = nullCancellable;

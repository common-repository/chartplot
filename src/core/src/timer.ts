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
 
if (typeof window === "undefined" || !window.requestAnimationFrame){
    var lastTime = 0;
    requestAnimationVar = function(callback: any): any {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = setTimeout(function() { callback(currTime + timeToCall); },
            timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
}
else {
    var requestAnimationVar = function(anim: any): any{
        return window.requestAnimationFrame(anim);
    }
}
var cancelAnimationVar;
if (typeof window === "undefined" || !window.cancelAnimationFrame){
    cancelAnimationVar = function(id: any) {
        clearTimeout(id);
    };
}
else {
    cancelAnimationVar = function(id: any){
        window.cancelAnimationFrame(id);
    }
}

export const requestAnimation = requestAnimationVar;
export const cancelAnimation = cancelAnimationVar;

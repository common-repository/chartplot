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
 
import {jsonize} from "../../../../html";
import {jsonizeLoadingButton} from "../../input/button";
import {call} from "../../call";
import {logout} from "../../account";
import merge = jsonize.merge;

declare var $;

$(() => {
    var el = document.getElementById("logout");
    merge(el, {
        jsonize: function(el: HTMLElement){
            return jsonizeLoadingButton(el, {
                submit: function(ev){
                    return call({
                        path: "/logout"
                    }).then(function (res) {
                        logout();
                        window.location.reload();
                        return res;
                    });
                }
            })
        }
    });
});

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
 
import {jsonize} from '../../../html';
import {extend} from '../../../core';
import {variable} from '../../../reactive';

export function jsonizeLoadingButton(element: HTMLElement, input: any){
    const config = jsonize.shallow(element);
    const status = variable("init");
    const child = jsonize.children(element);
    config._useElement = element;
    extend.deep(config, {

        get child(){
            if (status.value == "loading"){
                return [<any>{
                    tag: "i",
                    attr: {
                        class: "fa fa-spinner fa-pulse"
                    }
                }].concat(child);
            }
            else if (status.value == "error"){
                return [<any>{
                    tag: "i",
                    attr: {
                        class: "fa fa-times text-danger"
                    }
                }].concat(child);
            }
            else if (status.value == "ok"){
                return [<any>{
                    tag: "i",
                    attr: {
                        class: "fa fa-check text-success"
                    }
                }].concat(child);
            }
            return child;
        },

        event: {
            click: (ev) => {
                ev.preventDefault();
                status.value = "loading";
                input.submit(ev).then(f => {
                    status.value = "ok";
                }, err => {
                    status.value = "error";
                });
                return false;
            }
        }
    });
    return config;

}

export default {
    jsonizeLoading: jsonizeLoadingButton
}

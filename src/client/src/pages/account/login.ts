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
 
import {key, login} from "../../account";
import {call} from "../../call";
import reactive from "../../../../reactive";
import {formModel} from "../../input/form";
import send = formModel.send;
import {jsonize} from "../../../../html";
import merge = jsonize.merge;

declare var $;
$(() => {
    console.log("FU");
    const k = key();
    if (k){
        call({
            path: "/api/register/keylogin",
            data: {
                key: k
            }
        }).then(success => {
            window.location.reload();
        }, err => {

        });
    }

    const model = reactive({
        username: reactive({
            value: "",
            error: ""
        }),
        password: reactive({
            value: "",
            error: ""
        }),
        autologin: reactive({
            value: true,
            error: ""
        }),
        error: "",
        submit: {
            submit: (ev) => {
                return send({
                    model: model,
                    path: "/api/login"
                }).then(message => {
                    login(message);
                    window.location.reload();
                });
            }
        }
    });
    const jsonizer = formModel(model);
    console.log(jsonizer);
    merge(document.getElementById("form"), jsonizer);
});

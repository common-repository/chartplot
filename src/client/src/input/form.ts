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
import {transaction} from '../../../reactive';
import {extend} from '../../../core';
import * as axios from 'axios';
import Promise from 'promise-polyfill';
import {jsonizeLoadingButton} from "./button";

class InputJsonizer{

    constructor(public input: any){

    }

    jsonize(element: HTMLElement){
        const input = this.input;
        const classn = element.getAttribute("class") || "";
        if (element.tagName === "INPUT") {
            if (element.getAttribute("type").toLowerCase() === "checkbox"){
                const config = jsonize.shallow(element);
                config.child = jsonize.children(element);
                extend.deep(config, {
                    prop: {
                        get checked(){
                            return input.value;
                        }
                    },
                    attr: {
                        get class(){
                            if (input.error){
                                return classn+" is-invalid";
                            }
                            return classn;
                        }
                    },
                    event: {
                        change: (ev) => {
                            console.log(ev.target.checked);
                            input.value = ev.target.checked;
                        }
                    }
                });
                return config;
            }
            else
            {
                const config = jsonize.shallow(element);
                config.child = jsonize.children(element);
                extend.deep(config, {
                    prop: {
                        get value(){
                            return input.value;
                        }
                    },
                    attr: {
                        get class(){
                            if (input.error){
                                return classn+" is-invalid";
                            }
                            return classn;
                        }
                    },
                    event: {
                        change: (ev) => {
                            input.value = ev.target.value;
                        }
                    }
                });
                return config;
            }
        }
        else{
            if (element.classList.contains("invalid-feedback")){
                const config = jsonize.shallow(element);
                extend.deep(config, {
                    get child(){
                        return input.error;
                    }
                });
                return config;
            }
        }
        return null;
    }

}

class FormJsonizer{

    constructor(public model: any){

    }

    jsonize(element: HTMLElement){
        const id = element.getAttribute("id");
        const model = this.model;
        if (id){
            if (model[id]){
                const inp = model[id];
                if (inp){
                    if (element.tagName === "BUTTON"){
                        return jsonizeLoadingButton(element, inp);
                    }
                    const conf = jsonize.shallow(element);
                    conf.child = jsonize.children(element, new InputJsonizer(inp));
                    return conf;
                }
            }
        }
        if (element.tagName === "DIV"){
            if (element.classList.contains("error") && "error" in model){
                const config = jsonize.shallow(element);
                extend(config, {
                    get child(){
                        return model.error || "";
                    }
                });
                return config;
            }
        }
    }
}

export function formModel(model: any){
    return new FormJsonizer(model);
}

export function sendForm(settings){
    const model = settings.model;
    var data = {};
    for (var p in model){
        if (model[p] && model[p].value){
            data[p] = model[p].value;
        }
    }
    const path = settings.path;
    return axios.default.post(path, data).then(function(resp){
        return resp.data;
    }).catch(function(error){
        transaction(function(){
            for (var p in model){
                if (model[p] && model[p].value){
                    model[p].error = "";
                }
            }
            model.error = "";
        });
        if (error.response.headers["www-authenticate"]){
            model.error = error.response.headers["www-authenticate"];
        }
        switch(error.response.status){
            case 422:
                model.error = error.response.data.error;
                const errors = error.response.data.errors;
                for (var prop in model){
                    var inp = model[prop];
                    var err = errors[prop];
                    if (err)
                    {
                        inp.error = err.msg;
                    }
                    else {
                        inp.error = "";
                    }
                }
                return Promise.reject(error);
            default:
                model.error = error.response.data.error;
                return Promise.reject(error);
        }
    });
}

export namespace formModel{
    export const send = sendForm;
}

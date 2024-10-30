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
 
function formItem(child){
    return {
        tag: "div",
        attr: {
            class: "form-group"
        },
        style: {
            width: "100%"
        },
        child: child
    }
}

export function collection(shapes: any[]){
    return shapes.map(s => formItem(s));
}

export interface IFormGroupSettings{
    label?: string;
    help?: any;
    input: any;
    id?: string;
}

export function formGroup(settings: IFormGroupSettings){
    var children = [];
    if (settings.label){
        children.push({
            tag: "label",
            attr: {
                for: settings.id || undefined
            },
            child: settings.label
        });
    }
    children.push(settings.input);
    if (settings.help){
        children.push({
            tag: "div",
            class: "form-text text-muted",
            child: settings.help
        })
    }
    return {
        tag: "div",
        attr: {
            class: "form-group"
        },
        child: children
    }
}

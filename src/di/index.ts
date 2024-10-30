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
 
import * as diMod from "./src";

export default function di(settings: diMod.IAssemblerSettings){
    return diMod.assemble(settings);
}

export const assemble = diMod.assemble;
export type IContainer = diMod.IContainer;
export const join = diMod.join;
export const variable = diMod.variableFactory;
export const autostart = diMod.autoStart;
export const deps = diMod.deps;
export const inject = diMod.inject;
export const create = diMod.create;
export const factory = diMod.factory;
export const define = diMod.define;
export const init = diMod.init;
export const component = diMod.component;

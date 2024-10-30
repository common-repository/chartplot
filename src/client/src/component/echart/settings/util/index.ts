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
 
import {IVariable} from "../../../../../../reactive/src/variable";
import {IChartSettingsComponent} from "../base";
import {shouldPropertyBeRemoved} from "../../../../../../core/src/object";

export function setIfNotNull(object: any, name: string, value: any){

}

interface IVariableConfig{

    property: string;
    variable: IVariable<any>;
    default: any;

}

interface IConfigConfig{
    property: string;
    config: IChartSettingsComponent;
    default: any;
}

export class ConfigBuilder{

    variables: IVariableConfig[] = [];
    configs: IConfigConfig[] = [];

    value(property: string, variable: IVariable<any>, def = null){
        this.variables.push({variable: variable, property: property, default: def});
    }

    config(property: string, config: IChartSettingsComponent, def = {}){
        this.configs.push({config: config, property: property, default: def});
    }

    createConfig(object){
        this.variables.forEach(v => {
            var val = v.variable.value;
            if (!shouldPropertyBeRemoved(val)){
                object[v.property] = val;
            }
        });
        this.configs.forEach(c => {
            var val = c.config.createConfig();
            if (!shouldPropertyBeRemoved(val)){
                object[c.property] = val;
            }
        });
        return object;
    }

    applyConfig(config){
        this.variables.forEach(v => {
            if (v.property in config){
                v.variable.value = config[v.property];
            }
            else{
                v.variable.value = v.default;
            }
        });
        this.configs.forEach(c => {
            if (c.property in config){
                c.config.applyConfig(config[c.property]);
            }
            else
            {
                c.config.applyConfig(c.default);
            }
        });
    }

}

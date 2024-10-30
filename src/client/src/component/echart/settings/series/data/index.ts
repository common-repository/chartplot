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
 
import {IEChartSettingsComponent} from "../../base";
import {variable} from "../../../../../../../reactive";
import {ConfigBuilder} from "../../util";
import {init} from "../../../../../../../di";
import {removeEmptyProperties} from "../../../../../../../core/src/object";

export class SeriesDataCell implements IEChartSettingsComponent{

    builder = new ConfigBuilder();

    type: string;

    public r_name = variable<string>(null);

    get name(){
        return this.r_name.value;
    }

    set name(v){
        this.r_name.value = v;
    }

    @init
    init(){
        this.builder.value("name", this.r_name);
    }

    applyConfig(c){
        this.builder.applyConfig(c);
    }

    createConfig(){
        return this.builder.createConfig({});
    }

    createEChartConfig(){
        return removeEmptyProperties({
            name: this.name
        });
    }

}

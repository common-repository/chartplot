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
 
import {Constructor} from "../../../../../core";
import {factory} from "../../../../../di";

export interface IChartSettingsComponent{
    createConfig(): any;
    applyConfig(config: any);
}

export interface IEChartSettingsComponent extends IChartSettingsComponent{

    createEChartConfig(): any;

}

export interface ICloneable{
    clone();
}

export abstract class AbstractChartSettings implements IChartSettingsComponent{

    abstract createSettings(): IChartSettingsComponent;

    clone(){
        var s = this.createSettings();
        s.applyConfig(this.createConfig());
        return s;
    }

    abstract createConfig(): any;
    abstract applyConfig(c: any);


}

export function Cloneable<T extends Constructor<IChartSettingsComponent>>(Base: T){

    class C extends Base {


    }
    factory(C.prototype, "createSettings");
    return C;
}

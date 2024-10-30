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
 
import {IHtmlConfig} from "../../../../../html/src/html/node";
import {ExpandedSettings} from "./blocks/expand/settings";
import {create, factory} from "../../../../../di";
import {DoubleSurface, TripleSurface} from "./blocks/surface";
import {variable} from "../../../../../reactive";

export abstract class RibbonTab{

    marginLeft: string;
    public r_marginRight = variable<string>("");

    get marginRight(){
        return this.r_marginRight.value;
    }

    set marginRight(v){
        this.r_marginRight.value = v;
    }

    name: string;

    tooltip: any;

    abstract contents: RibbonContentSection[];

    additionalIndexes: number[] = [];

    deactivate(){

    }

    activate(){

    }

}

export interface ITripleSurfaceSettings{
    top?: any;
    bottom?: any;
    middle?: any;
}

export interface IDoubleSurfaceSettings{
    top?: any;
    bottom?: any;
}

export abstract class RibbonContentSection{

    abstract contents: any;
    label: string;
    tooltip: any;
    contentNode: IHtmlConfig;
    expand?: ExpandedSettings;

    @factory
    createTripleSurface(){
        return new TripleSurface();
    }

    @factory
    createDoubleSurface(){
        return new DoubleSurface();
    }

    tripleSurface(settings: ITripleSurfaceSettings){
        var surf = this.createTripleSurface();
        if (settings.top){
            surf.top = settings.top;
        }
        if (settings.bottom){
            surf.bottom = settings.bottom;
        }
        if (settings.middle){
            surf.middle = settings.middle;
        }
        return surf;
    }

    doubleSurface(settings: IDoubleSurfaceSettings){
        var surf = this.createDoubleSurface();
        if (settings.top){
            surf.top = settings.top;
        }
        if (settings.bottom){
            surf.bottom = settings.bottom;
        }
        return surf;
    }


}

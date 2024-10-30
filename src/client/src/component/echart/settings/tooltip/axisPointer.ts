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
 
import {variable} from "../../../../../../reactive";
import {IEChartSettingsComponent} from "../base";
import {removeEmptyProperties} from "../../../../../../core/src/object";

export class AxisPointerSettings implements IEChartSettingsComponent{

    public r_type = variable<string>(null);

    get type(){
        return this.r_type.value;
    }

    set type(v){
        this.r_type.value = v;
    }

    public r_axis = variable<string>(null);

    get axis(){
        return this.r_axis.value;
    }

    set axis(v){
        this.r_axis.value = v;
    }

    public r_snap = variable<boolean>(null);

    get snap(){
        return this.r_snap.value;
    }

    set snap(v){
        this.r_snap.value = v;
    }

    createConfig(){
        return removeEmptyProperties({
            type: this.type,
            axis: this.axis,
            snap: this.snap
        })
    }

    applyConfig(c){
        this.type = c.type || null;
        this.axis = c.axis || null;
        if ("snap" in c){
            this.snap = c.snap;
        }
        else {
            this.snap = null;
        }
    }

    createEChartConfig(){
        return this.createConfig();
    }

}

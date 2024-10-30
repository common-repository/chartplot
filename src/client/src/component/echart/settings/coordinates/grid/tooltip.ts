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
 
import {TooltipSettings} from "../../tooltip";
import {removeEmptyProperties} from "../../../../../../../core/src/object";
import {AxisPointerSettings} from "../../tooltip/axisPointer";
import {create, inject} from "../../../../../../../di";
import {GridSettings} from "./index";

export class GridTooltip extends TooltipSettings{

    get show(){
        if (this.r_show.value === null){
            return true;
        }
        return this.r_show.value;
    }

    set show(v){
        this.r_show.value = v;
    }

    @create
    axisPointer: AxisPointerSettings;
    create_axisPointer(){
        return new GridAxisPointerSettings();
    }

    createEChartConfig(){
        return removeEmptyProperties({
            show: this.show,
            trigger: this.trigger,
            axisPointer: this.trigger === 'axis' ? this.axisPointer.createEChartConfig() : null,
            position: this.getEchartPosition(),
            backgroundColor: this.backgroundColor,
            borderColor: this.borderColor,
            borderWidth: this.borderWidth,
            padding: this.padding
        });
    }

}

class GridAxisPointerSettings extends AxisPointerSettings{

    @inject
    grid: GridSettings;

    get axis(){
        var res = this.r_axis.value;
        if (!res){
            var axs = this.grid.axes.axes.values;
            for (var i=0; i < axs.length; i++){
                var ax = axs[i];
                if (ax.type === "category" || ax.type === "time"){
                    return ax.coordinate;
                }
            }
            return "x";
        }
        return res;
    }

    set axis(v){
        this.r_axis.value = v;
    }
}

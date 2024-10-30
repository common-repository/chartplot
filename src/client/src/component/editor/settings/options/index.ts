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
 
import {create} from "../../../../../../di";
import {DataOptionSettings} from "./data";
import {IChartSettingsComponent} from "../../../echart/settings/base";
import {removeEmptyProperties} from "../../../../../../core/src/object";
import {SeriesOptionSettings} from "./series";
import {RibbonOptions} from "./ribbon";
import {CoordinateOptionSettings} from "./coordinates";
import {ComponentsOptionSettings} from "./components";
import {ViewOptions} from "./view";
import {ChartOptionSettings} from "./chart";

export class OptionSettings implements IChartSettingsComponent{

    @create(() => new DataOptionSettings())
    data: DataOptionSettings;

    @create(() => new SeriesOptionSettings())
    series: SeriesOptionSettings;

    @create(() => new RibbonOptions())
    ribbon: RibbonOptions;

    @create(() => new CoordinateOptionSettings())
    coordinates: CoordinateOptionSettings;

    @create(() => new ComponentsOptionSettings())
    components: ComponentsOptionSettings;

    @create(() => new ViewOptions())
    view: ViewOptions

    @create(() => new ChartOptionSettings())
    chart: ChartOptionSettings;


    createConfig(): any{
        return removeEmptyProperties({
            data: this.data.createConfig(),
            series: this.series.createConfig(),
            ribbon: this.ribbon.createConfig(),
            coordinates: this.coordinates.createConfig(),
            components: this.components.createConfig(),
            view: this.view.createConfig(),
            chart: this.chart.createConfig()
        })
    }

    applyConfig(config: any){
        this.data.applyConfig(config.data || {});
        this.series.applyConfig(config.series || {});
        this.ribbon.applyConfig(config.ribbon || {});
        this.coordinates.applyConfig(config.coordinates || {});
        this.components.applyConfig(config.components || {});
        this.view.applyConfig(config.view || {});
        this.chart.applyConfig(config.chart || {});
    }

}

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
 
import {RibbonContentSection} from "../../base";
import {GeneralSettingsSection} from "../general";
import {create, define, factory, inject} from "../../../../../../../di";
import {EChartSeriesSettings} from "../../../../echart/settings/series";
import {Editor} from "../../../index";
import {SeriesCoordinateSection} from "../coordinate";
import {StackSection} from "../general/stack";
import {SeriesTooltipSection} from "../tooltip";

export class CategoricalSeriesTypeRibbon{

    constructor(selectedSeries: EChartSeriesSettings){
        this.selectedSeries = selectedSeries;
    }

    @define
    selectedSeries: EChartSeriesSettings;

    @create(() => new GeneralSettingsSection())
    general: GeneralSettingsSection;

    @create(() => new SeriesCoordinateSection())
    coordinates: SeriesCoordinateSection;

    @create(() => new SeriesTooltipSection())
    tooltip: SeriesTooltipSection;

    @factory
    stack(){
        return new StackSection();
    }

    @inject
    editor: Editor

    get contents(): RibbonContentSection[]{
        var res: RibbonContentSection[] = [this.general, this.coordinates];
        switch(this.selectedSeries.getType()){
            case "bar":
            case "line":
            case "area":
                res.push(this.stack());
                break;
        }
        res.push(this.tooltip);
        return res;
    }

}

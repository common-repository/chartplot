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
import {TripleSurface} from "../../blocks/surface";
import {create, init, inject} from "../../../../../../../di";
import {HistoryNumberInput, NumberInput} from "../../blocks/input";
import {EChartSeriesSettings} from "../../../../echart/settings/series";
import {GridSettings} from "../../../../echart/settings/coordinates/grid";
import {HistoryPixelPercentInput} from "../../blocks/position/position";
import {ExpandedSettings} from "../../blocks/expand/settings";
import {ColorInputButton} from "../../blocks/input/color";
import {BorderColorButton} from "../../blocks/style/border";
import {TooltipBlock} from "../../blocks/tooltip";

export class SeriesBarStyleSection extends RibbonContentSection{

    @create(() => new SeriesBarStyleExpand())
    expand: SeriesBarStyleExpand;

    @create(() => new SeriesBarGapTriple())
    gap: SeriesBarGapTriple;

    get contents(){
        return [this.gap];
    }

    label = "column"

}

class SeriesBarStyleExpand extends ExpandedSettings{

    @inject
    series: EChartSeriesSettings;

    @create(function(this: SeriesBarStyleExpand){
        var res = new HistoryNumberInput();
        res.min = 0;
        res.default = null;
        res.label = "width";
        res.isSmall = true;
        res.r_value = (<GridSettings>this.series.getCoordinateSystem()).bar.r_barWidth;
        res.tooltip = new TooltipBlock({title: "Bar width", content: "The width of the bar. This setting applies to all series in the same coordinate system."})
        return res;
    })
    barWidth: HistoryNumberInput;

    @create(function(this: SeriesBarStyleExpand){
        var res = new HistoryNumberInput();
        res.min = 0;
        res.default = null;
        res.label = "max width";
        res.isSmall = true;
        res.r_value = (<GridSettings>this.series.getCoordinateSystem()).bar.r_barMaxWidth;
        res.tooltip = new TooltipBlock({title: "Bar max width", content: "The maximum width of the bar. This setting applies to all series in the same coordinate system."})
        return res;
    })
    barMaxWidth: HistoryNumberInput;

    @create(function(this: SeriesBarStyleExpand){
        var res = new HistoryNumberInput();
        res.min = 0;
        res.default = null;
        res.label = "min height";
        res.isSmall = true;
        res.r_value = (<GridSettings>this.series.getCoordinateSystem()).bar.r_barMinHeight;
        res.tooltip = new TooltipBlock({title: "Bar ming height", content: "The minimal height of the bar. This setting applies to all series in the same coordinate system."})
        return res;
    })
    barMinHeight: HistoryNumberInput;

    @init
    init(){
        var dimsRow = this.section("Dimensions");
        dimsRow.row().item(this.barWidth);
        dimsRow.row().item(this.barMaxWidth);
        dimsRow.row().item(this.barMinHeight);
    }

}

class SeriesBarGapTriple extends TripleSurface{

    @inject
    series: EChartSeriesSettings;

    @create(function(this: SeriesBarGapTriple){
        var res = new HistoryPixelPercentInput();
        res.labelPos = "right";
        res.value = (<GridSettings>this.series.getCoordinateSystem()).bar.barGap;
        return res;
    })
    barGap: HistoryPixelPercentInput;

    @create(function(this: SeriesBarGapTriple){
        var res = new HistoryPixelPercentInput();
        res.labelPos = "right";
        res.value = (<GridSettings>this.series.getCoordinateSystem()).bar.barCategoryGap;
        return res;
    })
    barCategoryGap: HistoryPixelPercentInput;

    get top(){
        return [this.barGap];
    }

    get middle(){
        return [this.barCategoryGap];
    }

    @init
    init(){
        this.barCategoryGap.label = "category gap";
        this.barCategoryGap.textInput.isSmall = true;
        this.barCategoryGap.width = null;
        this.barCategoryGap.textInput.tooltip = new TooltipBlock({title: "Bar category gap", content: "The gap between all bars of 2 different categories. " +
            " This setting applies to all series in the same coordinate system."});

        this.barGap.label = "column gap";
        this.barGap.textInput.isSmall = true;
        this.barGap.width = null;
        this.barGap.selectButton.items = [{
            label: " % Percent",
            value: "percent",
            icon: ""
        }];
        this.barGap.textInput.tooltip = new TooltipBlock({title: "Bar column gap", content: "The gap between the bars of 2 different series. " +
            "You can also use negative values, e.g. '-100%' to make them overlap totally. This setting applies to all series in the same coordinate system."});

    }

}

export class SeriesBarBorderSection extends RibbonContentSection{

    label = "border";

    @create(() => new SeriesBarBorderTriple())
    triple: SeriesBarBorderTriple;

    get contents(){
        return [this.triple];
    }

}


class SeriesBarBorderTriple extends TripleSurface{

    @inject
    series: EChartSeriesSettings

    @create(function(this: SeriesBarBorderTriple){
        var col = new BorderColorButton(this.series.itemStyle.r_barBorderColor);
        return col;
    })
    borderColor: ColorInputButton;

    @create(function(this: SeriesBarBorderTriple){
        var col = new HistoryNumberInput();
        col.r_value = this.series.itemStyle.r_barBorderWidth;
        col.min = 0;
        col.default = null;
        col.isSmall = true;
        col.label = "width";
        col.tooltip = new TooltipBlock({title: "Border width", content: "The width of the border. You also need to set a border color in order to see the border."});
        return col;
    })
    borderWidth: NumberInput;

    @create(function(this: SeriesBarBorderTriple){
        var col = new HistoryNumberInput();
        col.r_value = this.series.itemStyle.r_barBorderRadius;
        col.min = 0;
        col.default = null;
        col.isSmall = true;
        col.label = "radius";
        col.tooltip = new TooltipBlock({title: "Border radius", content: "Will render round border corners if the radius is > 0."});
        return col;
    })
    borderRadius: NumberInput;

    get top(){
        return this.borderColor;
    }

    get middle(){
        return this.borderWidth;
    }

    get bottom(){
        return this.borderRadius;
    }



}


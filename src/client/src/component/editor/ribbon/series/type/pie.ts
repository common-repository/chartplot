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
import {SpaceSurface, TripleSurface} from "../../blocks/surface";
import {PixelPercentInputRow} from "../../blocks/position/position";
import {create, define, inject} from "../../../../../../../di";
import {EChartSeriesSettings} from "../../../../echart/settings/series";
import {GeneralSettingsSection} from "../general";
import {SeriesTooltipSection} from "../tooltip";

export class SelectedPieSeriesPart{

    constructor(selectedSeries: EChartSeriesSettings){
        this.selectedSeries = selectedSeries;
    }

    @define
    selectedSeries: EChartSeriesSettings;

    @create(() => new PositionRibbonSection())
    position: PositionRibbonSection;

    @create(() => new GeneralSettingsSection())
    general: GeneralSettingsSection;

    @create(() => new SeriesTooltipSection())
    tooltip: SeriesTooltipSection;

    get contents(){
        return [this.general, this.position, this.tooltip];
    }

}

class PositionRibbonSection extends RibbonContentSection{

    label = "position";

    @create(() => new PositionTriple())
    position: PositionTriple;

    @create(() => new DimensionsTriple())
    radius: DimensionsTriple;

    get contents(){
        return [this.position, new SpaceSurface(), this.radius];
    }

}

class PositionTriple extends TripleSurface {

    @create(() => new XPos())
    xPos: XPos;

    @create(() => new YPos())
    yPos: YPos;

    get top(){
        return {tag: "div", attr: {class: "label"}, child: "Position"};
    }

    get middle(){
        return this.xPos;
    }

    get bottom(){
        return this.yPos;
    }

}

class XPos extends PixelPercentInputRow{

    @inject
    selectedSeries: EChartSeriesSettings;

    getLabel(){
        return "x";
    }

    get value(){
        return this.selectedSeries.centerX;
    }

    set value(v){
        this.selectedSeries.centerX = v;
    }

}

class YPos extends PixelPercentInputRow{

    @inject
    selectedSeries: EChartSeriesSettings;

    getLabel(){
        return "y";
    }

    get value(){
        return this.selectedSeries.centerY;
    }

    set value(v){
        this.selectedSeries.centerY = v;
    }

}

class DimensionsTriple extends TripleSurface {

    @create(() => new CenterInner())
    inner: CenterInner;

    @create(() => new CenterOuter())
    outer: CenterOuter;

    get top(){
        return {tag: "div", attr: {class: "label"}, child: "Radius"};
    }

    get middle(){
        return this.inner;
    }

    get bottom(){
        return this.outer;
    }

}

class CenterInner extends PixelPercentInputRow {

    @inject
    selectedSeries: EChartSeriesSettings;

    width = "rem";

    getLabel(){
        return "start";
    }

    get value(){
        return this.selectedSeries.insideRadius;
    }

    set value(v){
        this.selectedSeries.insideRadius = v;
    }

}

class CenterOuter extends PixelPercentInputRow {

    @inject
    selectedSeries: EChartSeriesSettings;

    width = "2rem";

    getLabel(){
        return "end";
    }

    get value(){
        return this.selectedSeries.outsideRadius;
    }

    set value(v){
        this.selectedSeries.outsideRadius = v;
    }

}

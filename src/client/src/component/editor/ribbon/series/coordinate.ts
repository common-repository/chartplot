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
 
import {RibbonContentSection} from "../base";
import {TripleSurface} from "../blocks/surface";
import {RibbonSelectButton} from "../blocks";
import {create, factory, init, inject} from "../../../../../../di";
import {EChartSettings} from "../../../echart/settings";
import {IconLabelSelectListItem, SelectList} from "../../../list/select";
import {GridSettings} from "../../../echart/settings/coordinates/grid";
import {EChartSeriesSettings} from "../../../echart/settings/series";
import {getIconShape, IconSet} from "../../../icon";
import {ChartHistory} from "../../../history";
import {ValueHistory} from "../../../history/value";
import {TooltipBlock} from "../blocks/tooltip";

export class SeriesCoordinateSection extends RibbonContentSection{

    label = "coordinates"

    @create(() => new SeriesCoordinateTriple())
    coordinates: SeriesCoordinateTriple;

    get contents(){
        return [this.coordinates];
    }

    tooltip = new TooltipBlock({title: "Series coordinates",  content: {
        tag: 'html',
        child: `
<p>Allows you to configure the coordinate system this series will use.</p>
        `
}});


}

class SeriesCoordinateTriple extends TripleSurface{

    @create(() => new SeriesCoordinateSelection())
    select: SeriesCoordinateSelection;

    @inject
    settings: EChartSettings;

    @inject
    selectedSeries: EChartSeriesSettings;

    @init
    init(){
        this.top = [this.select];
    }

    get middle(){
        const coord = this.settings.coordinates.coordinates.get(this.selectedSeries.coordinateIndex);
        if (coord){
            switch (coord.type){
                case "grid":
                    return [this.createXAxisSelection(<GridSettings>coord)];
            }
        }
        return [];
    }

    get bottom(){
        const coord = this.settings.coordinates.coordinates.get(this.selectedSeries.coordinateIndex);
        if (coord){
            switch (coord.type){
                case "grid":
                    return [this.createYAxisSelection(<GridSettings>coord)];
            }
        }
        return [];
    }

    @factory
    createXAxisSelection(selectedCoordinate: GridSettings){
        return new XAxisSelection(selectedCoordinate);
    }

    @factory
    createYAxisSelection(selectedCoordinate: GridSettings){
        return new YAxisSelection(selectedCoordinate);
    }

}

class SeriesCoordinateSelection extends RibbonSelectButton{

    @inject
    settings: EChartSettings;

    @inject
    selectedSeries: EChartSeriesSettings;

    @inject
    history: ChartHistory;

    createIndexSetter(index){
        return () => {
            this.history.executeCommand(new ValueHistory(this.selectedSeries.r_coordinateIndex, index));
        }
    }

    get label(){
        const coord = this.settings.coordinates.coordinates.get(this.selectedSeries.coordinateIndex);
        if (coord){
            return this.selectedSeries.coordinateIndex+": "+ coord.name;
        }
        return "none selected"
    }

    get icon(){
        const coord = this.settings.coordinates.coordinates.get(this.selectedSeries.coordinateIndex);
        if (coord){
            return coord.icon;
        }
        return getIconShape(IconSet.error);
    }

    getContent(){
        const dropwdown = new SelectList();
        const coords = this.settings.coordinates.coordinates.values;
        let coordIndex = 0;
        for (var i=0; i < coords.length; i++){
            const coord = coords[i];
            if (coord.type === "grid"){
                dropwdown.items.push(new IconLabelSelectListItem(coordIndex+": "+ (<GridSettings>coord).name, coord.icon).setAction(this.createIndexSetter(coordIndex)));
            }
            coordIndex++;
        }
        return dropwdown;
    }

    tooltip = new TooltipBlock({title: "Coordinate system", content: "If you have defined multiple coordinate systems, you can choose here which one this series will use."})

}

class XAxisSelection extends RibbonSelectButton{

    constructor(public selectedCoordinate: GridSettings){
        super();
    }

    @inject
    settings: EChartSettings;

    @inject
    selectedSeries: EChartSeriesSettings;

    @inject
    history: ChartHistory;

    createIndexSetter(index){
        return () => {
            this.history.executeCommand(new ValueHistory(this.selectedSeries.r_xAxisIndex, index));
        }
    }

    get label(){
        const coord = this.selectedCoordinate;
        const axis = (<GridSettings> coord).axes.getXAxisByIndex(this.selectedSeries.xAxisIndex);
        if (axis){
            return this.selectedSeries.xAxisIndex+": "+ axis.getName();
        }
        return "none selected"
    }

    get icon(){
        const coord = this.selectedCoordinate;
        const axis = (<GridSettings> coord).axes.getXAxisByIndex(this.selectedSeries.xAxisIndex);
        if (axis){
            return axis.getIcon();
        }
        return getIconShape(IconSet.error);
    }

    getContent(){
        const dropwdown = new SelectList();
        const coord = this.selectedCoordinate;
        coord.axes.axes.values.filter(a => a.coordinate === "x").forEach((ax, indx) => {
            dropwdown.items.push(new IconLabelSelectListItem(indx+": "+ ax.getName(), ax.getIcon()).setAction(this.createIndexSetter(indx)));
        });
        return dropwdown;
    }

    tooltip = new TooltipBlock({title: "X-Axis", content: "If the coordinate system has multiple x-axes, you can choose which one this series will use.."})

}

class YAxisSelection extends RibbonSelectButton{

    constructor(public selectedCoordinate: GridSettings){
        super();
    }

    @inject
    settings: EChartSettings;

    @inject
    selectedSeries: EChartSeriesSettings;

    @inject
    history: ChartHistory;

    createIndexSetter(index){
        return () => {
            this.history.executeCommand(new ValueHistory(this.selectedSeries.r_yAxisIndex, index));
        }
    }

    get label(){
        const coord = this.selectedCoordinate;
        const axis = (<GridSettings> coord).axes.getYAxisByIndex(this.selectedSeries.yAxisIndex);
        if (axis){
            return this.selectedSeries.yAxisIndex+": "+ axis.getName();
        }
        return "none selected"
    }

    get icon(){
        const coord = this.selectedCoordinate;
        const axis = (<GridSettings> coord).axes.getYAxisByIndex(this.selectedSeries.yAxisIndex);
        if (axis){
            return axis.getIcon();
        }
        return getIconShape(IconSet.error);
    }

    getContent(){
        const dropwdown = new SelectList();
        const coord = this.selectedCoordinate;
        coord.axes.axes.values.filter(a => a.coordinate === "y").forEach((ax, indx) => {
            dropwdown.items.push(new IconLabelSelectListItem(indx+": "+ ax.getName(), ax.getIcon()).setAction(this.createIndexSetter(indx)));
        });
        return dropwdown;
    }

    tooltip = new TooltipBlock({title: "Y-Axis", content: "If the coordinate system has multiple y-axes, you can choose which one this series will use.."})

}

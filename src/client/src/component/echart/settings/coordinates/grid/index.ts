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
 
import {removeEmptyProperties} from "../../../../../../../core/src/object";
import {AxisRibbonTab} from "../../../../editor/ribbon/coords/axis";
import {component, create,  factory, inject} from "../../../../../../../di";
import {AbstractChartSettings, IEChartSettingsComponent} from "../../base";
import {variable} from "../../../../../../../reactive";
import {Ribbon, TabSection} from "../../../../editor/ribbon";
import {getIconShape, IconSet} from "../../../../icon";
import {ICoordinateSettings} from "../index";
import {GridAxis, GridAxisCollection} from "./axis";
import {EditorSettings} from "../../../../editor/settings";
import {
    EChartPositionUtils,
    LeftRightDefaultPixelPercentRange,
    PixelPercentRange,
    TopBottomDefaultPixelPercentRange
} from "../../position";
import {GridTooltip} from "./tooltip";
import {CoordinateTooltipTab} from "../../../../editor/ribbon/coords/tooltip";
import {GlobalBarSettings} from "../bar";
import {ConfigBuilder} from "../../util";

@component("grid")
export class GridSettings extends AbstractChartSettings implements IEChartSettingsComponent, ICoordinateSettings{

    type = "grid";

    icon = getIconShape(IconSet.cartesian);

    @factory
    createSettings(){
        return new GridSettings();
    }

    @inject
    editorSettings: EditorSettings;

    bar = new GlobalBarSettings();

    builder = new ConfigBuilder();

    constructor(){
        super();
        this.builder.value("name", this.r_name);
    }

    xPos = new PixelPercentRange();
    xPosDefault = new LeftRightDefaultPixelPercentRange(this.xPos, 20);

    yPos = new PixelPercentRange();
    yPosDefault = new TopBottomDefaultPixelPercentRange(this.yPos, 40);

    @create(() => new GridTooltip())
    tooltip: GridTooltip;

    public r_name = variable<string>(null);

    get name(){
        return this.r_name.value || "no name";
    }

    set name(v){
        this.r_name.value = v;
    }

    getName(){
        return this.name;
    }

    public r_containLabel = variable(true);

    get containLabel(){
        return this.r_containLabel.value;
    }

    set containLabel(v){
        this.r_containLabel.value = v;
    }

    @create(() => new GridAxisCollection())
    axes: GridAxisCollection;

    public r_show = variable(null);

    get show(){
        return this.r_show.value;
    }

    set show(v){
        this.r_show.value = v;
    }

    createConfig(): any{
        var c = removeEmptyProperties({
            show: this.show,
            axes: this.axes.createConfig(),
            type: "grid",
            xPos: this.xPos.createConfig(),
            yPos: this.yPos.createConfig(),
            containLabel: this.containLabel,
            tooltip: this.tooltip.createConfig()
        });
        this.bar.builder.createConfig(c);
        return this.builder.createConfig(c);
    }

    applyConfig(config: any){
        if ("show" in config){
            this.show = config.show;
        }
        this.axes.applyConfig(config.axes || []);
        this.xPos.applyConfig(config.xPos || {});
        this.yPos.applyConfig(config.yPos || {});
        if ("containLabel" in config){
            this.containLabel = config.containLabel;
        }
        this.tooltip.applyConfig(config.tooltip || {});
        this.bar.builder.applyConfig(config);
        this.builder.applyConfig(config);
    }

    createEChartConfig(): any{
        var res = {
            show: this.show,
            containLabel: this.containLabel,
            tooltip: this.tooltip.createEChartConfig()
        };
        EChartPositionUtils.applyLeftRightWidthConfig(res, this.xPosDefault, 20);
        EChartPositionUtils.applyTopBottomHeightConfig(res, this.yPosDefault,  40);
        return removeEmptyProperties(res);
    }

    @factory
    createAxisTab(settings: GridSettings){
        var ax = new AxisRibbonTab(settings);
        return ax;
    }

    @factory
    createTooltipTab(settings: GridSettings){
        var tt = new CoordinateTooltipTab(settings.tooltip);
        tt.marginRight = "2rem";
        return tt;
    }

    private getGridSettings(): GridSettings{
        var res = this.editorSettings.options.chart.getFocusedElements()[0];
        if (res instanceof GridAxis){
            return res.grid;
        }
        return <GridSettings>res;
    }

    createAdditionalTabs(){
        const gs = this.getGridSettings();
        return [this.createAxisTab(gs), this.createTooltipTab(gs)];
    }


    lastAdded: TabSection;

    activateFocus(ribbon: Ribbon){
        const self = this;
        var section = new TabSection();
        section.name = [self.icon, " ", self.name];
        section.tabs.values = this.createAdditionalTabs();
        ribbon.sections.push(section);
        this.lastAdded = section;
    }

    deactivateFocus(ribbon: Ribbon){
        ribbon.sections.remove(ribbon.sections.indexOf(this.lastAdded));
        this.lastAdded = null;
    }

}

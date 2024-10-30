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
import {IChartSettingsComponent} from "../../../echart/settings/base";
import {removeEmptyProperties} from "../../../../../../core/src/object";

export class ViewOptions implements IChartSettingsComponent{

    public r_modus = variable<"edit" | "preview">("edit");

    get modus(){
        return this.r_modus.value;
    }

    set modus(v){
        this.r_modus.value = v;
    }

    public r_pixelGrid = variable(null);

    get pixelGrid(){
        return this.r_pixelGrid.value;
    }

    set pixelGrid(v){
        this.r_pixelGrid.value = v;
    }

    public r_grid = variable(null);

    get grid(){
        return this.r_grid.value;
    }

    set grid(v){
        this.r_grid.value = v;
    }

    getGrid(){
        return this.grid === null ? 2 : this.grid;
    }

    getPixelGrid(){
        return this.pixelGrid === null ? 10 : this.pixelGrid;
    }

    public r_useGrid = variable(true);

    get useGrid(){
        return this.r_useGrid.value;
    }

    set useGrid(v){
        this.r_useGrid.value = v;
    }

    public r_showConfiguration = variable(null);

    get showConfiguration(){
        return this.r_showConfiguration.value;
    }

    set showConfiguration(v){
        this.r_showConfiguration.value = v;
    }

    public r_activeScreen = variable<string>(null);

    get activeScreen(){
        return this.r_activeScreen.value;
    }

    set activeScreen(v){
        this.r_activeScreen.value = v;
    }

    public r_width = variable(400);

    get width(){
        return this.r_width.value;
    }

    set width(v){
        this.r_width.value = v;
    }

    public r_height = variable(300);

    get height(){
        return this.r_height.value;
    }

    set height(v){
        this.r_height.value = v;
    }

    createConfig(){
        return removeEmptyProperties({
            modus: this.modus,
            activeScreen: this.activeScreen,
            width: this.width,
            height: this.height,
            showConfiguration: this.showConfiguration
        });
    }

    applyConfig(c){
        if ("modus" in c){
            this.modus = c.modus;
        }
        else
        {
            this.modus = "edit";
        }
        if (c.activeScreen){
            this.activeScreen = c.activeScreen;
        }
        else
        {
            this.activeScreen = null;
        }
        if ("width" in c){
            this.width = c.width;
        }
        else
        {
            this.width = 400;
        }
        if ("height" in c){
            this.height = c.height;
        }
        else
        {
            this.height = 300;
        }
        if ("showConfiguration" in c){
            this.showConfiguration = c.showConfiguration;
        }
        else
        {
            this.showConfiguration = null;
        }
    }

}

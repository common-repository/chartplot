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
 
import {EChartSettings} from "../../echart/settings";
import {create, inject} from "../../../../../di";
import {IChartSettingsComponent} from "../../echart/settings/base";
import {OptionSettings} from "./options";
import {removeEmptyProperties} from "../../../../../core/src/object";
import {transaction, variable} from "../../../../../reactive";
import {ChartHistory} from "../../history";
import {TemporaryEditorSettings} from "./session/editor";

export class EditorSettings implements IChartSettingsComponent{

    public r_title = variable<string>("");

    get title(){
        return this.r_title.value;
    }

    set title(v){
        this.r_title.value = v;
    }

    @create(() => new EChartSettings())
    chart: EChartSettings

    @create(() => new OptionSettings())
    options: OptionSettings;

    @create(() => new TemporaryEditorSettings())
    temporary: TemporaryEditorSettings;

    @inject
    history: ChartHistory;

    createConfig(): any {
        return removeEmptyProperties({
            chart: this.chart.createConfig(),
            echart: this.chart.createEChartConfig(),
            options: this.options.createConfig()
        });
    }

    applyConfig(config: any) {
        this.chart.applyConfig(config.chart || {});
        this.options.applyConfig(config.options || {});
    }

    import(config: any){
        var originalConfig = this.createConfig();
        this.history.executeCommand({
            do: () => {
                transaction(() => {
                    try{
                        this.applyConfig(JSON.parse(config));
                    }catch (e){
                        this.applyConfig(originalConfig);
                        this.history.commandFailed();
                        alert("Import failed.");
                    }
                });
            },
            undo: () => {
                transaction(() => {
                    this.applyConfig(originalConfig);
                });
            }
        })
    }

}

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
 
import {BigRibbonButton} from "../blocks";
import {create, init, inject} from "../../../../../../di";
import {EditorSettings} from "../../settings";
import {getIconShape, IconSet} from "../../../icon";
import {RibbonContentSection} from "../base";
import {BigFileUploadButton} from "../blocks/input/file";
import {TooltipBlock} from "../blocks/tooltip";

declare var saveAs: any;

export class ExportChartSection extends RibbonContentSection{

    label = "configuration"

    @create(() => new ExportConfigurationButton())
    export: ExportConfigurationButton;

    @create(() => new ImportConfigurationButton())
    import: ImportConfigurationButton;

    get contents(){
        return [this.export, this.import];
    }

    tooltip = new TooltipBlock({title: "Chart configuration", content: 'Export or import the current chart configuration as a json file. You can use this in case you lose connection to your wordpress server to save your chart configuration offline.'});

}

export class ExportConfigurationButton extends BigRibbonButton{

    @inject
    editorSettings: EditorSettings;

    icon = getIconShape(IconSet.upload2)

    label = "export"

    @init
    init(){
        super.init();
        this.onClick.observe(c => {
            var config = this.editorSettings.createConfig();
      //      delete config.echart;
            var file = new File([JSON.stringify(config, null, 2)], "chart.json", {type: "text/plain;charset=utf-8"});
            saveAs(file);
        });
    }

    tooltip = new TooltipBlock({title: "Export configuration", content: "Export the current chart configuration as a json file. The file will be downloaded by your browser."});

}

export class ImportConfigurationButton extends BigFileUploadButton{

    @inject
    editorSettings: EditorSettings;

    icon = getIconShape(IconSet.download2)

    label = "import"

    onUpload(text){
        this.editorSettings.import(text);
    }

    tooltip = new TooltipBlock({title: "Import configuration", content: "Import a previously exported configuration file from your local disk."});

}

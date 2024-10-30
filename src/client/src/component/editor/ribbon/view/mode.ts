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
import {BigRibbonButton, buttonRadioGroup} from "../blocks";
import {getIconShape, IconSet} from "../../../icon";
import {create, init, inject} from "../../../../../../di";
import {EditorSettings} from "../../settings";
import {getWordpressChartplotUrl} from "../../../../wordpress/path";
import {TooltipBlock} from "../blocks/tooltip";

export class ViewModeSection extends RibbonContentSection{

    label = "mode"

    @create(() => new EditMode())
    edit: EditMode

    @create(() => new PlayMode())
    play: PlayMode

    get contents(){
        return [this.edit, this.play];
    }

}

export class EditMode extends BigRibbonButton {

    @inject
    editorSettings: EditorSettings;

    label = "edit"
    icon = getIconShape(IconSet.pencil)


    get selected(){
        return this.editorSettings.options.view.modus === "edit";
    }

    @init
    init(){
        super.init();
        this.onClick.observe( () => {
            this.editorSettings.options.view.modus = "edit";
        });
    }

    tooltip = new TooltipBlock({content: {
        tag: "html",
        child: `
<p>
This mode enables you to click on the different components of a chart, like the legend or title. Doing so will open
the settings for the clicked component.
</p>
<img width="400px" class="img-thumbnail" src="${getWordpressChartplotUrl()}/img/help/view/edit-mode.gif" />
        `
    }, title: "Edit mode"})

}

export class PlayMode extends BigRibbonButton {

    @inject
    editorSettings: EditorSettings;

    label = "preview"
    icon = getIconShape(IconSet.play3)

    get selected(){
        return this.editorSettings.options.view.modus === "preview";
    }

    @init
    init(){
        super.init();
        this.onClick.observe( () => {
            this.editorSettings.options.view.modus = "preview";
        });
    }

    tooltip = new TooltipBlock({content: {
        tag: "html",
        child: `In this mode, you can interact with the chart normally like when you publish it in your posts.`
    }, title: "Preview mode"})

}

export class ConfigurationMode extends BigRibbonButton {

    @inject
    editorSettings: EditorSettings;

    label = "show"

    tooltip = {
        tag: "html",
        child: `Shows the configuration of the chart.`
    }

    get selected(){
        return this.editorSettings.options.view.showConfiguration;
    }

    @init
    init(){
        super.init();
        this.onClick.observe(() => {
            this.editorSettings.options.view.showConfiguration = !this.editorSettings.options.view.showConfiguration;
        });
    }

}

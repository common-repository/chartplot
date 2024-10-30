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
 
import {create} from "../../../../../di";
import {SaveButton} from "./save";
import {RedoButton, UndoButton} from "./history";
import {MaximizeButton} from "./maximize";
import {ErrorButton} from "./error";
import {TooltipEnabledSelect} from "./tooltip";
import {PlayToolbarButton} from "./play";

export class Toolbar{

    tag: "div";
    attr: any;

    @create(() => new UndoButton())
    undo: UndoButton;

    @create(() => new RedoButton())
    redo: RedoButton;

    @create(() => new SaveButton())
    save: SaveButton;

    get child(){
        return [{tag: "div", attr: {class: "divider"}}, this.undo, this.redo, this.save, {tag: "div", attr:{class: "divider"}}];
    }

}

Toolbar.prototype.tag = "div";
Toolbar.prototype.attr = {
    class: "toolbar"
}

export class RightToolbar{

    tag: "div";
    attr: any;

    @create(() => new PlayToolbarButton())
    play: PlayToolbarButton;

    @create(() => new MaximizeButton())
    maximize: MaximizeButton;

    @create(() => new ErrorButton())
    error: ErrorButton;

    @create(() => new TooltipEnabledSelect())
    tooltip: TooltipEnabledSelect;

    get child(){
        return [this.play, this.tooltip, this.error, this.maximize];
    }
}

RightToolbar.prototype.tag = "div";
RightToolbar.prototype.attr = {
    class: "toolbar right"
}

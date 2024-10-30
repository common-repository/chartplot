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
 
import {init, inject} from "../../../../../di";
import {ChartHistory} from "../../history";
import {ToolbarButton} from "./button";
import {getIconShape, IconSet} from "../../icon";
import {NormalRibbonButton} from "../ribbon/blocks";

export class UndoButton extends NormalRibbonButton{

    classPrefix = "dark-"

    @inject
    history: ChartHistory;

    action(event){
        this.history.undo();
    }

    get disabled(){
        return !this.history.canUndo();
    }

    icon = getIconShape(IconSet.undo)

    @init
    init(){
        super.init();
        this.onClick.observe(c => {
            this.action(c);
        });
    }

    tooltip = "Undo the last change that was done to the chart."

}

export class RedoButton extends NormalRibbonButton{

    classPrefix = "dark-"

    @inject
    history: ChartHistory;

    action(event){
        this.history.do();
    }

    get disabled(){
        return !this.history.canDo();
    }

    icon = getIconShape(IconSet.redo)

    @init
    init(){
        super.init();
        this.onClick.observe(c => {
            this.action(c);
        });
    }

    tooltip = "Redo the last undone change."

}

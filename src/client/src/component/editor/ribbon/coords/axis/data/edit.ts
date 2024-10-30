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
 
import {EditDataRibbonSection} from "../../../blocks/table/edit";
import {create, init, inject} from "../../../../../../../../di";
import {Editor} from "../../../../index";
import {GridAxis} from "../../../../../echart/settings/coordinates/grid/axis";


export class CategoriesDataEditSection extends EditDataRibbonSection {

    @inject
    editor: Editor

    @inject
    axis: GridAxis

    @create(function(this: CategoriesDataEditSection){
        return this.axis.data;
    })
    data

    get contents(){
        var f = this.tripleSurface({
            top: this.addRow,
            middle: this.addRowBelow,
            bottom: this.removeRow
        })
        var d3 = this.tripleSurface({
            top: this.value,
            middle: this.resetTable,
            bottom: this.delete
        })
        return [f, d3];
    }

    @init
    init(){
        this.resetTable.reset = [[""], [""], [""], [""], [""], [""], [""]];
    }

}

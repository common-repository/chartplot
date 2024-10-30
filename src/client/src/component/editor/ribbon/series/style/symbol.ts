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
import {RibbonSelectButton} from "../../blocks";
import {create, define, init, inject} from "../../../../../../../di";
import {EChartSeriesSettings} from "../../../../echart/settings/series";
import {ChartHistory} from "../../../../history";
import {LabelSelectListItem, SelectList} from "../../../../list/select";
import {ValueHistory} from "../../../../history/value";
import {TripleSurface} from "../../blocks/surface";
import {HistoryNumberInput, NumberInput} from "../../blocks/input";
import {HistoryCheckboxInput} from "../../blocks/checkbox";
import {BorderColorButton, BorderType, BorderWidthInput} from "../../blocks/style/border";
import {ExpandedSettings, SettingsSection} from "../../blocks/expand/settings";
import {SeriesRowDataCell} from "../../../../echart/settings/series/data/row";
import {BackgroundColorButton} from "../../blocks/style/text";
import {TooltipBlock} from "../../blocks/tooltip";
import {OpacityInput} from "../../blocks/style/opacity";

type SeriesDataSymbolSettings = EChartSeriesSettings | SeriesRowDataCell;

export class SeriesSymbolSection extends RibbonContentSection{

    @define
    symbolHolder: SeriesDataSymbolSettings;

    constructor(symbolHolder: SeriesDataSymbolSettings){
        super();
        this.symbolHolder = symbolHolder;
    }

    label = "symbol";

    @create(() => new SymbolTriple())
    triple: SymbolTriple;

    get contents(){
        return [this.triple];
    }


    @create(function(this: SeriesSymbolSection){
        return new SymbolExpandSettings();
    })
    expand: ExpandedSettings;

}

class SymbolTriple extends TripleSurface{

    @inject
    series: EChartSeriesSettings;

    @create(() => new Symbol())
    symbol: Symbol;

    @create(() => new SymbolSize())
    size: SymbolSize;

    @create(() => new SymbolShow())
    show: SymbolShow;

    get top(){
        return [this.show];
    }

    get middle(){
        return [this.symbol];
    }

    get bottom(){
        return [this.size];
    }

}

var symbolToLabel = {
    default: "Default",
    circle: "Circle",
    rect: "Rectangle",
    roundRect: "Rectangle rounded",
    triangle: "Triangle",
    diamond: "Diamond",
    pin: "Pin",
    arrow: "Arrow",
    "circle empty": "Circle empty"
}

class Symbol extends RibbonSelectButton{

    @inject
    symbolHolder: SeriesDataSymbolSettings;

    @inject
    series: EChartSeriesSettings;

    @inject
    history: ChartHistory;

    get default(){
        if (this.symbolHolder === this.series){
            return "circle empty";
        }
        return "default";
    }

    symbols = ["circle empty", "circle", "rect", "roundRect", "triangle", "diamond", "pin", "arrow"];

    get label(){
        return symbolToLabel[this.symbolHolder.symbol || this.default];
    }

    getContent(){
        var list = new SelectList();
        this.symbols.forEach(s => {
            list.items.push(new LabelSelectListItem(symbolToLabel[s || this.default]).setAction(() => {
                if (s === "default" || s === "circle empty"){
                    s = null;
                }
                if (s !== this.symbolHolder.symbol){
                    this.history.executeCommand(new ValueHistory(this.symbolHolder.r_symbol, s));
                }
            }));
        })
        return list;
    }

    @init
    init(){
        super.init();
        if (this.symbolHolder !== this.series){
            this.symbols.shift();
            this.symbols.unshift("default");
        }
        this.tooltip = new TooltipBlock({title: "Symbol shape", content: "The shape of the symbol. 'circle empty' is a special shape that always renders a circle with a white fill."});
    }

}

class SymbolSize extends NumberInput{

    label = "size";

    @inject
    symbolHolder: SeriesDataSymbolSettings

    @inject
    series: EChartSeriesSettings

    @inject
    history: ChartHistory;


    get default(){
        return null;
    }

    set default(v){

    }

    changeValue(v){
        if (v !== this.symbolHolder.symbolSize){
            this.history.executeCommand(new ValueHistory(this.symbolHolder.r_symbolSize, v));
        }
    }

    set value(v){
        this.symbolHolder.symbolSize = v;
    }

    get value(){
        var ss = this.symbolHolder.symbolSize;
        if (ss !== null){
            return ss;
        }
        return this.default;
    }

    getClass(){
        return super.getClass()+" small-input";
    }

    tooltip = new TooltipBlock({title: "Symbol size", content: "The size of the symbol."});
}

class SymbolShow extends HistoryCheckboxInput {

    label = "show";

    @inject
    series: EChartSeriesSettings;

    @inject
    symbolHolder: SeriesDataSymbolSettings;

    get default(){
        if (this.series === this.symbolHolder){
            return true;
        }
        var ss = this.series.showSymbol;
        if (ss !== null){
            return ss;
        }
        return true;
    }

    set default(v){

    }

    @init
    init() {
        super.init();
        this.r_value = this.symbolHolder.r_showSymbol;
    }

    tooltip = new TooltipBlock({title: "Show symbol", content: "Whether to render the symbol."})

}

class SymbolExpandSettings extends ExpandedSettings{

    @create(() => new SymbolBorderSection())
    borderSection: SymbolBorderSection;

    @create(() => new GeneralSymbolSection())
    general: GeneralSymbolSection;

    @init
    init(){
        this.child.push(this.general);
        this.child.push(this.borderSection);
    }

}

class GeneralSymbolSection extends SettingsSection{

    @inject
    series: EChartSeriesSettings;

    @inject
    symbolHolder: SeriesDataSymbolSettings;

    @create(function(this: GeneralSymbolSection){
        var opacity = new OpacityInput();
        opacity.itemName = "Symbol";
        opacity.r_value = this.symbolHolder.itemStyle.r_opacity;
        return opacity;
    })
    opacity: HistoryNumberInput;

    @create(function(this: GeneralSymbolSection){
        var col = new BackgroundColorButton(this.symbolHolder.r_symbolColor);
        col.labelPrefix = "Symbol color";
        col.colorInputLabel = "Symbol color";
        return col;
    })
    color: BackgroundColorButton;

    label = "General";

    @init
    init(){
        //this.row().item(this.color);
        this.row().item(this.opacity);
    }

}

class SymbolBorderSection extends SettingsSection{

    label = "Border";

    @inject
    series: EChartSeriesSettings;

    @inject
    symbolHolder: SeriesDataSymbolSettings;

    @create(function(this: SymbolBorderSection){
        var res = new BorderColorButton(this.symbolHolder.itemStyle.r_borderColor);
        res.label = "Color";
        return res;
    })
    color: BorderColorButton;

    @create(function(this: SymbolBorderSection){
        var w = new BorderWidthInput(this.symbolHolder.itemStyle.r_borderWidth);
        w.default = null;
        w.min = 0;
        return w;
    })
    width: BorderWidthInput;

    @create(function(this: SymbolBorderSection){
        var bt = new BorderType(this.symbolHolder.itemStyle.r_borderType);
        return bt;
    })
    type: BorderType;


    @init
    init(){
        this.row().item(this.type);
        this.row().item(this.color);
        this.row().item(this.width);
    }

}

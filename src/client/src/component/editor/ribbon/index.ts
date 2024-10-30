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
 
import {array, procedure, transaction, unchanged, unobserved, variable} from "../../../../../reactive";
import {create, factory, init, inject} from "../../../../../di";
import {ChartRibbonTab} from "./chart";
import {RibbonContentSection, RibbonTab} from "./base";
import {ViewRibbonTab} from "./view";
import {DataRibbonTab} from "./data";
import {SeriesRibbonTab} from "./series";
import {ComponentRibbonTab} from "./components";
import {CoordinatesRibbonTab} from "./coords";
import {EditorSettings} from "../settings";
import {IHtmlNodeShape, IHtmlShapeTypes} from "../../../../../html/src/html/node";
import {HashMap} from "../../../collection/hash";
import {EditorMenu, IRibbonSectionHighlight} from "../menu";
import {Editor} from "../index";
import {ExpandedSettings} from "./blocks/expand/settings";
import {ExpandButton} from "./blocks/expand/expand";
import {ITooltipHolder, TooltipManager} from "./blocks/tooltip";

export class TabSection{

    name: any;

    public tabs = array<RibbonTab>([]);

}

export class Ribbon{

    public r_tabs = variable<RibbonTab[]>([]);

    get tabs(){
        return this.r_tabs.value;
    }

    set tabs(v){
        this.r_tabs.value = v;
    }

    public sections = array<TabSection>([]);

    @create(() => new RibbonHeader())
    header: RibbonHeader;

    @create(() => new RibbonContent())
    content: RibbonContent;

    @create(() => new ChartRibbonTab())
    chart: ChartRibbonTab;

    @create(() => new SeriesRibbonTab())
    series: SeriesRibbonTab;

    @create(() => new ComponentRibbonTab())
    component: ComponentRibbonTab;

    @create(() => new ViewRibbonTab())
    view: ViewRibbonTab;

    @create(() => new DataRibbonTab())
    data: DataRibbonTab;

    @create(() => new CoordinatesRibbonTab())
    coordinates: CoordinatesRibbonTab;

    @inject
    editorSettings: EditorSettings;

    @inject
    menu: EditorMenu

    @init
    init(){
        this.r_tabs.listener(val => {
            let std: RibbonTab[] = [this.chart, this.series, this.coordinates, this.component, this.view];
            this.sections.values.forEach(s => {
                s.tabs.forEach(t => {
                    std.push(t);
                })
            })
            val.value = std;
        });
        var lastFocusedEls = [];
        procedure(p => {
            const focusedEls = this.editorSettings.options.chart.getFocusedElements();
            const newLast = [];
            const toDeactivate = [];
            const toActivate = [];
            for (var i=0; i < focusedEls.length; i++){
                var focused = focusedEls[i];
                var lastFocused = lastFocusedEls[i];
                if (!focused || lastFocused === focused){
                    if (!focused){
                        lastFocused && lastFocused.deactivateFocus && toDeactivate.push(lastFocused);
                    }
                    newLast.push(focused);
                    continue;
                }
                else
                {
                    if (lastFocused){
                        lastFocused.deactivateFocus && toDeactivate.push(lastFocused);
                    }
                }
                newLast.push(focused);
                toActivate.push(focused);
            }
            for (; i < lastFocusedEls.length; i++){
                lastFocused = lastFocusedEls[i];
                lastFocused && lastFocused.deactivateFocus && toDeactivate.push(lastFocused);
            }
            for (var i = toDeactivate.length -1; i >= 0; i--){
                toDeactivate[i].deactivateFocus(this);
            }
            for (var i=0; i < toActivate.length; i++){
                var nl = toActivate[i];
                nl && nl.activateFocus(this);
            }

            lastFocusedEls = newLast;
        });
    }

    get activeTab(){
        return this.editorSettings.options.ribbon.selectedTab;
    }

    public r_activeLastTab = variable(-1);

    get activeLastTab(){
        return this.r_activeLastTab.value;
    }

    set activeLastTab(v){
        this.r_activeLastTab.value = v;
    }

    setActiveTab(tab: number){
        transaction(() => {
            this.editorSettings.options.ribbon.selectedTab = tab;
        });
    }
}

export class RibbonHeader{

    @inject
    ribbon: Ribbon;

    @inject
    editorSettings: EditorSettings;

    @inject
    editor: Editor;


    @factory
    createTooltipManager(th: ITooltipHolder){
        return new TooltipManager(th);
    }

    tag: string;

    attr = {
        class: "ribbon-header"
    }

    get child(){
        const self = this;
        function click(){
            self.ribbon.setActiveTab(this.index);
        }
        const highlighted = this.editorSettings.options.ribbon.highlightedTabs;
        var result: any[] = [];
        for (var index=0; index < 5; index++){
            var tab = this.ribbon.tabs[index];
            var res: any = {
                tag: "li",
                child: tab.name,
                index: index,
                event: {
                    click: click.bind({index: index})
                },
                tooltip: tab.tooltip,
                attr: {
                    index: index,
                    get class(){
                        if (this.index === self.ribbon.activeLastTab){
                            return "active";
                        }
                        if (highlighted.indexOf(this.index) > -1){
                            return "highlighted"
                        }
                        return "";
                    }
                }
            }
            if (tab.tooltip){
                var tm = this.createTooltipManager(res);
                tm.initEvents(res.event);
            }
            result.push(res);
        }
        var highlighters: IRibbonSectionHighlight[] = [];
        this.ribbon.sections.forEach(sec => {
            var si = index;
            sec.tabs.forEach(t => {
                var indexes = t.additionalIndexes.concat(index);
                var r: any = {
                    tag: "li",
                    index: index,
                    child: t.name,
                    event: {
                        click: click.bind({index: indexes})
                    },
                    tooltip: t.tooltip,
                    attr: {
                        index: index,
                        get class(){
                            if (this.index === self.ribbon.activeLastTab){
                                return "active";
                            }
                            if (highlighted.indexOf(this.index) > -1){
                                return "highlighted"
                            }
                            return "";
                        }
                    },
                    style: {
                        marginLeft: t.marginLeft,
                        get marginRight(){
                            return t.marginRight;
                        }
                    }
                }
                if (t.tooltip){
                    var tm = this.createTooltipManager(r);
                    tm.initEvents(r.event);
                }
                index++;
                result.push(r);
            });
            highlighters.push({
                label: sec.name,
                startIndex: si,
                endIndex: index - 1
            });
        });
        this.editor.menu.ribbonSectionHighlight = highlighters;
        return result;
    }

    node: IHtmlNodeShape

    getTabRange(startIndex: number, endIndex: number){
        if (!this.node){
            return {start: -1, end: -1};
        }
        const si = <HTMLElement>this.node.element.childNodes[startIndex];
        const ei = <HTMLElement>this.node.element.childNodes[endIndex];
        if (!si || !ei){
            return {start: -1, end: -1};
        }
        return {
            start: si.offsetLeft,
            end: ei.offsetLeft+ei.offsetWidth+ parseInt(getComputedStyle(ei).marginRight || "0")
        }
    }

}

RibbonHeader.prototype.tag = "ul";

export class RibbonContent{

    @inject
    ribbon: Ribbon;

    @inject
    editorSettings: EditorSettings;

    tag: "div";
    attr: any;

    private childMap = new HashMap<RibbonContentSection, IHtmlShapeTypes>();

    public r_activeTab = variable<RibbonTab>(null);

    get activeTab(){
        return this.r_activeTab.value;
    }

    set activeTab(v){
        this.r_activeTab.value = v;
    }

    @factory
    createExpandButton(settings: ExpandedSettings){
        var button = new ExpandButton();
        button.settings = settings;
        return button;
    }

    @factory
    createTooltipManager(th: ITooltipHolder){
        return new TooltipManager(th);
    }

    get child(){
        var at = this.activeTab;
        if (at){
            var vals = at.contents;
            var newChildMap = new HashMap<RibbonContentSection, IHtmlShapeTypes>();
            var res = vals.map(v => {
                let res = this.childMap.get(v);
                if (!res){
                    let footer: any = {
                        tag: "div",
                        attr: {class: "section-footer"},
                        tooltip: v.tooltip,
                        child: [{
                            tag: "div",
                            attr: {class: "section-label"},
                            get child(){
                                return v.label;
                            }
                        }, v.expand ? this.createExpandButton(v.expand): ""],
                        event: {

                        }
                    }
                    const contentNode = {
                        tag: "div",
                        attr: {class: "section-content"},
                        get child(){
                            return v.contents;
                        }
                    };
                    v.contentNode = contentNode;
                    res = {
                        tag: "div",
                        attr: {
                            class: "section"
                        },
                        child: [contentNode, footer]
                    };
                    if (v.tooltip){
                        var tm = this.createTooltipManager(footer);
                        tm.initEvents(footer.event);
                    }
                }
                newChildMap.put(v, res);
                return res;
            });
            var s = [];
            for (var i=0; i < res.length; i++){
                s.push(res[i]);
                if (i < res.length - 1){
                    s.push({
                        tag: "div",
                        attr: {class: "divider"}
                    });
                }
            }
            this.childMap = newChildMap;
            return s;
        }
        return "";
    }

    @init
    init(){
        this.r_activeTab.listener(val => {
            const v = val.value;
            var activeTabs = this.ribbon.activeTab;
            if (!Array.isArray(activeTabs)){
                activeTabs = [activeTabs];
            }
            this.ribbon.activeLastTab = -1;
            for (var i=activeTabs.length; i >= 0; i--){
                var ar = this.ribbon.tabs[activeTabs[i]];
                if (ar){
                    this.ribbon.activeLastTab = activeTabs[i];
                    break;
                }
            }
            if (v && v !== ar){
                v.deactivate();
                if (ar){
                    ar.activate();
                }
            }
            if (!v && ar){
                ar.activate();
            }
            val.value = ar;
        });
    }

}

RibbonContent.prototype.tag = "div";
RibbonContent.prototype.attr = {
    class: "ribbon-content"
}

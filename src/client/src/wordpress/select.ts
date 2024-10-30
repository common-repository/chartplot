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
 
import {assemble, component, create, define, init, inject} from "../../../di";
import {array, node, procedure, variable} from "../../../reactive";
import {attach, detach} from "../../../html";
import {ChartHeight, ChartWidth, Options} from "./select/options";
import {TextInput} from "../component/editor/ribbon/blocks/input";
import {PopupStack, SinglePopupSystem} from "../component/popup";
import {NormalRibbonButton} from "../component/editor/ribbon/blocks";
import {getIconShape, IconSet} from "../component/icon";

declare var chartplot_settings: any;
declare var jQuery: any;

class CloseSelection extends NormalRibbonButton{

    icon = getIconShape(IconSet.cross);

    @inject
    selection: WordpressChartSelection;

    @init
    init(){
        super.init();
        this.onClick.observe(c => {
            this.selection.close();
        });
    }

}

class Editor{
    shapes = array();
}

export class GutenbergBlock{

    tag = "div";
    attr: any;
    style: any;
    public props: any = {};
    public chartCache: any = {};
    public $r = node();

    public r_chartId = variable(-1);

    get chartId(){
        return this.r_chartId.value;
    }

    set chartId(v){
        this.r_chartId.value = v;
    }

    constructor(){
        const self = this;
        this.attr = {
            class: "components-placeholder editor-media-placeholder wp-block-gallery",
        }
    }

    reload(props: any, chartCache: any){
        this.props = props;
        this.chartCache = chartCache;
        this.initChart();
        this.$r.changedDirty();
    }

    @create(function(this: GutenbergBlock){
        var o = this.chartSelection.options;
        return o;
    })
    options: Options;

    @create(function(this: GutenbergBlock){
        return this.chartSelection.popupSystem;
    })
    popupSystem: SinglePopupSystem;

    @create(() => {
        var w = new ChartWidth();
        w.immediateChange();
        return w;
    })
    width: ChartWidth;

    @create(() => {
        var h = new ChartHeight();
        h.immediateChange();
        return h;
    })
    height: ChartHeight;

    @create(function(this: GutenbergBlock){
        return new WordpressChartSelection(this);
    })
    chartSelection: WordpressChartSelection;
    mustRerequest = false;

    get child(){
        this.$r.observed();
        const self = this;
        var r = this.results;
        const icon = {
            tag: "svg",
            attr: {width: 20, height: 20, viewBox:"0 0 48 48", class: "dashicon dashicons-format-image"},
            child: {
                tag: "g",
                child: [{tag: "path", attr: {d: "M0,19.9H9.3A15.16,15.16,0,0,1,19.8,9.3V0A24.34,24.34,0,0,0,0,19.9Z"}},
                    {tag: "path", attr: {d: "M48,24a28.28,28.28,0,0,1-.3,4.1A24.46,24.46,0,0,1,27.9,48V38.7A15.16,15.16,0,0,0,38.4,28.1a15.88,15.88,0,0,0,0-8.1A15.3,15.3,0,0,0,27.9,9.3V0A24.46,24.46,0,0,1,47.7,19.9,28.28,28.28,0,0,1,48,24Z"}},
                    {tag: "path", attr: {d: "M32.8,24A9,9,0,1,1,16,19.5a8.72,8.72,0,0,1,3.3-3.3A9,9,0,0,1,32.8,24Z"}}]
            }
        }
        var title = {
            tag: "div",
            attr: {
                class: "components-placeholder__label"
            },
            style: {
                fontSize: "1rem"
            },
            child: [icon, {
                tag: "span",
                get child(){
                    if (r && r.id){
                        return r.title || "No title";
                    }
                    return "Please select a chart"
                }
            }]
        };
        if (r === null){
            r = this.chartCache[this.chartId] || null;
        }
        if (r === null){
            return [title, "Loading ..."];
        }

        if (!r.id){
            return [title, {
                tag: "button",
                attr: {
                    class: "components-button editor-media-placeholder__button is-button is-default is-large"
                },
                child: "Select chart",
                event: {
                    click: () => {
                        this.chartSelection.attach();
                    }
                }
            }]
        }

        function row(title, content){
            return {tag: "tr",child:  [{tag: "th", style: {textAlign: "right", paddingRight: "1rem"}, child: title}, {tag: "td", style: {textAlign: "left"}, get child(){
                        return content;
                    }}]}
        }

        return {
            tag: "table",
            attr: {
                class: "chartplot-chart-select-table chartplot-selection-options"
            },
            style: {
                width: "100%"
            },
            child: [{
                tag: "thead",
                child: {tag: "tr", child: {tag: "td", attr:{colspan: "2"}, child: [icon, " Chartplot"]}}
            },{
                tag: "tbody",
                child:[row("Id", r.id || "No id"),
                    row("Title", r.title || "No title"),
                    {tag: "tr", child: {tag: "td", attr:{colspan: "2"}, child: r.image ? {tag: "img", style: {maxHeight: "300px"}, attr: {src: r.image}} : ""}},
                    {tag: "tr", child: {tag: "td", attr:{colspan: "2"}, child: {
                                tag: "button",
                                attr: {
                                    class: "components-button editor-media-placeholder__button is-button is-default is-large"
                                },
                                child: "Select another chart",
                                event: {
                                    click: () => {
                                        this.chartSelection.attach();
                                    }
                                }
                            }}},
                    {tag: "tr", child: {tag: "td", style: {textAlign: "left"}, attr: {colspan: "2"}, child: this.width}},
                    {tag: "tr", child: {tag: "td", style: {textAlign: "left"}, attr: {colspan: "2"}, child: this.height}},
                    {tag: "tr", child: {tag: "td", style: {textAlign: "left"}, attr: {colspan: "2"}, child: {
                        tag: "button",
                        child: "Save settings",
                        attr:{
                            class: "btn btn-secondary btn-sm"
                        },
                        event: {
                            click: () => {
                                this.insertOptions(this.chartSelection.options.toJson());
                            }
                        },
                        prop: {
                            get disabled(){
                                var r = self.width.value === self.props.attributes.width &&
                                    self.height.value === self.props.attributes.height;
                                return r;
                            }
                        }
                    }}}
                    ]
            }]
        }
    }

    onDetached(){
        this.chartSelection.close();
    }

    insertOptions(content){
        this.props.setAttributes(content);
    }

    public r_isExecuting = variable(null);

    get isExecuting(){
        return this.r_isExecuting.value;
    }

    set isExecuting(v){
        this.r_isExecuting.value = v;
    }

    public r_results = variable<any>(null);

    get results(){
        return this.r_results.value;
    }

    set results(v){
        this.r_results.value = v;
    }

    requestData(){
        const self = this;
        var chartId = this.chartId;
        const request = {
            url: chartplot_settings.ajaxurl,
            type: 'POST',
            data: {
                action: 'chartplot_get_chart',
                id: this.chartId
            },
            success: function( result ) {
                const results = JSON.parse(result);
                self.isExecuting = false;
                if (self.mustRerequest){
                    self.mustRerequest = false;
                    self.requestData();
                }else
                {
                    self.chartCache[chartId] = result;
                    self.results = results;
                }
            },
            error: () => {
                self.results = "error";
                this.isExecuting = false;
            }
        };
        if (this.isExecuting){
            this.mustRerequest = true;
            return;
        }
        this.isExecuting = true;
        jQuery.ajax(request);
    }


    initChart(){
        this.options.initialized = false;
        var chart = this.props.attributes || {};
        this.chartSelection.options.fromJson(chart);
        this.chartId = chart.id;
        if (chart.width || chart.height){
            this.options.initialized = true;
        }
    }

    @init
    init(){
        this.initChart();
        this.options.initialized = false;
        procedure(() => {
            this.requestData();
        });
    }

}

@component("selection")
export class WordpressChartSelection{

    tag="div";
    attr: any;
    @define
    tinymce_editor: any;

    @create(() => new SinglePopupSystem())
    popupSystem: SinglePopupSystem;

    @create(() => new PopupStack())
    popupStack: PopupStack;

    @create(() => new CloseSelection())
    closeSelection: CloseSelection;

    constructor(editor){
        this.tinymce_editor = editor;
    }

    @create(() => new SearchTable())
    table: SearchTable;

    @create(() => new Options())
    options: Options;

    @create(() => new Editor())
    editor: Editor;

    private children: any[];

    @init
    init(){
        this.attr = {
            class: "chartplot-main"
        }
        this.children = [{
            tag: "div",
            attr: {
                class: "chartplot-select-container card"
            },
            child: [{
                tag: "div",
                attr: {
                    class: "card-body"
                },
                child: [{
                    tag: "div",
                    attr: {class: "close-holder"},
                    child: this.closeSelection
                },this.options, this.table.tableControl, {
                    tag: "div",
                    attr: {
                        class: "table-card"
                    },
                    child: [this.table]
                }]
            }]
        }, {
            tag: "div",
            attr: {
                class: "media-modal-backdrop"
            },
            event: {
                click: () => {
                    this.close();
                }
            }

        }];
    }

    attach(){
        attach(document.body, this);
    }

    close(){
        detach(this);
    }

    get child(){
        const self = this;
        return {
            tag: "div",
            attr:{
                class: "chartplot-editor"
            },
            get child(){
                return self.children.concat(self.editor.shapes.values);
            }
        }
    }

}

class SearchInput extends TextInput{

    label = " Search"

}

class SearchTableControl{

    tag = "div";
    attr: any;

    @inject
    table: SearchTable;

    public r_posts_per_page = variable(5);

    get posts_per_page(){
        return this.r_posts_per_page.value;
    }

    set posts_per_page(v){
        this.r_posts_per_page.value = v;
    }

    public r_paged = variable(1);

    get paged(){
        return this.r_paged.value;
    }

    set paged(v){
        this.r_paged.value = v;
    }

    constructor(){
        this.attr = {
            class: "table-control"
        }
    }

    @create(() => new SearchInput())
    search: SearchInput;

    createPageJumber(page: number){
        return () => {
            this.paged = page;
        }
    }

    get child(){
        const self = this;
        const results = this.table.results;
        var post_count: number;
        var page: number = this.paged;
        var max_num_pages: number;
        if (!results){
            post_count = 0;
            max_num_pages = 1;
        }
        else
        {
            post_count = results.post_count;
            max_num_pages = Math.max(results.max_num_pages, 1);
        }
        if (this.paged > max_num_pages){
            this.paged = max_num_pages;
        }
        var toBegin = {
            tag: "button",
            child: "<<",
            attr: {
                disabled: page === 1 ? "disabled" : undefined,
                class: "btn btn-secondary btn-sm"
            },
            event: {
                click: () => {
                    if (page !== 1){
                        this.paged = 1;
                    }
                }
            }
        }
        var leftLinks = [];
        for (var i = Math.min(max_num_pages, Math.max(1, page - 2)); i < page; i++){
            leftLinks.push({
                tag: "button",
                child: i+"",
                attr: {
                    class: "btn btn-secondary btn-sm"
                },
                event: {
                    click: this.createPageJumber(i)
                }
            })
        }
        leftLinks.push({
            tag: "button",
            attr: {
                class: "btn btn-secondary  btn-sm",
                disabled: "disabled"
            },
            child: page+""
        })
        const rightLinks = [];
        for (var i = Math.max(0, Math.min(max_num_pages, page + 2)); i > page; i--){
            rightLinks.unshift({
                tag: "button",
                child: i+"",
                attr: {
                    class: "btn btn-secondary btn-sm"
                },
                event: {
                    click: this.createPageJumber(i)
                }
            })
        }
        var toEnd = {
            tag: "button",
            child: ">>",
            attr: {
                disabled: page === max_num_pages ? "disabled" : undefined,
                class: "btn btn-secondary btn-sm"
            },
            event: {
                click: () => {
                    if (page !== max_num_pages){
                        this.paged = max_num_pages;
                    }
                }
            }
        }
        return [{
            tag: "div",
            attr: {
                class: "pages"
            },
            child: [toBegin].concat(leftLinks).concat(rightLinks).concat([toEnd])
        },{
            tag: "div",
            attr: {
                class: "search-info"
            },
            get child(){
                if (self.table.isExecuting){
                    return "Loading charts..."
                }
                return ["Showing page "+page+" of "+max_num_pages];
            }
        },{
            tag: "div",
            attr: {
                class: "search-container"
            },
            child: this.search
        }];

    }

}

class SearchTable{

    @inject
    tinymce_editor: any;

    @inject
    selection: WordpressChartSelection;

    @create(() => new SearchTableControl())
    tableControl: SearchTableControl;

    @inject
    options: Options

    tag="div";
    attr: any;
    mustRerequest = false;
    public r_error = variable(null);

    get error(){
        return this.r_error.value;
    }

    set error(v){
        this.r_error.value = v;
    }

    public r_isExecuting = variable(false);

    get isExecuting(){
        return this.r_isExecuting.value;
    }

    set isExecuting(v){
        this.r_isExecuting.value = v;
    }

    public r_results = variable<any>(null);

    get results(){
        return this.r_results.value;
    }

    set results(v){
        this.r_results.value = v;
    }

    constructor(){
        this.attr = {
            class: ""
        }
    }

    @init
    init(){
        procedure(() => {
            this.requestData();
        });
    }

    requestData(){
        const self = this;
        const request = {
            url: chartplot_settings.ajaxurl,
            type: 'POST',
            data: {
                action: 'chartplot_query_charts',
                posts_per_page: this.tableControl.posts_per_page,
                paged: this.tableControl.paged,
                query: this.tableControl.search.value
            },
            success: function( result ) {
                self.results = JSON.parse(result);
                self.isExecuting = false;
                if (self.mustRerequest){
                    self.mustRerequest = false;
                    self.requestData();
                }
                if (!self.options.initialized){
                    self.options.width = self.results.settings.width;
                    self.options.height = self.results.settings.height;
                    self.options.initialized = true;
                }
            },
            error: () => {
                this.error = true;
                this.isExecuting = false;
            }
        };
        if (this.isExecuting){
            this.mustRerequest = true;
            return;
        }
        this.isExecuting = true;
        jQuery.ajax(request);
    }

    get child(){
        const self = this;
        return {
            tag: "table",
            attr: {
                class: "table table-striped table-hover"
            },
            child: [{
                tag: "thead",
                child: {
                    tag: "tr",
                    child: [{tag: "th",  class: '', child: "Id"},
                        {tag: "th",  class: '', child: "Title"},
                        {tag: "th", class:"", child: "Author"},
                        {tag: "th", class:"", child: "Data"},
                        {tag: "th", class:"", child: "Image"}
                    ]
                }
            },{
                tag: "tbody",
                get child(){
                    if (self.error){
                        return {
                            tag: "tr",
                            child: {
                                tag: "td",
                                attr: {
                                    rowspan: "5"
                                },
                                child: "Error when trying to get charts."
                            }
                        }
                    }
                    var res = self.results ? self.results.charts.map(chart => {
                        return {
                            tag: "tr",
                            event: {
                                click: () => {
                                    var content = `[chartplot id='${chart.id}'`;
                                    if (self.selection.options.width){
                                        content += ` width='${self.selection.options.width}'`;
                                    }
                                    if (self.selection.options.height){
                                        content += ` height='${self.selection.options.height}'`;
                                    }
                                    content += ']';
                                    self.tinymce_editor.insertContent && self.tinymce_editor.insertContent(content);
                                    var opts: any = self.selection.options.toJson();
                                    opts.id = chart.id;
                                    self.tinymce_editor.insertOptions && self.tinymce_editor.insertOptions(opts);
                                    self.selection.close();
                                }
                            },
                            attr: {
                                class: "chartplot-row"
                            },
                            get child(){
                                var res: any[] = [{
                                    tag: "td",
                                    attr: {
                                        class: ""
                                    },
                                    child: chart.id
                                },{
                                    tag: "td",
                                    attr: {
                                        class: ""
                                    },
                                    child: {
                                        tag: "strong",
                                        child: chart.title
                                    }
                                },{
                                    tag: "td",
                                    attr: {
                                        class: ""
                                    },
                                    child: chart.author
                                },{
                                    tag: "td",
                                    attr: {
                                        class: ""
                                    },
                                    child: chart.date
                                }];
                                if (chart.image){
                                    res.push({
                                        tag: "td",
                                        child: {
                                            tag: "img",
                                            attr: {
                                                width: 200,
                                                height: 150,
                                                src: chart.image
                                            },
                                        }
                                    });
                                }
                                return res;
                            }
                        }
                    }) : [];
                    if (res.length === 0){
                        return {
                            tag: "tr",
                            child: {
                                tag: "td",
                                attr: {
                                    rowspan: "5"
                                },
                                child: "No charts found."
                            }
                        }
                    }
                    return res
                }
            }]
        }
    }
}

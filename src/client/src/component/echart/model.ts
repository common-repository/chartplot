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
 
import {ObjectModel} from "../configuration/model/base";
import {helpCard} from "../shape/help";

class ChartModel extends ObjectModel{

    toJson(){
        var res = super.toJson();
        var sers = this.get("dataset").get("series");
        var series = [];
        for (var i=0; i < sers.length; i++){
            var ser = sers[i];
            var s:any = {
                type: "bar"
            };
            if (ser.name){
                s.name = ser.name;
            }
            series.push(s);
        }
        res.series = series;
        res.xAxis = {
            type: "category"
        };
        res.yAxis = {};
        res.grid = {};
        res.legend = {};
        res.tooltip = {};
        return res;
    }

}

export default function createChartModel(){
    var model = new ChartModel();
    model.configure({
        title: {
            type: "string",
            help: "Sets the title of the chart",
            label: "Title"
        },
        subtitle: {
            type: "string",
            help: "Sets the subtitle of the chart",
            label: "Subtitle"
        },
        dataset: {
            type: "object",
            value: createDatasetModel(),
            help: "Defines a data source. Series defined in the chart can get their data from this data source.",
            label: "Dataset"
        }
    });
    return model;
}

declare var $;

function createDatasetModel(){
    var model = new ObjectModel();
    model.configure({
        sourceTable: {
            type: "table.echarts.datasource",
            help: {
                tag: "div",
                child: {
                    tag: "div",
                    child: [{tag: "div", child: ["Upload or insert your data into the table above. ", {
                        tag: "a", attr: {href: "#datasourceHelp", "data-toggle": "collapse"}, child: "Show more"
                        }]},
                        {
                        tag: "div",
                            onAttached: function() {
                                $(this.node.element).collapse({
                                    toggle: false
                                });
                            },
                        attr: {
                            class: "collapse",
                            id: "datasourceHelp"
                        },
                        child: helpCard({content: [{
                            tag: "p", child: "You can define data for your series here using following format:"
                        },{tag: "div", attr: {class: "card"}, child: {
                                tag: "div", attr: {class: "card-body"}, child: {
                                    tag: "img", attr: {
                                        src: "/public/img/help/editor/datasource.png"
                                    },
                                    style: {
                                        maxWidth: "100%"
                                    }
                                }
                            }},{
                            tag: "p",
                            child: "For each column, the first row defines the name of the series, and the following rows define the data of the series. The first column defines the name of the categories"
                        },{
                            tag: "button",
                            attr: {
                                class: "btn btn-primary btn-sm"
                            },
                            child: "Load example data",
                            event: {
                                click: (ev) => {
                                    ev.preventDefault();
                                    model.set("sourceTable", [["", "Series 1", "Series 2", "Series 3"],
                                        ["Category 1", 2, 6, 1],
                                        ["Category 2", 6, 4, 4],
                                        ["Category 3", 7, 3, 5]])
                                }
                            }
                        }]})
                    }]
                }
            },
            uploadHelp: {
                tag: "div",
                child: [{
                    tag: "div",
                    child: ["Upload a file containing your data. ",{
                        tag: "a", attr: {href: "#datasourceUploadHelp", "data-toggle": "collapse"}, child: "Show more"
                    }]
                }]
            },
            value: [["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""]],
            label: "Data"
        },
        source: {
            type: "table",
            value: []
        },
        series: {
            value: []
        },
        sourceHeader: {
            value: true
        }
    });
    return model;
}

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
 
import {Template} from "./basic";
import {RibbonOptions} from "../../settings/options/ribbon";

export class CandlestickTemplate extends Template{

    afterSet(){
        this.editor.editorSettings.options.chart.editMode = "chart";
        this.editor.editorSettings.options.series.selected = 0;
        this.editor.editorSettings.options.ribbon.selectedTab = RibbonOptions.SERIES_DATA_RIBBON_INDEX;
    }

    constructor(){
        super("Candlestick", "candlestick", {
            "chart": {
                "dataset": {
                    "source": {
                        "data": [
                            [
                                null,
                                "Candle series",
                                "",
                                "",
                                ""
                            ],
                            [
                                "06/2018",
                                "34",
                                "38",
                                "25",
                                "40"
                            ],
                            [
                                "07/2018",
                                "48",
                                "34",
                                "55",
                                "30"
                            ],
                            [
                                "08/2018",
                                "45",
                                "23",
                                "50",
                                "12"
                            ],
                            [
                                null,
                                "",
                                "",
                                "",
                                ""
                            ],
                            [
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        ],
                        "columns": [
                            7,
                            2,
                            3,
                            4,
                            5
                        ],
                        "maxColNumber": 7
                    }
                },
                "series": [
                    {
                        "type": "candlestick",
                        "columnId": 2,
                        "dataSourceType": "chart",
                        "coordinateIndex": 0,
                        "xAxisIndex": 0,
                        "yAxisIndex": 0,
                        "data": [
                            [
                                null,
                                null,
                                null,
                                null
                            ],
                            [
                                "",
                                "",
                                "",
                                ""
                            ],
                            [
                                "",
                                "",
                                "",
                                ""
                            ],
                            [
                                "",
                                "",
                                "",
                                ""
                            ],
                            [
                                "",
                                "",
                                "",
                                ""
                            ],
                            [
                                "",
                                "",
                                "",
                                ""
                            ],
                            [
                                "",
                                "",
                                "",
                                ""
                            ],
                            [
                                "",
                                "",
                                "",
                                ""
                            ],
                            [
                                "",
                                "",
                                "",
                                ""
                            ],
                            [
                                "",
                                "",
                                "",
                                ""
                            ]
                        ],
                        "symbolColor": "white",
                        "selectedData": {
                            "row": -1,
                            "column": -1
                        }
                    }
                ],
                "coordinates": [
                    {
                        "axes": [
                            {
                                "type": "category",
                                "coordinate": "x",
                                "show": true,
                                "dataSource": "auto",
                                "data": {
                                    "data": [
                                        [
                                            ""
                                        ],
                                        [
                                            ""
                                        ],
                                        [
                                            ""
                                        ],
                                        [
                                            ""
                                        ],
                                        [
                                            ""
                                        ],
                                        [
                                            ""
                                        ],
                                        [
                                            ""
                                        ]
                                    ],
                                    "columns": [
                                        10
                                    ],
                                    "maxColNumber": 10
                                },
                                "name": "x-axis"
                            },
                            {
                                "type": "value",
                                "coordinate": "y",
                                "show": true,
                                "dataSource": "chart",
                                "data": {
                                    "data": [
                                        [
                                            "",
                                            "",
                                            "",
                                            "",
                                            "",
                                            "",
                                            "",
                                            ""
                                        ]
                                    ],
                                    "columns": [
                                        2,
                                        3,
                                        4,
                                        5,
                                        6,
                                        7,
                                        8,
                                        9
                                    ],
                                    "maxColNumber": 9
                                },
                                "name": "y-axis"
                            }
                        ],
                        "type": "grid",
                        "xPos": {
                            "start": {
                                "value": 10
                            },
                            "end": {
                                "value": 10
                            }
                        },
                        "yPos": {
                            "start": {
                                "value": 40
                            },
                            "end": {
                                "value": 40
                            }
                        },
                        "containLabel": true,
                        "tooltip": {
                            "show": true,
                            "trigger": "axis"
                        },
                        "name": "Cartesian"
                    }
                ],
                "components": [
                    {
                        "showChartTitle": true,
                        "type": "title",
                        "xPos": {
                            "position": null,
                            "side": "center",
                            "pixelOrPercent": null
                        },
                        "yPos": {
                            "position": null,
                            "side": null,
                            "pixelOrPercent": null
                        }
                    },
                    {
                        "show": true,
                        "type": "legend",
                        "xPos": {
                            "position": null,
                            "side": null,
                            "pixelOrPercent": null
                        },
                        "yPos": {
                            "position": null,
                            "side": "bottom",
                            "pixelOrPercent": null
                        }
                    }
                ],
                "color": [
                    "#c23531",
                    "#2f4554",
                    "#61a0a8",
                    "#d48265",
                    "#91c7ae",
                    "#749f83",
                    "#ca8622",
                    "#bda29a",
                    "#6e7074",
                    "#546570",
                    "#c4ccd3"
                ]
            },
            "options": {
                "data": {
                    "seriesType": "line",
                    "manageSeries": true
                },
                "series": {
                    "selected": 0
                },
                "ribbon": {
                    "selectedTab": 0
                },
                "coordinates": {
                    "selected": 0,
                    "axes": {
                        "selected": 1
                    }
                },
                "components": {
                    "selected": 0
                },
                "view": {
                    "modus": "edit",
                    "activeScreen": "default",
                    "width": 400,
                    "height": 300
                },
                "chart": {
                    "editMode": "chart"
                }
            }
        })
    }

};

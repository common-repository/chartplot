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
 
const axisTypes = {
    line: true,
    bar: true,
    area: true,
    scatter: true,
    candlestick: true,
    point: true
}

function isNeedsAxes(settings){
    var hasCategoricalSeries = false;
    if ("series" in settings){
        settings.series.forEach(ser => {
            hasCategoricalSeries = axisTypes[ser.type] || hasCategoricalSeries;
        });
    }
    return hasCategoricalSeries;
}

function getTemplateType(settings){
    if (!settings.template){
        return "bar";
    }
    return settings.template.type || "bar";
}

function configureGrid(context){
    const templateType = context.meta.template.type;
    const settings = context.settings;
    if (templateType in axisTypes){
        if (!("grid" in settings)){
            settings.coordinates = {};
        }
    }
}

function createDataset(context){
    const dataset = context.settings.dataset;
    if (!dataset){
        return;
    }
    const resDataset:any = {

    };
    if (dataset.parsedSource && dataset.parsedSource.length > 0){
        resDataset.source = dataset.parsedSource;
    }
    context.result.dataset = resDataset;
}

function configureXAxis(context){
    const settings = context.settings;
    const templateType = context.meta.template.type;
    if (templateType in axisTypes){
        if (!("xAxis" in settings)){
            var resXAxis: any = [];
        }
    }
}

export function settingsToEChartSettings(settings: any){
    const templateType = getTemplateType(settings);
    var res: any = {};
    var meta: any = {
        template: {
            type: templateType
        }
    };
    const context = {
        settings: settings,
        result: res,
        meta: meta
    }
    configureGrid(context);
    createDataset(context);
    if (isNeedsAxes(settings)){
        if (!("xAxis" in settings)){
            settings.xAxis = {
                type: "category"
            }
        }
        if (!("yAxis" in settings)){
            settings.yAxis = {

            }
        }
    }
    return settings;
}

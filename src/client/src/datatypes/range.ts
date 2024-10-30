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
 
export interface IYIndexedData{
    y: number;
}

export interface IXIndexedData{
    x: number;
}

export interface IXIntervalData extends IXIndexedData{
    xe?: number;
}

export interface IYIntervalData{
    y: number;
    ye?: number;
}

export interface ITimeHorizontalDataRange extends IXIntervalData{
    cat: number;
}

export function getEndX(data: IXIntervalData){
    if ("xe" in data){
        return data.xe;
    }
    return data.x;
}

export function getEndY(data: IYIntervalData){
    if ("ye" in data){
        return data.ye;
    }
    return data.y;
}

export function getXSize(data: IXIntervalData){
    return getEndX(data) - data.x;
}

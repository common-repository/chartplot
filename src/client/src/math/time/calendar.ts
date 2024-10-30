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
 
export interface ICalendar{

    time: number;
    month: number;
    dayOfMonth: number;
    year: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;

}

/**
 * Calendar settings for the chart. Defines in what format and timezone the chart will show dates.
 * @settings
 */
export interface ICalendarSettings{

    /**
     * Either a GMT offset number in miliseconds, or "local" for local time in the browser.
     */
    offset: number | "local";

}

export class DateLocalTimeCalendar implements ICalendar{

    private date: Date;

    constructor(time: number){
        this.date = new Date(time);
    }

    get time(){
        return this.date.getTime();
    }

    set time(v: number){
        this.date = new Date(v);
    }

    get month(){
        return this.date.getMonth();
    }

    set month(m: number){
        this.date.setMonth(m);
    }

    get dayOfMonth(){
        return this.date.getDate();
    }

    set dayOfMonth(d: number){
        this.date.setDate(d);
    }

    get year(){
        return this.date.getFullYear();
    }

    set year(y: number){
        this.date.setFullYear(y);
    }

    set hours(h: number){
        this.date.setHours(h);
    }

    get hours(){
        return this.date.getHours();
    }

    set minutes(m: number){
        this.date.setMinutes(m);
    }

    get minutes(){
        return this.date.getMinutes();
    }

    set seconds(s: number){
        this.date.setSeconds(s);
    }

    get seconds(){
        return this.date.getSeconds();
    }

    set milliseconds(ms: number){
        this.date.setMilliseconds(ms);
    }

    get milliseconds(){
        return this.date.getMilliseconds();
    }

}


export class UTCOffsetCalendar implements ICalendar{

    private _offset: number = 0;
    private date: Date;

    constructor(time: number){
        this.date = new Date(time);
    }

    get offset(){
        return this._offset;
    }

    set offset(o: number){
        this._offset = o;
    }

    get time(){
        return this.date.getTime() - this._offset*60*1000;
    }

    set time(v: number){
        this.date = new Date(v);
        this.date.setUTCMinutes(this.date.getUTCMinutes() + this._offset);
    }

    get month(){
        return this.date.getUTCMonth();
    }

    set month(m: number){
        this.date.setUTCMonth(m);
    }

    get dayOfMonth(){
        return this.date.getUTCDate();
    }

    set dayOfMonth(d: number){
        this.date.setUTCDate(d);
    }

    get year(){
        return this.date.getUTCFullYear();
    }

    set year(y: number){
        this.date.setUTCFullYear(y);
    }

    set hours(h: number){
        this.date.setUTCHours(h);
    }

    get hours(){
        return this.date.getUTCHours();
    }

    set minutes(m: number){
        this.date.setUTCMinutes(m);
    }

    get minutes(){
        return this.date.getUTCMinutes();
    }

    set seconds(s: number){
        this.date.setUTCSeconds(s);
    }

    get seconds(){
        return this.date.getUTCSeconds();
    }

    set milliseconds(ms: number){
        this.date.setUTCMilliseconds(ms);
    }

    get milliseconds(){
        return this.date.getUTCMilliseconds();
    }


}

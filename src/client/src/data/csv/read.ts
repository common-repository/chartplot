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
 
export class TableRow{
    
    public index: number = 0;
    
    constructor(public data: string[]){

    }

    public hasNext(){
        return this.index < this.data.length;
    }

    public next(){
        var data = this.data[this.index];
        this.index++;
        return data;
    }
}

export class CSVDataReader{
    
    public datas: string[][];
    public index: number = 0;

    public cellSeparator = ",";
    started = false;

    constructor(public data: string){

    }

    start(){
        if (this.started){
            return;
        }
        this.datas = this.data.split("\n").map(d => d.split(this.cellSeparator));
        this.started = true;
    }

    public hasNext(): boolean{
        this.start();
        return this.index < this.datas.length;
    }

    public next(): TableRow{
        this.start();
        var res = this.datas[this.index];
        this.index++;
        return new TableRow(res);
    };
}

export function parseCSVData(){

}

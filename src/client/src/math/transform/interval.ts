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
 
import {IOptional, optional} from "../../../../core";
import {IInterval, IPointInterval} from "../../geometry/interval/index";

export interface IValueTransformer{
    transform(x: number): number;
    inverse(): IOptional<IValueTransformer>;
    copy(): IValueTransformer;
    isEqual(t: IValueTransformer): boolean;
}

class NullValueTransformer implements IValueTransformer{

    transform(x: number): number{
        return x;
    }
    inverse(): IOptional<IValueTransformer>{
        return optional(nullValueTransformer); 
    }
    copy(): IValueTransformer{
        return nullValueTransformer;
    }
    public isEqual(t: IValueTransformer): boolean{
        return t === this;
    }
    
}

export var nullValueTransformer = new NullValueTransformer();

class LinearValueTransformer implements IValueTransformer{
    
    constructor(public offset: number, public ratio: number){
        
    }
    
    transform(x: number){
        return this.offset + this.ratio*x;
    }
    
    inverse(): IOptional<IValueTransformer>{
        if (this.ratio === 0){
            return optional();
        }
        return optional(new LinearValueTransformer(-(this.offset/this.ratio), 1/this.ratio));
    }
    
    copy(){
        return new LinearValueTransformer(this.offset, this.ratio);
    }
    
    isEqual(v: LinearValueTransformer){
        return v.offset === this.offset && v.ratio === this.ratio;
    }
    
    
}

export function linearTransformer(source: IPointInterval, target: IPointInterval){
    if (source.end === source.start){
        offset = 1;
        ratio = 1;
    }
    else{
        var offset = ((source.end * target.start) - (target.end *source.start)) / (source.end - source.start);
        var ratio = (target.end - target.start) / (source.end - source.start);
    }
    return new LinearValueTransformer(offset, ratio);
}

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
import {log10} from "../log";
import {IValueTransformer} from "./interval";

export class Log10Transformer implements IValueTransformer{
    
    constructor(public transformer: IValueTransformer){
        
    }

    transform(x: number){
        return this.transformer.transform(log10(x));
    }
    
    inverse(): IOptional<IValueTransformer>{
        var m = this.transformer.inverse();
        if (m.present){
            return optional(new Log10InverseTransformer(m.value));
        }
        return optional();
    }
    
    copy(): IValueTransformer{
        return new Log10Transformer(this.transformer.copy());
    }
    
    isEqual(t: Log10Transformer){
        return t.transformer && t.transformer.isEqual(this.transformer);
    }
    
}

export class Log10InverseTransformer implements IValueTransformer{

    constructor(public transformer: IValueTransformer){

    }

    transform(x: number){
        var p = this.transformer.transform(x);
        p = Math.pow( 10, p);
        return p;
    }

    inverse(): IOptional<IValueTransformer>{
        var m = this.transformer.inverse();
        if (m.present){
            return optional(new Log10Transformer(m.value));
        }
        return optional();
    }

    copy(): IValueTransformer{
        return new Log10InverseTransformer(this.transformer.copy());
    }

    isEqual(t: Log10InverseTransformer){
        return t.transformer && t.transformer.isEqual(this.transformer);
    }
    
}

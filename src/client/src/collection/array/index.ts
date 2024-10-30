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
 
export interface IMinMax{
	min: number;
	max: number;
}

export function minMaxValue(val: number){
	return {
		min: val,
		max: val
	}
}

export interface IOptions<E>{

	start?: number;
	end?: number;
	minMax?: (e: E) => IMinMax;

}

export class Wrapper<E>{

	constructor(public array: E[])
	{

	}

	public getMinMax(options?: IOptions<E>): IMinMax{
		var arr = this.array;
		var start = 0;
		var end = arr.length - 1;
		if (!options)
		{
			options = {

			};
		}
		if (options.start)
		{
			start = Math.max(0, Math.min(arr.length - 1, Math.floor(options.start)));
		}
		if (options.end)
		{
			end = Math.max(0, Math.min(arr.length - 1, Math.ceil(options.end)));
		}
		var minMax = <((e: E) => IMinMax)> <any> minMaxValue;
		if (options.minMax){
			minMax = options.minMax;
		}
		if (arr.length > 0)
		{
			var mm = minMax(arr[start]);
			var min: number = mm.min;
			var max: number = mm.max;
			for (var i=start + 1; i <= end; i++)
			{
				var mm = minMax(arr[i]);
				if (min > mm.min){
					min = mm.min;
				}
				if (max < mm.max){
					max = mm.max;
				}
			}
			return {
	            min: min,
	            max: max
	        };
		}
		return null;
	}
}

export default function<E>(array: E[]){
	return new Wrapper<E>(array);
}

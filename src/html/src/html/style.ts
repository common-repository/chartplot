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
 
/**
 * 
 * Represents a css style. Used to style @api{render.IHtmlNodeShape, html shapes}. 
 * Each property defined is assumed to represent a style in a css-declaration, e.g.
 * 
 * 
 * ```.javascript
 *  {
 *      backgroundColor: "rgb(255, 0, 0)",
 *      font: "20px arial"
 *  }
 * ```
 * Equivalent to following css style
 * ```.css
 * 
 * {
 *  background-color: rgb(255, 0, 0);
 *  font: 20px arial;
 * }
 * 
 * ```
 
 * 
 */
export interface ICSSStyle{
    [s: string]: any;
}

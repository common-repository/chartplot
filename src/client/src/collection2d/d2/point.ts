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
 
import {IPoint} from "../../geometry/point/index";
import {IPointRectangle} from "../../geometry/rectangle/index";
import {IIterator} from "../../collection/iterator/index";

export interface IPointNode extends IPoint, IPointRectangle{

    getChildren(): IIterator<IPoint>;
    isNode: boolean;

}

export interface IPointCollection {

    add(pt: IPoint): void;

    remove(pt: IPoint): IPoint;

    contains(pt: IPoint): boolean;

    find(rect: IPointRectangle): IIterator<IPoint>;

    findChild(p: IPoint): IPoint;

    iterator(): IIterator<IPoint>;

    length: number;
    root: IPointNode;

}

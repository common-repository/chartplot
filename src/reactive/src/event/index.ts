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
 
import {IList, list} from "../../../core";

/**
 * An event stream firing events of type E
 */
export interface IStream<E> {

    /**
     * The observers listening to this event stream
     */
    observers: IList<(e: E) => void>;

    /**
     *
     * @param {(e: E) => void} observer Observes the events this stream fires
     */
    observe(observer: (e: E) => void);

    /**
     * Removes given observer
     * @param {(e: E) => void} observer
     */
    unobserve(observer: (e: E) => void);

    /**
     * Fires the given event. All currently registered observers will receive the event.
     * @param {E} event
     */
    fire(event: E);

}

export class Stream<E>{

    public observers: IList<(e: E) => void> = list<(e: E) => void>();

    constructor() {

    }
    public observe(observer: (e: E) => void){
        if (!this.observers.contains(observer))
        {
            this.observers.addLast(observer);
        }
        return {
            cancel: () => {
                this.unobserve(observer);
            }
        }
    }

    public unobserve(observer: (e: E) => void){
        this.observers.findAndRemove(observer);
    }

    public fire(event: E){
        this.observers.forEach(function(observer){
            observer(event);
        })
    }

};

export function stream<E>(): IStream<E>{
    return new Stream<E>();
}

export default stream;

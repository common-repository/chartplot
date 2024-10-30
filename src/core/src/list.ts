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
 
import {IIterator} from "./iterator";

export interface IListNode<E> {

    removed: boolean;
    next: IListNode<E>;
    previous: IListNode<E>;
    value: E;

    remove(): boolean;

    addBefore(data: E);

    addAfter(data: E);
}


export interface IList<E> {
    size: number;
    first: IListNode<E>;
    last: IListNode<E>;

    addLast(element: E): IListNode<E>;

    addLastNode(node: IListNode<E>);

    addFirst(element: E): IListNode<E>;

    addFirstNode(node: IListNode<E>);

    findAndRemove(element: E): boolean;

    contains(element: E): boolean;

    forEach(f: (e: E) => void);

    get(index: number): E;

    iterator(): IIterator<E>;
}


/**
 * Node of a list
 */
class Node<E> implements IListNode<E>{

    public removed = false;
    public next: Node<E> = null;
    public previous: Node<E> = null;

    constructor(public value: E, public list: List<E>){

    }

    public remove(){
        if (!this.removed) {
            this.list.size--;
            this.next.previous = this.previous;
            this.previous.next = this.next;
            this.removed = true;
            return true;
        }
        return false;
    }

    public addBefore(data: E){
        var node = this.list.createNode(data);
        node.next = this;
        node.previous = this.previous;
        node.removed = false;
        this.previous.next = node;
        this.previous = node;
        this.list.size++;
    }

    public addAfter(data: E){
        var node = this.list.createNode(data);
        node.previous = this;
        node.next = this.next;
        node.removed = false;
        this.next.previous = node;
        this.next = node;
        this.list.size++;
    }
}

/**
 * A double linked list
 * @param E the type of the list elements
 */
class List<E> implements IList<E>{

    public size = 0;
    public first: Node<E> = this.createNode(null);
    public last: Node<E> = this.createNode(null);

    constructor(){
        this.last.next = this.last;
        this.last.previous = this.first;
        this.first.next = this.last;
        this.first.previous = this.first;
    }

    public createNode(value: E): Node<E>{
        return new Node(value, this);
    }

    public addLast(element: E){
        var ln = this.createNode(element);
        this.addLastNode(ln);
        return ln;
    }

    public addLastNode(node: Node<E>){
        this.size++;
        node.next = this.last;
        node.previous = this.last.previous;
        node.removed = false;
        this.last.previous.next = node;
        this.last.previous = node;
    }

    public addFirst(element: E){
        var node = this.createNode(element);
        this.addFirstNode(node);
        return node;
    }

    public addFirstNode(node: Node<E>){
        this.size++;
        node.previous = this.first;
        node.next = this.first.next;
        node.removed = false;
        this.first.next.previous = node;
        this.first.next = node;
    }

    public findAndRemove(element: E) {
        var ln = this.first;
        ln = ln.next;
        while (ln != this.last) {
            if (ln.value === element) {
                ln.remove();
                return true;
            }
            ln = ln.next;
        }
        return false;
    }

    public contains(element: E){
        var ln = this.first;
        ln = ln.next;
        while (ln != this.last) {
            if (ln.value === element) {
                return true;
            }
            ln = ln.next;
        }
        return false;
    }

    public forEach(f: (e: E) => void) {
        var ln = this.first;
        ln = ln.next;
        while (ln != this.last) {
            f(ln.value);
            ln = ln.next;
        }
    }

    public get(index: number){
        var it = this.iterator();
        var i = 0;
        while(it.hasNext()){
            var n = it.next();
            if (i === index){
                return n;
            }
            i++;
        }
        return null;
    }

    public iterator(){
        var ln = this.first;
        var last = this.last;
        ln = ln.next;
        return {
            hasNext: function(){
                return ln !== last;
            },

            next: function(){
                var next = ln;
                ln = ln.next;
                return next.value;
            }
        }
    }

}

/**
 * Creates a new list
 * @return the created list
 */
export default function list<E>(): IList<E>{
    return new List<E>();
}


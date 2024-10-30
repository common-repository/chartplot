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
 
import {attach, detach} from "../../html";
import {Constructor} from "../../core";

declare var React: {
    Component: Constructor<any>;
}

export default class Html extends React.Component{

    props: any;
    node: any;
    el: HTMLElement;

    constructor(props){
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    componentDidMount() {
        var shape = this.props.children;
        this.node = attach(this.el, shape);

    }

    componentWillUnmount() {
        detach(this.node);
    }

    componentDidUpdate(){
        detach(this.node);
        var shape = this.props.children;
        this.node = attach(this.el, shape);
    }

    render() {
        return <div ref={el => this.el = el} />;
    }

}


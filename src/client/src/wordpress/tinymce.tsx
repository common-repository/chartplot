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
 
import {GutenbergBlock, WordpressChartSelection} from "./select";
import {assemble} from "../../../di";
import {getWordpressChartplotUrl} from "./path";

declare var React;

declare var jQuery: any;

declare var tinymce;

declare var window;

declare var wp;

(function($) {
    if (window.tinymce){
        tinymce.PluginManager.add('chartplot_mce_button', function(editor, url) {
            editor.addButton('chartplot_mce_button', {
                title: 'Chartplot',
                label: 'Chartplot',
                image: url+'/logo-black.svg',
                onclick: function() {
                    var dashboard: WordpressChartSelection = assemble({
                        instance: new WordpressChartSelection(editor)
                    });
                    dashboard.attach();
                }
            });

            return {
                getMetadata: function () {
                    return  {
                        name: "Chartplot",
                        url: "http://chartplot.com"
                    };
                }
            };
        });
    }

    if (window.wp && wp.blocks && wp.blocks.registerBlockStyle){
        const Html = require("../../../react/src/html").default;
        var el = wp.element.createElement,
            registerBlockType = wp.blocks.registerBlockType;
        const iconEl = el('svg', { width: 20, height: 20, viewBox:"0 0 48 48" },
            el('g', {}, el('path', { d: "M0,19.9H9.3A15.16,15.16,0,0,1,19.8,9.3V0A24.34,24.34,0,0,0,0,19.9Z" } ),
                el('path', { d: "M48,24a28.28,28.28,0,0,1-.3,4.1A24.46,24.46,0,0,1,27.9,48V38.7A15.16,15.16,0,0,0,38.4,28.1a15.88,15.88,0,0,0,0-8.1A15.3,15.3,0,0,0,27.9,9.3V0A24.46,24.46,0,0,1,47.7,19.9,28.28,28.28,0,0,1,48,24Z" } ),
                el('path', { d: "M32.8,24A9,9,0,1,1,16,19.5a8.72,8.72,0,0,1,3.3-3.3A9,9,0,0,1,32.8,24Z" } ))
        );

        /**
         * We need to cache the rendered block, otherwise the behaviour when block is de/selected is weird and "jumpy".
         */
        const clientIdToContent = {

        }

        var cache = {};

        registerBlockType( 'chartplot/chart', {
            title: 'ChartPlot',

            image: getWordpressChartplotUrl()+'js/chartplot/logo-black.svg',

            category: "widgets",

            icon: iconEl,

            attributes: {
                width: {
                    type: "string"
                },
                height: {
                    type: "string"
                },
                id: {
                    type: "number"
                }
            },

            description: "Block rendering a chartplot chart.",

            edit: (props) => {
                let divAndGutenberg = clientIdToContent[props.clientId];
                if (!(divAndGutenberg)){
                    const gutenberg = new GutenbergBlock();
                    var Block = assemble({
                        instance: gutenberg
                    });
                    var div = <div className="chartplot-main">
                        <Html>{Block}</Html>
                    </div>
                    divAndGutenberg = {
                        div: div,
                        gutenberg: gutenberg
                    }
                    clientIdToContent[props.clientId] = divAndGutenberg;
                }
                divAndGutenberg.gutenberg.reload(props, cache);
                return divAndGutenberg.div;
            },

            save: function(props) {
                return null;
            },
        } );
    }

})(jQuery);


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
 
import {getWordpressChartplotUrl} from "../../../wordpress/path";

export class IntroHelp {

    tag = "div";

    child = {
        tag: "html",
        child: ` <div class="container">
 <div class="alert alert-primary">
<div class="h2">Online Documentation</div>
<p>For the complete documentation, visit the <a target="_blank" href="http://chartplot.com/wordpress/docs">ChartPlot Documentation Page</a></p>
</div>
<div class="title">
        <h1>Editor</h1>
        <div class="subtitle">First steps</div>      
    </div>
    <div class="section">
        <div class="subsection">
            <p></p>
            <div class="h2">Adding a new chart</div>
            <p>
                When adding a new chart, you'll be first presented with a set of example charts to choose from.
                After choosing an example chart, the editor will open.
            </p>
            <figure class="figure">
                <img class="figure-img img-thumbnail" src="${getWordpressChartplotUrl()}img/help/page/plugin/add-new-chart.png">
                <figcaption class="figure-caption text-center">When adding new chart, select chart template first.</figcaption>
            </figure>
            <p></p>
            <figure class="figure">
                <img class="figure-img img-thumbnail" src="${getWordpressChartplotUrl()}img/help/page/docs/editor/new-chart-editor.png">
                <figcaption class="figure-caption text-center">Editor appears after selecting example chart.</figcaption>
            </figure>

        </div>
        <div class="subsection">
            <div class="h2">Chart editor</div>
            <figure class="figure">
                <img class="figure-img img-thumbnail" src="${getWordpressChartplotUrl()}img/help/page/home/intro.png">
                <figcaption class="figure-caption text-center">The chart editor, with the chart data ribbon tab opened.</figcaption>
            </figure>
            <h3>Top toolbar</h3>
            <p>The top toolbar is where you will find general functions, like "undo", "redo" or saving the current chart settings.
                <a href="#tooltips">See tooltips </a> on how to get help on each of those functions.</p>
            <figure class="figure">
                <img class="figure-img img-thumbnail" src="${getWordpressChartplotUrl()}img/help/page/docs/editor/chart-top-menu.png">
                <figcaption class="figure-caption text-center">The top toolbar.</figcaption>
            </figure>
            <h3>Ribbon toolbar</h3>
            <p>The ribbon toolbar is where you configure chart specific settings, like the data, series of styles of different components.
                The different tabs are described in the following chapters of this documentation.
            <figure class="figure">
                <img class="figure-img img-thumbnail" src="${getWordpressChartplotUrl()}img/help/page/docs/editor/ribbon-toolbar.png">
                <figcaption class="figure-caption text-center">The ribbon toolbar.</figcaption>
            </figure>
            <p>Some sections in the ribbon have an expand icon that opens additional options when you click on it</p>
            <figure class="figure">
                <img class="figure-img img-thumbnail" src="${getWordpressChartplotUrl()}img/help/page/docs/editor/expand.png">
                <figcaption class="figure-caption text-center">Click on the expand icon to see more options.</figcaption>
            </figure>
            <h3>Chart section</h3>
            <p>The chart section shows you a preview of the chart on how it will render the current settings. It may also
            show other elements. Here, it shows a table containing the chart data because the "Data" tab of the ribbon
            is currently opened.</p>
            <figure class="figure">
                <img class="figure-img img-thumbnail" src="${getWordpressChartplotUrl()}img/help/page/docs/editor/main-section.png">
                <figcaption class="figure-caption text-center">The chart section, showing chart and data.</figcaption>
            </figure>
        </div>
        <div class="subsection">
            <div class="h2">Tooltips</div>
            <p>In order to get help for the various functions the editor offers, you can trigger a tooltip by hovering with
            the mouse over different editor elements.</p>
            <figure class="figure">
                <img class="figure-img img-thumbnail" src="${getWordpressChartplotUrl()}img/help/page/docs/editor/tooltips.gif">
                <figcaption class="figure-caption text-center">Hover over different editor elements to see tooltips.</figcaption>
            </figure>
            <p>Note that tooltips can be disabled by clicking on the "tooltip" icon in the right side of the top menu, should they annoy you.</p>
            <figure class="figure">
                <img class="figure-img img-thumbnail" src="${getWordpressChartplotUrl()}img/help/page/docs/editor/tooltips-disable.gif">
                <figcaption class="figure-caption text-center">Disabling tooltips by clicking on the "tooltip" icon.</figcaption>
            </figure>
        </div>
 <div class="alert alert-primary">
<div class="h2">Online Documentation</div>
<p>For the complete documentation, visit the <a target="_blank" href="http://chartplot.com/wordpress/docs">ChartPlot Documentation Page</a></p>
</div>
    </div>

`
    }


}

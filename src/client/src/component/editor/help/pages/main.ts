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
 
import {HelpPage} from "../page";
import {getWordpressChartplotUrl} from "../../../../wordpress/path";

export class MainPage extends HelpPage{

    name = "Main"

    content = {
        tag: "html",
        child: `
<div class="h1">Introduction</div>
<div class="h2">The editor</div>
<img class="img-thumbnail d-block" src="${getWordpressChartplotUrl()}/img/help/main/chart-sections.png" />
<div class="h3">Main menu</div>
<img class="img-thumbnail d-block" src="${getWordpressChartplotUrl()}/img/help/main/main-menu-tooltip.png" />
<p>
The main menu contains generally used buttons like undo, redo or save. To get help for a button, just move the mouse cursor over the button. A tooltip with a description of its functionality will appear.
</p> 
<div class="h3">Ribbon menu</div>
<p>
The ribbon menu contains the tabs that help you to create and customize your chart. Like with the main menu, you can move the mouse cursor over a button or input element 
to open a tooltip with help.
</p>
<p>
Clicking the Help button in the main menu will open this help system with the page relevant to the currently active tab. 
</p> 
 To get help for tab, click on the tab and then click on the Help button in the main menu. Or choose the relevant help page in the <a href="#contents">content</a> section.  
<div class="h3">Chart view</div>
The chart view section shows the chart rendered with the current settings.
<div class="h2" id="tooltips">Tooltips</div>
For most inputs, you can get help by scrolling the mouse cursor over the element you want to get help for.
`
    }

}

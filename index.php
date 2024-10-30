<?php
/**
 * Plugin Name: ChartPlot
 * Plugin URI: https://chartplot.com/wordpress
 * Description: A WYSIWYG chart editor allowing you to easily add charts to your pages and posts. No programming knowledge required.
 * Author: Christoph Rodak <christoph@rodak.li>
 * License: GPL3
 * Version: 1.0.0
 *
*/

require_once __DIR__.'/php/plugin.php';
$chartplotPlugin = new ChartplotPlugin();
$chartplotPlugin->init();
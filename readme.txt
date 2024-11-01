=== Tera Charts ===
Contributors: calberti
Donate link: http://www.wpbusinessintelligence.com/contact-us/
Tags: charts, excel, drag&drop, analytics, sunburst chart, reingold tilford tree, bubble chart, zoomable treemap chart
Requires at least: 3.5.1
Tested up to: 3.8.1
Stable tag: 1.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Create dynamic web charts from excel files with a simple drag & drop. Business intelligence charts on your excel data in a couple of clicks!

== Description ==
With Tera Charts you can easily create dynamic web charts for your hierarchical data from excel files. With a simple drag & drop or file upload you can visualize your excel data with advanced hirerachical web charts. You just have to format your data according to the provided excel templates and select the preferred chart type. Tera Charts supports sunburst chart, Reingold Tilford Tree charts and zoomable treemap charts. See the [WP Business Intelligence website](http://www.wpbusinessintelligence.com/showcase/tera-charts-demo) for additional chart types.
This plugin relies on the [jQuery HTML5 File Upload](http://wordpress.org/extend/plugins/jquery-html5-file-upload/) plugin for the file upload implementation, on [WP Business Intelligence](http://wordpress.org/extend/plugins/wp-business-intelligence-lite/) and [D3](http://d3js.org) for the JavaScript charts.
Tera Charts are meant to represent hierarchical data, i.e. data that present several nested layers. In order to get a proper visualisation you will only need to format your excel file according to the excel template provided and then upload it.

= How it works =
1. Select the chart type that best fits your data.
2. Format your excel sheet according to the provided template.
3. Upload your excel file via drag&drop or the file upload button.
4. Every user has its own space with the uploaded files and the related charts.
5. Admins can view the uploaded files from the admin console
6. No browser plugins (e.g. Adobe Flash) required:
   The implementation is based on open standards like HTML5 and JavaScript and requires no additional browser plugins.
7. You can download your chart as a picture with a single click.

== Installation ==
1. Upload the file 'tera-charts.zip' to the `/wp-content/plugins/` directory and extract it.
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Place [tera-charts] in your post where you want to display the file upload button. (You can also place `<?php tera_charts_hook(); ?>` in your template where you want to display the charts )
4. By default, xls and xlsx files are accepted with a file size limit of 5MB. You can change this parameters via the Tera Charts Settings menu (Admin Panel->Settings->Tera Charts Settings).

== Frequently asked questions ==
### I uploaded and activated the plugin, whats next? ###
Once the plugin is activated, you can simply use '[tera-charts]' in any post or page where you want to display the upload buttons and all the charts. As an alternative you can modify the theme template by adding `<?php tera_charts_hook(); ?>` in your theme template where you want to display the upload buttons and the charts.
### Does the plugin work in all the browsers? ###
It works in browsers like Google Chrome, Apple Safari 4.0+, Mozilla Firefox 3.0+, Opera 11.0+ and Microsoft Internet Explorer 6.0+. It should also work in any other browser.
### Is there any demo available? ###
Yes! There's one on the [WP Business Intelligence website!](http://www.wpbusinessintelligence.com/showcase/tera-charts-demo)

== Screenshots ==
1. [Each chart type comes with a template Excel file that you can use to format your data (click to enlarge)](http://www.wpbusinessintelligence.com/wp-content/uploads/assets/chart-and-template.png)
2. [Once uploaded your files are listed so that you can easily switch from one chart to another (click to enlarge)](http://www.wpbusinessintelligence.com/wp-content/uploads/assets/charts-list.png)
3. [Zoomable Treemap Chart (click to enlarge)](http://www.wpbusinessintelligence.com/wp-content/uploads/assets/zoomable-treemap-chart.png)
4. [Sunburst Chart (click to enlarge)](http://www.wpbusinessintelligence.com/wp-content/uploads/assets/sunburst-chart.png)
5. [Reingold Tilford Tree Chart (click to enlarge)](http://www.wpbusinessintelligence.com/wp-content/uploads/assets/reingold-tilford-tree.png)



== Changelog ==

= 0.1 =
First beta version
= 1.0 =
Major security vulnerability fixed

== Upgrade notice ==

### 0.1 ###
3 chart types supported: Reingold Tilford Tree, Zoomable Treemap chart, Sunburst chart.
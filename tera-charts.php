<?php
/*
Plugin Name: Tera Charts
Plugin URI: http://wordpress.org/extend/plugins/tera-charts/
Description: This plugin enables the automated creation of dynamic web charts via drag & drop of excel files containing the data to be displayed
Version: 1.0
Author: Claudio Alberti
Author URI: www.wpbusinessintelligence.com
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/


/**The URL of the plugin directory*/
define('WPTCPLUGINDIRURL',plugin_dir_url(__FILE__));

/* Runs when plugin is activated */
register_activation_hook(__FILE__,'tera_charts_install'); 

/* Runs on plugin deactivation*/
register_deactivation_hook( __FILE__, 'tera_charts_remove' );

function tera_charts_install() {
	add_option("wptc_accepted_file_types", 'xls|xlsx', '', 'yes');
	add_option("wptc_inline_file_types", 'xls|xlsx', '', 'yes');
	add_option("wptc_maximum_file_size", '5', '', 'yes');
	add_option("wptc_thumbnail_width", '80', '', 'yes');
	add_option("wptc_thumbnail_height", '80', '', 'yes');
	
	$upload_array = wp_upload_dir();
	$upload_dir=$upload_array['basedir'].'/files/';
	/* Create the directory where you upoad the file */
	if (!is_dir($upload_dir)) {
		$is_success=mkdir($upload_dir, '0755', true);
		if(!$is_success)
			die('Unable to create a directory within the upload folder');
	}
}

function tera_charts_remove() {
	/* Deletes the database field */
	delete_option('wptc_accepted_file_types');
	delete_option('wptc_inline_file_types');
	delete_option('wptc_maximum_file_size');
	delete_option('wptc_thumbnail_width');
	delete_option('wptc_thumbnail_height');
}

if(isset($_POST['savesetting']) && $_POST['savesetting']=="Save Setting")
{
	update_option("wptc_accepted_file_types", $_POST['accepted_file_types']);
	update_option("wptc_inline_file_types", $_POST['inline_file_types']);
	update_option("wptc_maximum_file_size", $_POST['maximum_file_size']);
	update_option("wptc_thumbnail_width", $_POST['thumbnail_width']);
	update_option("wptc_thumbnail_height", $_POST['thumbnail_height']);
}

// Add settings link on plugin page
function tera_charts_settings_link($links) { 
  $settings_link = '<a href="options-general.php?page=tera-charts-setting.php">Settings</a>'; 
  array_unshift($links, $settings_link); 
  return $links; 
}
 
$plugin = plugin_basename(__FILE__); 
add_filter("plugin_action_links_$plugin", 'tera_charts_settings_link' );

if ( is_admin() ){

/* Call the html code */
add_action('admin_menu', 'tera_charts_admin_menu');


function tera_charts_admin_menu() {
add_options_page('Tera Charts Settings', 'Tera Charts Settings', 'administrator',
'tera-charts-setting', 'tera_charts_html_page');
}
}

function tera_charts_html_page() {
$args = array(
    'orderby'                 => 'display_name',
    'order'                   => 'ASC',
    'selected'                => $_POST['user']
);
?>
<h2>Tera Charts Settings</h2>

<form method="post" >
<?php wp_nonce_field('update-options'); ?>

<table >
<tr >
<td>Supported File Types</td>
<td >
<input type="text" name="accepted_file_types" value="<?php print(get_option('wptc_accepted_file_types')); ?>" />&nbsp;file extensions separated by | (e.g. xls|xlsx). Only <em><strong>xls</strong></em> and <em><strong>xlsx</strong></em> are currently supported
</td>
</tr>
<tr >
<td>Maximum File Size</td>
<td >
<input type="text" name="maximum_file_size" value="<?php print(get_option('wptc_maximum_file_size')); ?>" />&nbsp;MB
</td>
</tr>
<tr>
<td colspan="2">
<input type="submit" name="savesetting" value="Save Setting" />
</td>
</tr>
</table>
<br/>
<hr/>
<h2>View Uploaded Files</h2>
<table >
<tr >
<td>Select User</td>
<td >
<?php wp_dropdown_users($args); ?> 
</td>
<td>
<input type="submit" name="viewfiles" value="View Files" /> &nbsp; <input type="submit" name="viewguestfiles" value="View Guest Files" />
</td>
</tr>
<tr>
</table>
<table>
<tr>
<td>
<?php
if(isset($_POST['viewfiles']) && $_POST['viewfiles']=='View Files')
{
if ($_POST['user']) {
	$upload_array = wp_upload_dir();
	$imgpath=$upload_array['basedir'].'/files/'.$_POST ['user'].'/';
	$filearray=glob($imgpath.'*');
	if($filearray && is_array($filearray))
	{
		foreach($filearray as $filename){
			if(basename($filename)!='thumbnail'){
			print('<a href="'.$upload_array['baseurl'].'/files/'.$_POST ['user'].'/'.basename($filename).'" target="_blank"/>'.basename($filename).'</a>');
			print('<br/>');
			}
		}
	}
} 
}
else
if(isset($_POST['viewguestfiles']) && $_POST['viewguestfiles']=='View Guest Files')
{
	$upload_array = wp_upload_dir();
	$imgpath=$upload_array['basedir'].'/files/0/';
	$filearray=glob($imgpath.'*');
	if($filearray && is_array($filearray))
	{
		foreach($filearray as $filename){
			if(basename($filename)!='thumbnail'){
			print('<a href="'.$upload_array['baseurl'].'/files/0/'.basename($filename).'" target="_blank"/>'.basename($filename).'</a>');
			print('<br/>');
			}
		}
	}
}
?>
</td>
</tr>
</table>
</form>
<?php
}


function wptc_enqueue_scripts() {
	$stylepath=WPTCPLUGINDIRURL.'css/';
	$scriptpath=WPTCPLUGINDIRURL.'js/';

    wp_enqueue_style ( 'jquery-ui-style', $stylepath . 'jquery-ui.css' );
    wp_enqueue_style ( 'jquery-image-gallery-style', $stylepath . 'jquery.image-gallery.min.css');
    wp_enqueue_style ( 'jquery-fileupload-ui-style', $stylepath . 'jquery.fileupload-ui.css');
    wp_enqueue_script ( 'enable-html5-script', $scriptpath . 'html5.js');
    if(!wp_script_is('jquery')) {
        wp_enqueue_script ( 'jquery', $scriptpath . 'jquery.min.js',array(),'',false);
    }
    wp_enqueue_script ( 'jquery-wpbi-script', $scriptpath . 'wpbi.js',array('jquery'),'',true);
    wp_enqueue_script ( 'jquery-ui-script', $scriptpath . 'jquery-ui.min.js',array('jquery'),'',true);
    wp_enqueue_script ( 'tmpl-script', $scriptpath . 'tmpl.min.js',array('jquery'),'',true);
    wp_enqueue_script ( 'load-image-script', $scriptpath . 'load-image.min.js',array('jquery'),'',true);
    wp_enqueue_script ( 'canvas-to-blob-script', $scriptpath . 'canvas-to-blob.min.js',array('jquery'),'',true);
    wp_enqueue_script ( 'jquery-image-gallery-script', $scriptpath . 'jquery.image-gallery.min.js',array('jquery'),'',true);
    wp_enqueue_script ( 'jquery-iframe-transport-script', $scriptpath . 'jquery.iframe-transport.js',array('jquery'),'',true);
    wp_enqueue_script ( 'jquery-fileupload-script', $scriptpath . 'jquery.fileupload.js',array('jquery'),'',true);
    wp_enqueue_script ( 'jquery-fileupload-fp-script', $scriptpath . 'jquery.fileupload-fp.js',array('jquery'),'',true);
    wp_enqueue_script ( 'jquery-fileupload-ui-script', $scriptpath . 'jquery.fileupload-ui.js',array('jquery', 'jquery-wpbi-script'),'',true);
    wp_enqueue_script ( 'jquery-fileupload-jui-script', $scriptpath . 'jquery.fileupload-jui.js',array('jquery'),'',true);

    wp_enqueue_script ( 'transport-script', $scriptpath . 'cors/jquery.xdr-transport.js',array('jquery'),'',true);

}	

function wptc_load_ajax_function()
{

	/* Include the upload handler */
	require 'UploadHandler.php';
	global $current_user;
	get_currentuserinfo();
	$current_user_id=$current_user->ID;
	if(!isset($current_user_id) || $current_user_id=='')
		$current_user_id='0';

	$upload_handler = new UploadHandler(null,$current_user_id,true);

	die(); 
}

function wptc_add_inline_script() {
?>
<script type="text/javascript">
/*
 * jQuery File Upload Plugin JS Example 7.0
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
jQuery(function () {
    'use strict';

    // Initialize the jQuery File Upload widget:
    jQuery('#fileupload').fileupload({
        url: '<?php print(admin_url('admin-ajax.php'));?>'
    });

    // Enable iframe cross-domain access via redirect option:
    jQuery('#fileupload').fileupload(
        'option',
        'redirect',
        window.location.href.replace(
            /\/[^\/]*$/,
			<?php
			$absoluteurl=str_replace(home_url(),'',WPTCPLUGINDIRURL);
			print("'".$absoluteurl."cors/result.html?%s'");
			?>
        )
    );

	if(jQuery('#fileupload')) {
		// Load existing files:
        jQuery.ajax({
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},
            url: jQuery('#fileupload').fileupload('option', 'url'),
			data : {action: "load_ajax_function"},
			acceptFileTypes: /(\.|\/)(<?php print(get_option('wptc_accepted_file_types')); ?>)$/i,
			dataType: 'json',
			context: jQuery('#fileupload')[0]
			
            
        }).done(function (result) {
			jQuery(this).fileupload('option', 'done')
						.call(this, null, {result: result});
        });
    }

    // Initialize the Image Gallery widget:
    jQuery('#fileupload .files').imagegallery();

    // Initialize the theme switcher:
    jQuery('#theme-switcher').change(function () {
        var theme = jQuery('#theme');
        theme.prop(
            'href',
            theme.prop('href').replace(
                /[\w\-]+\/jquery-ui.css/,
                jQuery(this).val() + '/jquery-ui.css'
            )
        );
    });

});

    var userid = "<?php echo get_current_user_id();?>";

</script>
<?php
}

/* Block of code that need to be printed to the form*/
function tera_charts_hook() {
?>
    <div id="wptcHelp">
        <h3>How to use these charts</h3>
        <ul>
            <li><strong>Select</strong> a chart type and format the data according to the respective template</li>
            <li><strong>Add your Excel file</strong> by drag&amp;drop or with the <em>Add Files</em> button</li>
            <li><strong>Upload</strong> the file <em>(The maximum file size for uploads is <strong>5 MB</strong>.)</em></li>
            <li>Only <strong>xls and xlsx</strong> files are supported.</li>
            <li>You can <strong>drag &amp; drop</strong> files from your desktop on this webpage with Google Chrome, Mozilla Firefox and Apple Safari.</li>
        </ul>
    </div>

<!-- The file upload form used as target for the file upload widget -->
    <form id="fileupload" action="<?php print(admin_url().'admin-ajax.php');?>" method="POST" enctype="multipart/form-data">
        <!-- Redirect browsers with JavaScript disabled to the origin page -->
        <input type="hidden" name="action" value="load_ajax_function" />
        <table><tr><td><div class="chart-selector">
                        <select id="charttype" name="charttype">
                            <option value="selectchart">Select your chart type</option>
                            <option class="hierarchicalcharts" value="zoomabletreemap">Zoomable Treemap</option>
                            <option class="hierarchicalcharts" value="treemap">Reingold Tilford Tree</option>
                            <option class="hierarchicalcharts" value="sunburst">Sunburst</option>
                        </select>
                    </div>
                    <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->
                    <div class="row fileupload-buttonbar">
                        <div class="span7">
                            <!-- The fileinput-button span is used to style the file input field as button -->
                <span class="btn btn-success fileinput-button">
                    <i class="icon-plus icon-white"></i>
                    <span>Add Files...</span>
                    <input type="file" name="files[]" multiple>
                </span>
                            <button type="submit" class="btn btn-primary start">
                                <i class="icon-upload icon-white"></i>
                                <span>Start upload</span>
                            </button>
                            <button type="button" class="btn btn-danger delete">
                                <i class="icon-trash icon-white"></i>
                                <span>Delete</span>
                            </button>

                        </div>
                        <!-- The global progress information -->
                        <div class="span5 fileupload-progress fade">
                            <!-- The global progress bar -->
                            <div class="progress progress-success progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                                <div class="bar" style="width:0%;"></div>
                            </div>
                            <!-- The extended global progress information -->
                            <div class="progress-extended">&nbsp;</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div id="chartexample"></div>
                </td>
            </tr>
        </table>
		
        <!-- The loading indicator is shown during file processing -->
        <div class="fileupload-loading"></div>
        <br>
        <!-- The table listing the files available for upload/download -->
		
		
        <table role="presentation" class="table table-striped" style="/*width:590px;*/"><tbody class="files" data-toggle="modal-gallery" data-target="#modal-gallery"></tbody></table>
		
    </form>
    <br>
    <div class="well">
       
    </div>


    <div id="chartarea"></div>

<!-- The template to display files available for upload -->
<script id="template-upload" type="text/x-tmpl">
{% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-upload fade">
        <td class="preview"><span class="fade"></span></td>
        <td class="name"><span>{%=file.name%}</span></td>
        <td class="size"><span>{%=o.formatFileSize(file.size)%}</span></td>
        {% if (file.error) { %}
            <td class="error" colspan="2"><span class="label label-important">Error: </span> {%=file.error%}</td>
        {% } else if (o.files.valid && !i) { %}
            <td >
                <div class="progress progress-success progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="bar" style="width:0%;"></div></div>
            </td>
            <td class="start" colspan="2">{% if (!o.options.autoUpload) { %}
                <button class="btn btn-primary">
                    <i class="icon-upload icon-white"></i>
                    <span>Start</span>
                </button>
            {% } %}</td>
        {% } else { %}
            <td colspan="2"></td>
        {% } %}
        <td class="cancel">{% if (!i) { %}
            <button class="btn btn-warning">
                <i class="icon-ban-circle icon-white"></i>
                <span>Cancel</span>
            </button>
        {% } %}</td>
    </tr>
{% } %}
</script>
<!-- The template to display files available for download -->
<script id="template-download" type="text/x-tmpl">
{% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-download fade">
        {% if (file.error) { %}
		<td class="error" colspan="5"><span class="label label-important">Error: </span> {%=file.error%} ({%=file.name.substring(4)%})</td>            
            
        {% } else { %}
            <td class="preview">{% if (file.thumbnail_url) { %}
                <a href="{%=file.url%}" title="{%=file.name%}" data-gallery="gallery" download="{%=file.name%}"><img src="{%=file.thumbnail_url%}"></a>
            {% } %}</td>
            <td class="name" style="width:200px;">
<div style="width:390px;">
                <a href="{%=file.url%}" title="{%=file.name%}" data-gallery="{%=file.thumbnail_url&&'gallery'%}" download="{%=file.name%}">{%=file.name%}</a>
           </div> </td>
            <td class="size"><span>{%=o.formatFileSize(file.size)%}</span></td>
            <td colspan="2"></td>
        {% } %}
        <td class="display">
            <button class="btn btn-danger" data-type="{%=file.display_type%}" data-name="{%=file.name%}">
            <i class="icon-signal icon-white"></i>
            <span>Display</span>
            </button>
        </td>
        <td class="delete">
            <button class="btn btn-danger" data-type="{%=file.delete_type%}" data-url="{%=file.delete_url%}&action=load_ajax_function"{% if (file.delete_with_credentials) { %} data-xhr-fields='{"withCredentials":true}'{% } %}>
                <i class="icon-trash icon-white"></i>
                <span>Delete</span>
            </button>

        </td>
    </tr>
{% } %}
</script>
<?php
}

function tera_charts_shortcode() {
      tera_charts_hook();
}

/* Add the resources */
add_action( 'wp_enqueue_scripts', 'wptc_enqueue_scripts' );

/* Load the inline script */
add_action( 'wp_footer', 'wptc_add_inline_script' );

/* Hook on ajax call */
add_action('wp_ajax_load_ajax_function', 'wptc_load_ajax_function');
add_action('wp_ajax_nopriv_load_ajax_function', 'wptc_load_ajax_function');

add_shortcode ('tera_charts', 'tera_charts_shortcode');
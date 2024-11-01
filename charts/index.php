<?php
/*
 * jQuery File Upload Plugin PHP Example 5.14
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
include_once ("UploadHandler.php");


error_reporting(E_ALL | E_STRICT);
class CustomUploadHandler extends UploadHandler {
    protected function get_user_id() {
        /*@session_start();
        return session_id();*/
        return is_null($_REQUEST['upload_username']) ? "0" : $_REQUEST['upload_username'];
    }

    public function __construct($options = null)
    {
        parent::__construct($options);

    }

    /*protected function get_username()
        return*/
}

//$upload_handler = new CustomUploadHandler();

$upload_handler = new CustomUploadHandler( array(
    'user_dirs' => true
));

<?php
$file_info = pathinfo($_SERVER['PHP_SELF']);
$charts_dir = str_replace( $file_info['basename'], '', $_SERVER['PHP_SELF'] );
?>
<script src="<?php echo $charts_dir . "js/d3/d3.v3.min.js"; ?>"></script>
<script src="<?php echo $charts_dir . "js/rgbcolor.js"; ?>"></script>
<script src="<?php echo $charts_dir . "js/canvg.js"; ?>"></script>
<script src="<?php echo $charts_dir . "js/svgenie.js"; ?>"></script>
<link rel="stylesheet" type="text/css" href="<?php echo $charts_dir . "js/css/tt.css"; ?>" />
<link rel="stylesheet" href="<?php echo $charts_dir . "js/css/style_sunburst.css"; ?>"/>
<script type="text/javascript">
    <?php       
		$filename=explode(".",$_GET['fn']);
        $fname=$filename[0];
	    $fextension=$filename[1];
	  if($fextension=="xlsx" || $fextension=="xls" )
                 {
                   $xlsFilename =$fname.".".$fextension;
                 }
        $userID = (int)$_GET['userid'];
        $headersFilename = str_replace(".xlsx", ".head", $xlsFilename);
        $headersFilename = str_replace(".xls", ".head", $headersFilename);
        if(isset($_SERVER['PATH_TRANSLATED']))
        {
            $info = pathinfo($_SERVER['PATH_TRANSLATED']);
            $filesdir = substr($info['dirname'], 0, strpos( $info['dirname'], 'plugins'));
            $headers = file_get_contents($filesdir. "\\uploads\\" . "files\\" . "$userID\\" . $headersFilename);
        }
        else
        {
            $info = pathinfo($_SERVER['ORIG_PATH_TRANSLATED']);
            $filesdir = $info['dirname'];
            $headers = file_get_contents($filesdir. "/uploads/" . "files/" . "$userID/" . $headersFilename);
        }
    ?>
    var columns_names = "<?php echo $headers; ?>";
    var data_filename = "<?php echo $_GET['fn']; ?>";
    var chart_filename = data_filename.replace(".xlsx", ".json");
    chart_filename = chart_filename.replace(".xls", ".json");
    //TODO retrieve real username
    var chart_userid = "<?php echo $_GET['userid']; ?>";
    var camera = "<img id='camera' title='download picture' src='<?php echo $charts_dir . "js/css/camera.png"; ?>' onclick='picture()'/>"
</script>

<div id = "camera"></div>
<h1><div id="titolo"></div></a></h1>
<h4 id="subtitolo"></h4>



    <div id="chartbody">

    </div>

<span id="parole"></span>

    <script src="<?php echo $charts_dir . "js/script_check_ie.js"; ?>"></script>
  <script src="<?php echo $charts_dir . "js/sunburst_init.js"; ?>"></script>
   <script type="text/javascript" src="<?php echo $charts_dir . "js/sunburst.js"; ?>"></script>

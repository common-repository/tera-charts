<?php include_once ("excelMapClass.php");
$file_info = pathinfo($_SERVER['PHP_SELF']);
$charts_dir = str_replace( $file_info['basename'], '', $_SERVER['PHP_SELF'] );

?>
<div id = "camera"></div>
<h1><div id="titolo"></div></a></h1>

<script src="<?php echo $charts_dir . "js/d3/d3.v3.min.js"; ?>"></script>
<script type="text/javascript" src="<?php echo $charts_dir . "js/accounting.js"; ?>"></script>
<link rel="stylesheet" type="text/css" href="<?php echo $charts_dir . "js/css/tt.css"; ?>" />


<link rel="stylesheet" href="<?php echo $charts_dir . "js/css/style_treemap.css"; ?>"/>
<script src="<?php echo $charts_dir . "js/rgbcolor.js"; ?>"></script>
<script src="<?php echo $charts_dir . "js/canvg.js"; ?>"></script>
<script src="<?php echo $charts_dir . "js/svgenie.js"; ?>"></script>
<script src="<?php echo $charts_dir . "js/script_check_ie.js"; ?>"></script>

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
        $totalFilename = str_replace(".xlsx", ".total", $xlsFilename);
        $totalFilename = str_replace(".xls", ".total", $totalFilename);
        if(isset($_SERVER['PATH_TRANSLATED']))
        {
            $info = pathinfo($_SERVER['PATH_TRANSLATED']);
            $filesdir = substr($info['dirname'], 0, strpos( $info['dirname'], 'plugins'));
            $headers = file_get_contents($filesdir. "\\uploads\\" . "files\\" . "$userID\\" . $headersFilename);
            $total_value = file_get_contents($filesdir. "\\uploads\\" . "files\\" . "$userID\\" . $totalFilename);
        }
        else
        {
            $info = pathinfo($_SERVER['ORIG_PATH_TRANSLATED']);
            $filesdir = substr($info['dirname'], 0, strpos( $info['dirname'], 'plugins'));
            $headers = file_get_contents($filesdir. "/uploads/" . "files/" . "$userID/" . $headersFilename);
            $total_value = file_get_contents($filesdir. "/uploads/" . "files/" . "$userID/" . $totalFilename);
        }
    ?>
    var columns_names = "<?php echo $headers; ?>";
    var total_value = "<?php echo $total_value; ?>";
    var data_filename = "<?php echo $_GET['fn']; ?>";
    var chart_filename = data_filename.replace(".xlsx", ".json");
    chart_filename = chart_filename.replace(".xls", ".json");
    var chart_userid = "<?php echo $_GET['userid']; ?>";
    var camera = "<img id='camera' title='download picture' src='<?php echo $charts_dir . "js/css/camera.png"; ?>' onclick='picture()'/>";
</script>
<script type="text/javascript" src="<?php echo $charts_dir . "js/treemap_init.js"; ?>"></script>
<script type="text/javascript" src="<?php echo $charts_dir . "js/treemap.js"; ?>"></script>

<div id="chartbody"></div>

<div id = "wpbi_topSelectors">
    <div id="wpbi_formatForm"><form>
            <select id="listFormat"  onchange="init()">
            </select>
        </form>
    </div>
</div>

<span id="percorso"></span>
<span id="parole"></span>

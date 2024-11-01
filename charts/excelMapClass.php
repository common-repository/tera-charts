<?php
$sheet='Sheet1';

class excel2JSON  { 

	/**
	 * excel file path
	 * @var string $file
	 */
	private $file=FALSE;

	/**
	 * excel file with zip:// prefix
	 * @var string $excel
	 */
	private $excel=FALSE;

	/**
	 * excel workbooks reference
	 * @var string $workbooks
	 */
	private $workbooks="xl/workbook.xml";

	/**
	 * excel XML shared strings reference file
	 * @var string $strings
	 */
	private $strings="xl/sharedStrings.xml";

	/**
	 * excel shared Strings data
	 * @var string $excel_strings
	 */
	private $excel_strings;
	
	/**
	 * loaded excel file list
	 * @var array $load
	 */
	private $load=array();
	
	/** 
	 * selected Excel workbook
	 * 
	 * @var string $loaded_workbook
	 */
	private $loaded_workbook=FALSE;
	
	/**
	 *  loaded Workbook data
	 * 
	 * @var array $loaded_workbook_data
	 */
	private $loaded_workbook_data=array();
	
	/**
	 * loaded Workbook data
	 * 
	 * @var array $loaded_workbook_cells
	 */
	private $loaded_workbook_cells=array();

	/**
	 * loaded Workbook data
	 *
	 * @var array $loaded_workbook_rows
	 */
	private $loaded_workbook_rows=array();
	
	/**
	 * Excel cell list
	 * @var array $filter
	 */
	private $filter=array();
	
	
	/**
	 * load the excel file if it's past as an argument
	 * 
	 * @param string $file
	 * @return boolean
	 */
	function __construct($file='') {
		if ($file != '') $this->set_excel($file);
		return TRUE;
	}
	
	/**
	 * sets the excel file to use as a DB
	 * file should have an xlsx or xlsm
	 * @param file $file
	 * @param string it's default is true, set to false if your sheet fails to load
	 */
	function set_excel($file, $t='true') { 
		if (is_file($file)) { 
			$this->excel=realpath($file);
			$this->file='zip://'.realpath($file);
			$this->load=$this->zip_resorces($this->excel);
			// load work book list
			$sheets=trim(file_get_contents($this->file.'#'.$this->workbooks));
			$wb=$this->xsl_out($this->GetWorkbooksList_xslt($t), $sheets);
			if ($wb != '') $this->excel_sheets=parse_ini_string($wb); 

			return TRUE;
		} 
		return FALSE; 
		
	}
	
	/**
	 * load excel sheet by name
	 * @param string $sheet
	 * @return boolean
	 */
	function load_sheet($sheet) {
		if (in_array($sheet, $this->excel_sheets['title'])) {
			$key=array_search($sheet, $this->excel_sheets['title']);
			$this->loaded_workbook=ltrim($this->excel_sheets['xml'][$key], '/');
			return TRUE;
		}
		return FALSE;
	}
	
	/**
	 * load excel sheet data
	 * @return boolean
	 */
	function load_sheet_data(){
		if (!$this->loaded_workbook) return FALSE;
        // load workbook from file
		//$data=trim(file_get_contents($this->file.'#'.$this->loaded_workbook));
        $data=file_get_contents($this->file.'#'.$this->loaded_workbook);
        //
		//$excel_strings=trim(file_get_contents($this->file.'#'.$this->strings));
        $excel_strings=file_get_contents($this->file.'#'.$this->strings);
		$ini=$this->xsl_out($this->cellList_xslt(), $data);
		if ($ini != '') {
			$this->loaded_workbook_data=parse_ini_string($ini, TRUE);
			foreach($this->loaded_workbook_data as $k => $v) {
				if ($k != 'sheet') {
					if (array_key_exists('val', $v)) {
						if (array_key_exists('t', $v) && $v['t'] == 's') {	
							$val=$v['val']+1;
							$s=$this->xsl_out($this->StringLookup_xslt( $val), $excel_strings);
							$this->loaded_workbook_data[$k]['val']=$s;
							$this->loaded_workbook_cells[$k]=$s;
							$this->loaded_workbook_rows[$v['row']][$k]=$s;
							// drop the 't' key off of the array, it's only needed for text look up
							array_pop($this->loaded_workbook_data[$k]);
					 	}  else {
					 		$this->loaded_workbook_cells[$k]=$v['val'];
					 		$this->loaded_workbook_rows[$v['row']][$k]=$v['val'];
						}
					}
				}
			}
			return TRUE;
		}
		return FALSE;
	}
	

	/**
	 * add an excel cell reference to filter list
	 * @param string $cell
	 */
	function add_cell_list($cell) {
		if (array_key_exists($cell, $this->loaded_workbook_cells)) $this->filter[]=$cell;
	}
	
	/**
	 * print sheet cells as JSON Document
	 *
	 * it will basicly be { "excel cell":"excel data" }
	 *
	 */
	function print_sheet_rows() {
		if (!$this->loaded_workbook) $this->print_sheets();
		$this->json_out($this->loaded_workbook_rows);
	}
	
	/**
	 * print sheet data as JSON Document
	 * 
	 * it will basicly be { "excel cell" : { "row": "row number", "val": "excel data" } }
	 */
	function print_sheet_data() { 
		if (!$this->loaded_workbook) $this->print_sheets();
		$this->json_out($this->loaded_workbook_data); 
	}
	
	/**
	 * filter workbook data 
	 * returns filter data as an array
	 */
	function filter_data() {
		$filter=array();
		foreach ($this->filter as $f) $filter[$f]=$this->loaded_workbook_data[$f];
		return $filter;
	}
	
	
	/**
	 * print filtered sheet cells data as JSON Document
	 *
	 * it will basicly be { "excel cell" : { "row": "row number", "val": "excel data" } }
	 *
	 */
	function print_filter_data() {
		if (!$this->loaded_workbook) $this->print_sheets();
		$this->json_out($this->filter_data());
	}
	
	
	/**
	 * print sheet cells as JSON Document
	 * 
	 * it will basicly be { "excel cell":"excel data" }
	 * 
	 */
	function print_sheet_cells() {
		if (!$this->loaded_workbook) $this->print_sheets();
		$this->json_out($this->loaded_workbook_cells);
	}
	
	/**
	 * filter cells 
	 * returns filter data as an array
	 *
	 */
	function filter_cells() {
		$filter=array();
		foreach ($this->filter as $f) $filter[$f]=$this->loaded_workbook_cells[$f];
		return $filter;
	}

    public function returnColumnsHeaders()
    {
        $headersString = "";
        $keys = array_keys($this->loaded_workbook_rows[1]);

        for ($i=0; $i < count($this->loaded_workbook_rows[1]); $i++)
        {
            $headersString .= $this->loaded_workbook_rows[1][$keys[$i]];
            if($i < count($this->loaded_workbook_rows[1]))
            {
                $headersString .= ",";
            }
        }
        return $headersString;
    }

    public function buildHierarchicArray()
    {
        $hierarchicArray = array();
        $total = 0;
        $previous = 0;

        // get chart identifier
        $info = pathinfo($this->file);
        $filetokens = explode('_', $info['filename']);
        $chartid = $filetokens[0];

        switch($chartid)
        {
            case "hierarchicalbars":
            case "zoomabletreemap":
            case "treemap":
            case "partitionedlayout":
            case "sunburst":
            {
                for($i = 2; $i < count($this->loaded_workbook_rows); $i++)
                {
                    $this->buildHierarchy($hierarchicArray, $this->loaded_workbook_rows[$i], 0, $total, $previous);
                }
            }
            break;

            case "bubbles":
            case "bubbleszoomable":
            {
                for($i = 2; $i < count($this->loaded_workbook_rows); $i++)
                {
                    $this->buildHierarchyBubble($hierarchicArray, $this->loaded_workbook_rows[$i], 0, $total, $previous);
                }
            }

        }

        $rootNode = array();
        $rootNode["name"] = "Total";
        $rootNode["value"] = $total;
        $rootNode["previous"] = $previous;

        switch($chartid)
        {
            case "bubbles":
            case "bubbleszoomable":
            {
                $rootNode["discount"] = $hierarchicArray[0]["discount"];
                $rootNode["margin"] = $hierarchicArray[0]["margin"];
            }
        }

        $rootNode["children"] = $hierarchicArray;

        return $rootNode;
    }

    /**
     * build the hierarchy according to the
     * columns passed as parameters
     * for json with "value" and "previous"
     */
    function buildHierarchy(&$hierarchy = array(), $row = array(), $depth, &$total, &$previousTotal)
    {
        $row_keys = array_keys($row);

        if($depth == (count($row) - 3))
        {
            $node = $this->searchKeyValue($hierarchy, $row[$row_keys[$depth]], "name" );
            //$node = -1;
            if($node < 0)
            {
            $item = array();
            $item["name"] = $row[$row_keys[$depth]];
            $item["value"] = ((strpos($row[$row_keys[$depth + 1]], '.') !== false)  ||  (strpos($row[$row_keys[$depth + 1]], ',') !== false)) ?
                (float)($row[$row_keys[$depth + 1]]) : (int)($row[$row_keys[$depth + 1]]);
            $item["previous"] = ((strpos($row[$row_keys[$depth + 2]], '.') !== false)  ||  (strpos($row[$row_keys[$depth + 2]], ',') !== false)) ?
                (float)($row[$row_keys[$depth + 2]]) : (int)($row[$row_keys[$depth + 2]]);
            array_push($hierarchy, $item);
            }
            else
            {
                $hierarchy[$node]["value"] += ((strpos($row[$row_keys[$depth + 1]], '.') !== false)  ||  (strpos($row[$row_keys[$depth + 1]], ',') !== false)) ?
                    (float)($row[$row_keys[$depth + 1]]) : (int)($row[$row_keys[$depth + 1]]);
                $hierarchy[$node]["previous"] += ((strpos($row[$row_keys[$depth + 2]], '.') !== false)  ||  (strpos($row[$row_keys[$depth + 2]], ',') !== false)) ?
                    (float)($row[$row_keys[$depth + 2]]) : (int)($row[$row_keys[$depth + 2]]);
            }

            return array($row[$row_keys[$depth + 1]], $row[$row_keys[$depth + 2]]);
        }
        else
        {
            $node = $this->searchKeyValue($hierarchy, $row[$row_keys[$depth]], "name" );
            if( $node < 0)
            {
                $node = count($hierarchy);
                $hierarchy[$node] = array();
                $hierarchy[$node]["name"] = $row[$row_keys[$depth]];
                $hierarchy[$node]["value"] = 0;
                $hierarchy[$node]["previous"] = 0;
                $hierarchy[$node]["children"] = array();
            }

            $returnArray = $this->buildHierarchy($hierarchy[$node]["children"], $row, $depth + 1);

            $hierarchy[$node]["value"] += $returnArray[0];
            $hierarchy[$node]["previous"] += $returnArray[1];

            $total += $returnArray[0];
            $previousTotal += $returnArray[1];

            return array($returnArray[0], $returnArray[1]);
        }
    }

    /**
     * build the hierarchy according to the
     * columns passed as parameters
     * for json with "value" and "previous"
     */
    function buildHierarchyBubble(&$hierarchy = array(), $row = array(), $depth, &$total, &$previousTotal)
    {
        $row_keys = array_keys($row);

        if($depth == (count($row) - 5))
        {
            $node = $this->searchKeyValue($hierarchy, $row[$row_keys[$depth]], "name" );
            //$node = -1;
            if($node < 0)
            {
                $item = array();
                $item["name"] = $row[$row_keys[$depth]];
                $item["value"] = ((strpos($row[$row_keys[$depth + 1]], '.') !== false)  ||  (strpos($row[$row_keys[$depth + 1]], ',') !== false)) ?
                    (float)($row[$row_keys[$depth + 1]]) : (int)($row[$row_keys[$depth + 1]]);
                $item["previous"] = ((strpos($row[$row_keys[$depth + 2]], '.') !== false)  ||  (strpos($row[$row_keys[$depth + 2]], ',') !== false)) ?
                    (float)($row[$row_keys[$depth + 2]]) : (int)($row[$row_keys[$depth + 2]]);
                $item["discount"] = ((strpos($row[$row_keys[$depth + 3]], '.') !== false)  ||  (strpos($row[$row_keys[$depth + 3]], ',') !== false)) ?
                    (float)($row[$row_keys[$depth + 3]]) : (int)($row[$row_keys[$depth + 3]]);
                $item["margin"] = ((strpos($row[$row_keys[$depth + 4]], '.') !== false)  ||  (strpos($row[$row_keys[$depth + 4]], ',') !== false)) ?
                    (float)($row[$row_keys[$depth + 4]]) : (int)($row[$row_keys[$depth + 4]]);
                array_push($hierarchy, $item);
            }
            else
            {
                $hierarchy[$node]["value"] += ((strpos($row[$row_keys[$depth + 1]], '.') !== false)  ||  (strpos($row[$row_keys[$depth + 1]], ',') !== false)) ?
                    (float)($row[$row_keys[$depth + 1]]) : (int)($row[$row_keys[$depth + 1]]);
                $hierarchy[$node]["previous"] += ((strpos($row[$row_keys[$depth + 2]], '.') !== false)  ||  (strpos($row[$row_keys[$depth + 2]], ',') !== false)) ?
                    (float)($row[$row_keys[$depth + 2]]) : (int)($row[$row_keys[$depth + 2]]);
                $hierarchy[$node]["discount"] = ((strpos($row[$row_keys[$depth + 3]], '.') !== false)  ||  (strpos($row[$row_keys[$depth + 3]], ',') !== false)) ?
                    (float)($row[$row_keys[$depth + 3]]) : (int)($row[$row_keys[$depth + 3]]);
                $hierarchy[$node]["margin"] = ((strpos($row[$row_keys[$depth + 4]], '.') !== false)  ||  (strpos($row[$row_keys[$depth + 4]], ',') !== false)) ?
                    (float)($row[$row_keys[$depth + 4]]) : (int)($row[$row_keys[$depth + 4]]);
            }

            return array($row[$row_keys[$depth + 1]], $row[$row_keys[$depth + 2]], $row[$row_keys[$depth + 3]], $row[$row_keys[$depth + 4]]);
        }
        else
        {
            $node = $this->searchKeyValue($hierarchy, $row[$row_keys[$depth]], "name" );
            if( $node < 0)
            {
                $node = count($hierarchy);
                $hierarchy[$node] = array();
                $hierarchy[$node]["name"] = $row[$row_keys[$depth]];
                $hierarchy[$node]["value"] = 0;
                $hierarchy[$node]["previous"] = 0;
                $hierarchy[$node]["discount"] = 0;
                $hierarchy[$node]["margin"] = 0;
                $hierarchy[$node]["children"] = array();
            }

            $returnArray = $this->buildHierarchyBubble($hierarchy[$node]["children"], $row, $depth + 1);

            $hierarchy[$node]["value"] += $returnArray[0];
            $hierarchy[$node]["previous"] += $returnArray[1];
            $hierarchy[$node]["discount"] = ((strpos($returnArray[2], '.') !== false)  ||  (strpos($returnArray[2], ',') !== false)) ?
            (float)($returnArray[2]) : (int)($returnArray[2]);
            $hierarchy[$node]["margin"] = ((strpos($returnArray[3], '.') !== false)  ||  (strpos($returnArray[3], ',') !== false)) ?
                (float)($returnArray[3]) : (int)($returnArray[3]);

            $total += $hierarchy[$node]["value"];
            $previousTotal += $hierarchy[$node]["previous"];

            return array($hierarchy[$node]["value"], $hierarchy[$node]["previous"], $hierarchy[$node]["discount"], $hierarchy[$node]["margin"]);
        }
    }

    /**
     * build csv string from xls content
     *
     *
     */

    function buildCSV()
    {
        $rows = count($this->loaded_workbook_rows);
        $cols = count($this->loaded_workbook_rows[1]);
        $colsname = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
            'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'W', 'Z') ;
        $csv = "";

        for($rowcount = 0; $rowcount < $rows; $rowcount++)
        {
            for($colcount = 0; $colcount < $cols; $colcount++)
            {
                if(isset($this->loaded_workbook_cells[$colsname[$colcount].($rowcount+1)]))
                {
                    $v = $this->loaded_workbook_cells[$colsname[$colcount].($rowcount+1)];
                    $csv .= $v;
                }
                else
                {
                    $csv .= '';
                }
                if($colcount == $cols - 1) {
                    $csv .= "\n";
                } else {
                    $csv .= ",";

                }
            }
        }
        return $csv;
    }

    /**
     * search for a key value in a list of associative arrays
     *
     *
     */

    function searchKeyValue($list = array(), $needle, $key)
    {
        for ($i = 0; $i < count($list); $i++)
        {
            if($list[$i][$key] === $needle)
            {
                return $i;
            }
        }
        return -1;
    }

    /**
	 * print filtered sheet cells as JSON Document
	 *
	 * it will basicly be { "excel cell":"excel data" }
	 *
	 */
	function print_filter_cells() {
		if (!$this->loaded_workbook) $this->print_sheets();
		$this->json_out($this->filter_cells());
	}
	
	/**
	 * print workbook sheet names as JSON Document
	 *
	 * it will basicly be [ "sheet name" ]
	 */
	function print_sheets() { $this->json_out($this->excel_sheets['title']); }
	
	/**
	 * open zip files such as excel xlsx or xlsm
	 */
	private function zip_resorces($zip) {
		if (! class_exists ( 'ZipArchive' )) die('ZipArchive class not found');
		$za = new ZipArchive();
		$za->open( $zip );
		$list = array();
		for($i = 0; $i < $za->numFiles; $i ++) {
			$z = $za->statIndex( $i );
			$list[] = $z['name'];
		}
		$za->close();
		return $list;
	}
	
	/**
	 * print out json document to browser/client
	 *
	 * @param string $data
	 * @return string
	 */
	public function json_out($data) {
		if (! is_array ( $data ) || (count ( $data ) == 0)) $data=array("error" => "No Excel data to show");
		header ( 'Cache-Control: no-cache, must-revalidate' );
		header ( 'Expires: Mon, 26 Jul 1997 05:00:00 GMT' );
		header ( 'Content-type: application/json' );
		echo json_encode ( $data );
		exit ();
	}

    public function clear_data()
    {
        $this->loaded_workbook_rows = null;
        $this->loaded_workbook_cells = null;
        $this->loaded_workbook_data = null;
    }
	
	/**
	 * Apply xslt template to xml data
	 * - you can send params to your xslt style sheet like this array('a' => 'a value', 'b' => 2);
	 *
	 * @param string $xsltmpl         	XSLT stylesheet to be applied to XML
	 * @param string $xml_load      	XML data
	 * @return string boolean void from transformed XML data or fail
	 */
	private function xsl_out($xsltmpl, $xml_load) {
		if (! class_exists ( 'DOMDocument' ))  die('DOMDocument class not found');
		if (! class_exists ( 'XSLTProcessor' )) die('XSLTProcessor class not found');
		// loads XML data string
		$xml = new DOMDocument ();
		if (! $xml->loadXML ( $xml_load )) die('XML data failed to load'); 
		// loads XSL template string
		$xsl = new DOMDocument ();
		if (! $xsl->loadXML ( $xsltmpl ))  die('XSLT failed to load'); 
		$xslproc = new XSLTProcessor();
		$xslproc->importStylesheet( $xsl );
		return $xslproc->transformToXml( $xml );
	}

/* XSLT TEMPLATES THAT WILL BE USED TO PARSE XML IN THE EXCEL ZIP FILE */
	
	/**
	 * XSLT style for selecting cells on an excel work sheet
	 *
	 * XSLT param is called cell, it is alpha numeric, like A1 or ZY98 for an excel cell reference
	 *
	 * XML: <excel>/xl/worksheets/sheet*.xml, this file is in the generated list from GetWorkbooksList_xslt() and <excel>/xl/workbook.xml
	 *
	 * @return string
	 */
	private function cellList_xslt() {
		$cell='$cell';
		return <<<X
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
 xmlns:w="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
 <xsl:output method="text" media-type="text/plain"/>
 <xsl:template match="/">[sheet]
dimension[]="<xsl:value-of select="substring-before(//dimension/@ref|//w:dimension/@ref,':')"/>"
dimension[]="<xsl:value-of select="substring-after(//dimension/@ref|//w:dimension/@ref,':')"/>"
<xsl:apply-templates select="//c|//w:c" /></xsl:template>
 <xsl:template match="//c|//w:c">
  <xsl:if test="v|w:v">
[<xsl:value-of select="@r"/>]
row="<xsl:value-of select="../@r"/>"
val="<xsl:value-of select="v|w:v"/>"
<xsl:if test="@t">t="<xsl:value-of select="@t"/>"</xsl:if>
  </xsl:if>
 </xsl:template>
</xsl:stylesheet>
X
	;
	}
	
	/**
	 * XSLT style for searching for row passed by cellMatch for string values
	 * 
	 * XSLT param is called row, should be numeric
	 * 
	 * XML: <excel>/xl/sharedStrings.xml
	 * @param mixed $row row can be the default, or the number to look up.  this is a work around
	 * @return string
	 */
	private function StringLookup_xslt($row='$row') {
		return <<<x
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
	xmlns:s="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
	xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	version="1.0">
  <xsl:output method="text" media-type="text/plain"/>
  <!-- Row should be numeric, starts at 1, not 0; may need to add 1 to row first -->
  <xsl:param name="row" />
  <xsl:template match="/">
    <xsl:value-of select="/sst/si[$row]/t|/s:sst/s:si[$row]/s:t"/></xsl:template>
</xsl:stylesheet>
x
;
	}
	
	/**
	 * XSLT style for grabbing a list of the excel worksheets
	 * 
	 * XML: <excel>/xl/workbook.xml
	 * 
	 * @return string
	 */
	private function  GetWorkbooksList_xslt($t='true') {
		$page='$page';
		$r='$r';
		return <<<x
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  xmlns:o="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  version="1.0">
  <xsl:output method="text" media-type="text/plain"/>
  <xsl:param name="page" select="'xl/worksheets/sheet'" />
  <xsl:param name="r" select="'$t'"/>
  <xsl:template match="/"><xsl:apply-templates select="o:workbook|workbook" />
 </xsl:template>
  <xsl:template  match="o:workbook|workbook">[worksheets]<xsl:apply-templates select="o:sheets|sheets" /></xsl:template>
  <xsl:template match="o:sheets|sheets">
    <xsl:for-each select="o:sheet|sheet">
title[]="<xsl:value-of select="@name"/>"
<xsl:choose>
 <xsl:when test="$r='true'">
xml[]="<xsl:value-of select="$page"/><xsl:value-of select="substring-after(@r:id, 'rId')"/>.xml"   
  </xsl:when>
  <xsl:otherwise>
xml[]="<xsl:value-of select="$page"/><xsl:value-of select="@sheetId"/>.xml"
  </xsl:otherwise>
</xsl:choose>  
  </xsl:for-each>
 </xsl:template>
</xsl:stylesheet>
x
;
	}
	
}

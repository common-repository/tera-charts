
        var format = "€";
        var nomeFile = null;

function picture() {
            svgenie.save( document.getElementById('svg'), { name:"chart.png" } ); 
        }


function init() {

        d3.select("svg").remove();
        var pulisciFormat = document.getElementById("listFormat").options.length;

        var secondLine = null;

        var menuFormat = "Format,in %,in €";
        var menuFormatVal = "Format,%,€";

        menuFormat = menuFormat.split(",");
        menuFormatVal = menuFormatVal.split(",");
        var listformat=document.getElementById("listFormat");  
            for (var i = 0; i < menuFormat.length; i++) 
            {
                var opt = document.createElement("option");
                document.getElementById("listFormat").options.add(opt);
                opt.text = menuFormat[i];
                opt.value = menuFormatVal[i];
            }

        var sceltaformat = listformat.options[listformat.selectedIndex].value;

        if (sceltaformat == "Formato")
          {
          }
          else 
          {
            format = sceltaformat;
          } 

        var parole = "<p><span style='color:#ff0000'> Red: decrease vs previous period. </span><span style='color:#006400'>Green: increase vs previous period.</span>Choose the main metric between currency and %.<br>The darker the color, the larger the change relative to the previous year. The larger the cells, the higher the revenues. Click on any cell to zoom, click again to go back. </p>";

        document.getElementById("camera").innerHTML = camera;

        document.getElementById("parole").innerHTML = parole;
        var columns = columns_names.split(",");

        document.getElementById("titolo").innerHTML = "";

        for( var column = 0; column < columns.length; column++)
        {
            document.getElementById("titolo").innerHTML += columns[column];
            if (column < columns.length - 1)
            {
                document.getElementById("titolo").innerHTML += " ";
            }
        }
        
        for (var i = 0; i < pulisciFormat; i++) 
        {
          var opt = document.createElement("option");
          document.getElementById("listFormat").options.remove(opt);
        }



makeChart();

}

 

        var order = "uno"
        var unodue = "uno"

function picture() {
            svgenie.save( document.getElementById('svg'), { name:"chart.png" } ); 
        }
        
       
function init () {

    d3.select("svg").remove();
    d3.select(".chart").remove();

        var parole = "<p><span style='color:#ff0000'> Red: decrease vs previous period. </span><span style='color:#006400'>Green: increase.</span><br>The darker the color, the larger the change relative to the previous year. Area size is function of sales. Click on a cell to see further levels of detail, click in the center to go back. </p>"

        document.getElementById("camera").innerHTML = camera;
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



        document.getElementById("parole").innerHTML = parole;

makeChart();

 }


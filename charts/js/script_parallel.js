var ie =( function(){
                var undef,
                    v = 3,
                    div = document.createElement('div'),
                    all = div.getElementsByTagName('i');

                while (
                  div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                  all[0]
                );

                return v > 4 ? v : undef;

          }()); 

    if (ie < 9) { 
          alert("This website needs a modern browser/questo sito richiede un browser moderno.  Install/installare Google Chrome, Mozilla Firefox, Apple Safari, Internet Explorer 10.");
          }



var flags = "<img id='flagIta' src='http://www.wpbusinessintelligence.com/js/css/flagita.png' onclick='ita()'/><img id='flagEng' src='http://www.wpbusinessintelligence.com/js/css/flageng.png' onclick='eng()'/>"

        var language = "eng";
        var colore = "d";  
        var legenda = "categorie" 
        var legend = "categories"

       function ita() {
          language = "ita";
          init();}
          function eng() {
          language = "eng";
          init();}

function init () {

d3.select("svg").remove();
d3.select(".grid").remove();

var pulisciFormat = document.getElementById("listFormat").options.length
 
var menuFormatIta = "Colore,mono, funzione fatturato netto 2012, funzione fatturato netnet 2012, categorie";
        var menuFormatEng = "Color,monochome, function of net 2012 sales, function of netnet 2012 sales, categories";
        var menuFormatVal = "Formato,a,b,c,d";

        var menuFormat = null;
        switch (language) 
        {
            case 'ita': menuFormat = menuFormatIta; break;
            case 'eng': menuFormat = menuFormatEng; break;
            default:  null; break;
        }
                      
        menuFormat = menuFormat.split(",")
        menuFormatVal = menuFormatVal.split(",")
        var listformat=document.getElementById("listFormat");  
            for (var i = 0; i < menuFormat.length; i++) 
            {
                var opt = document.createElement("option");
                document.getElementById("listFormat").options.add(opt);
                opt.text = menuFormat[i];
                opt.value = menuFormatVal[i];
            }

        var sceltaformat = listformat.options[listformat.selectedIndex].value;
        var sceltacolore = listformat.options[listformat.selectedIndex].text;

       if (sceltaformat == "Formato")
          {
          }
          else 
          {
            colore = sceltaformat;
          legenda = sceltacolore;
        legend = sceltacolore;
       
          } 

 
        var secondLine = null
        switch (language) 
        {
            case 'ita': secondLine = 'fatturato in euro, colore: '+ legenda; break;
            case 'eng': secondLine = 'sales in euros, color: '+ legend; break;
            default: testoPercorso =  null; break;
        }

        var tema = null
        switch (language) 
        {
            case 'ita': tema = "Coordinate parallele - analisi prodotti"; break;
            case 'eng': tema = "Parallel coordinates - product analysis"; break;
            default: testoPercorso =  null; break;
        }

   

        var paroleIta = "<span>Clicca su uno degli assi per selezionare un sottoinsieme di prodotti. Clicca sopra uno degli assi per trascinarlo in una altra posizione.</span>"

        var paroleEng = "<span>Click on an axis to select a subset of products. Click on top of an axis to move the axis in another position. </span>"
        
        
        var parole = null
        switch (language) {
        case 'ita': parole = paroleIta; break;
        case 'eng': parole = paroleEng; break;
        default: parole =  paroleIta; break;
        }



        document.getElementById("flags").innerHTML = flags;
        document.getElementById("titolo").innerHTML = tema;
        document.getElementById("subtitolo").innerHTML = secondLine;
        document.getElementById("parole").innerHTML = parole;


         for (var i = 0; i < pulisciFormat; i++) 
        {
          var opt = document.createElement("option");
          document.getElementById("listFormat").options.remove(opt);
        }










// load csv file and create the chart
var parcoords;

d3.csv('http://www.wpbusinessintelligence.com/wp-content/uploads/data/parallel_coordinates.csv', function(data) {
  
data.forEach(function(d,i) { d.id = d.id || i; });
if (colore == "a")
{
    parcoords = d3.parcoords()("#example")
    .data(data)
    .color("#9c9ede")
    .mode("queue")
    .composite("darker")
    .alpha(0.4)
    .render()
    .brushable()
    .reorderable();  // enable brushing
}
 
else if (colore == "b")
  {
  var blue_to_brown_Fatt = d3.scale.log()
  .domain([1, 800000])
  .clamp(true)
  .range(["brown","steelblue"])
  .interpolate(d3.interpolateLab);

  var colorFatt = function(d) { return blue_to_brown_Fatt(d['2012 net']); };
    
     parcoords = d3.parcoords()("#example")
    .data(data)
    .color(colorFatt)
    .mode("queue")
    .composite("darker")
    .alpha(0.4)
    .render()
    .brushable()
    .reorderable();  // enable brushing
}
else if (colore == "c")
  {

var blue_to_brown_Marg = d3.scale.log()
  .domain([1, 800000])
  .clamp("true")
  .range(["brown","steelblue"])
  .interpolate(d3.interpolateLab);

  var colorMarg = function(d) { return blue_to_brown_Marg(d['2012 netnet']); };
 
  parcoords = d3.parcoords()("#example")
    .data(data)
    .color(colorMarg)
    .mode("queue")
    .composite("darker")
    .alpha(0.4)
    .render()
    .brushable()
    .reorderable();  // enable brushing
}
else if (colore == "d")
  {
  
  var colorgen = d3.scale.category20();
  var colors = {};
  _(data).chain()
    .pluck('category')
    .uniq()
    .each(function(d,i) {
      colors[d] = colorgen(i);
    });


var color = function(d) { return colors[d.category]; };

   parcoords = d3.parcoords()("#example")
    .data(data)
    .color(color)
    .mode("queue")
    .composite("darker")
    .alpha(0.4)
    .render()
    .brushable()
    .reorderable();  // command line mode





}

  // create data table, row hover highlighting
// setting up grid
  var column_keys = d3.keys(data[0]);
  var columns = column_keys.map(function(key,i) {
    return {
      id: key,
      name: key,
      field: key,
      sortable: true
    }
  });

  var options = {
    enableCellNavigation: true,
    enableColumnReorder: false,
    multiColumnSort: false
  };

  var dataView = new Slick.Data.DataView();
  var grid = new Slick.Grid("#grid", dataView, columns, options);
  var pager = new Slick.Controls.Pager(dataView, grid, jQuery("#pager"));

  // wire up model events to drive the grid
  dataView.onRowCountChanged.subscribe(function (e, args) {
    grid.updateRowCount();
    grid.render();
  });

  dataView.onRowsChanged.subscribe(function (e, args) {
    grid.invalidateRows(args.rows);
    grid.render();
  });

  // column sorting
  var sortcol = column_keys[0];
  var sortdir = 1;

  function comparer(a, b) {
    var x = a[sortcol], y = b[sortcol];
    return (x == y ? 0 : (x > y ? 1 : -1));
  }
  
  // click header to sort grid column
  grid.onSort.subscribe(function (e, args) {
    sortdir = args.sortAsc ? 1 : -1;
    sortcol = args.sortCol.field;

    if (jQuery.browser.msie && jQuery.browser.version <= 8) {
      dataView.fastSort(sortcol, args.sortAsc);
    } else {
      dataView.sort(comparer, args.sortAsc);
    }
  });

  // highlight row in chart
  grid.onMouseEnter.subscribe(function(e,args) {
    var i = grid.getCellFromEvent(e).row;
    var d = parcoords.brushed() || data;
    parcoords.highlight([d[i]]);
  });
  grid.onMouseLeave.subscribe(function(e,args) {
    parcoords.unhighlight();
  });

  // fill grid with data
  gridUpdate(data);

  // update grid on brush
  parcoords.on("brush", function(d) {
    gridUpdate(d);
  });

  function gridUpdate(data) {
    dataView.beginUpdate();
    dataView.setItems(data);
    dataView.endUpdate();
  };

});

}

    window.onload = init


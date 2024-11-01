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



var flags = "<img id='flagIta' src='css/flagita.png' onclick='ita()'/><img id='flagEng' src='css/flageng.png' onclick='eng()'/>"

        var language = "eng";
        var dimensioni =  ["trend","sales","type","manager"];


        function ita() {
          language = "ita";
          init();}
          function eng() {
          language = "eng";
          init();}



function init () {

d3.select("svg").remove();
d3.select(".chart").remove();

        var pulisciFormat = document.getElementById("listFormat").options.length

        var menuFormatIta = "Escludi una dimensione,trend,fatturato,tipo,manager";
        var menuFormatEng = "Exclude a dimension,trend,fatturato,type,manager";
        var menuFormatVal = "None,0,1,2,3";

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

       
       if (sceltaformat == "None" || sceltaformat == null)
          {   
          }
          else 
          {
            dimensioni.splice(sceltaformat,1)
                 } 




        var secondLine = null
        switch (language) 
        {
            case 'ita': secondLine = 'colori: '; break;
            case 'eng': secondLine = 'color legend: '; break;
            default: secondLine =  null; break;
        }

           

        var tema = null;
        switch (language) 
        {
            case 'ita': tema = 'parallel sets - analisi clienti' ; break;
            case 'eng': tema = 'parallel sets - customer analysis'; break;
            default: tema =  null; break;
        }



        var paroleIta = "<p>Spiegazione. Per ogni dimensione viene mostrata una barra orizzontale per ciascuna delle sue categorie. La larghezza della barra indica il numero assoluto di elementi che appartengono a quella categoria. Numero e percentuale sono visibili in mouseover. <br> Partendo dalla prima dimensione, ogni categoria e' collegata alle categorie della dimensione successiva, indicando come la categoria e' suddivisa. Questa suddivisione e' ripetuta in modo ricursivo, generando un albero di 'nastri'.<br> Trascinare le dimensioni e le categorie per riordinarle. Cliccare sui tag 'alpha' e 'size' che appaiono accanto alle dimensioni facendo mouseover per ordinare le categorie per nome o per frequenza. Codice di Jason Davies. </p>"
        var paroleEng = "<p>Explanation. For each dimension, a horizontal bar is shown for each of its categories. The width of the bar denotes the absolute number of matches for that category. Number and percent are visible on mouseover.<br>Starting with the first dimension, each of category is connected to the categories in the next dimension, showing how that category is subdivided. This subdividing is repeated recursively, producing a tree of 'ribbons'.<br>Drag the dimensions and categories to reorder them. You can also click the 'alpha' or 'size' links that appear next to the dimension name on mouseover, to order the categories by name or frequency. Exclude a dimension with the drop down menu. Code by Jason Davies</p>"
        
        
        var parole = null
        switch (language) {
        case 'ita': parole = paroleIta; break;
        case 'eng': parole = paroleEng; break;
        default: parole =  paroleIta; break;
        }


        document.getElementById("flags").innerHTML = flags;
        document.getElementById("titolo").innerHTML = tema;
     //   document.getElementById("subtitolo").innerHTML = secondLine;
        document.getElementById("parole").innerHTML = parole;


         for (var i = 0; i < pulisciFormat; i++) 
        {
          var opt = document.createElement("option");
          document.getElementById("listFormat").options.remove(opt);
        }



var chart = d3.parsets()
    .dimensions(dimensioni); 

var vis = d3.select("#vis").append("svg")
    .attr("width", chart.width())
    .attr("height", chart.height());

var partition = d3.layout.partition()
    .sort(null)
    .size([chart.width(), chart.height() * 5 / 4])
    .children(function(d) { return d.children ? d3.values(d.children) : null; })
    .value(function(d) { return d.count; });

var ice = false;

function curves() {
  var t = vis.transition().duration(500);
  if (ice) {
    t.delay(1000);
    icicle();
  }
  t.call(chart.tension(this.checked ? .5 : 1));
}

d3.csv("data/parallel_sets.csv", function(csv) {
  vis.datum(csv).call(chart);

  window.icicle = function() {
    var newIce = this.checked,
        tension = chart.tension();
    if (newIce === ice) return;
    if (ice = newIce) {
      var dimensions = [];
      vis.selectAll("g.dimension")
         .each(function(d) { dimensions.push(d); });
      dimensions.sort(function(a, b) { return a.y - b.y; });
      var root = d3.parsets.tree({children: {}}, csv, dimensions.map(function(d) { return d.name; }), function() { return 1; }),
          nodes = partition(root),
          nodesByPath = {};
      nodes.forEach(function(d) {
        var path = d.data.name,
            p = d;
        while ((p = p.parent) && p.data.name) {
          path = p.data.name + "\0" + path;
        }
        if (path) nodesByPath[path] = d;
      });
      var data = [];
      vis.on("mousedown.icicle", stopClick, true)
        .select(".ribbon").selectAll("path")
          .each(function(d) {
            var node = nodesByPath[d.path],
                s = d.source,
                t = d.target;
            s.node.x0 = t.node.x0 = 0;
            s.x0 = t.x0 = node.x;
            s.dx0 = s.dx;
            t.dx0 = t.dx;
            s.dx = t.dx = node.dx;
            data.push(d);
          });
      iceTransition(vis.selectAll("path"))
          .attr("d", function(d) {
            var s = d.source,
                t = d.target;
            return ribbonPath(s, t, tension);
          })
          .style("stroke-opacity", 1);
      iceTransition(vis.selectAll("text.icicle")
          .data(data)
        .enter().append("text")
          .attr("class", "icicle")
          .attr("text-anchor", "middle")
          .attr("dy", ".3em")
          .attr("transform", function(d) {
            return "translate(" + [d.source.x0 + d.source.dx / 2, d.source.dimension.y0 + d.target.dimension.y0 >> 1] + ")rotate(90)";
          })
          .text(function(d) { return d.source.dx > 15 ? d.node.name : null; })
          .style("opacity", 1e-6))
          .style("opacity", 1);
      iceTransition(vis.selectAll("g.dimension rect, g.category")
          .style("opacity", 1))
          .style("opacity", 1e-6)
          .each("end", function() { d3.select(this).attr("visibility", "hidden"); });
      iceTransition(vis.selectAll("text.dimension"))
          .attr("transform", "translate(0,-5)");
      vis.selectAll("tspan.sort").style("visibility", "hidden");
    } else {
      vis.on("mousedown.icicle", null)
        .select(".ribbon").selectAll("path")
          .each(function(d) {
            var s = d.source,
                t = d.target;
            s.node.x0 = s.node.x;
            s.x0 = s.x;
            s.dx = s.dx0;
            t.node.x0 = t.node.x;
            t.x0 = t.x;
            t.dx = t.dx0;
          });
      iceTransition(vis.selectAll("path"))
          .attr("d", function(d) {
            var s = d.source,
                t = d.target;
            return ribbonPath(s, t, tension);
          })
          .style("stroke-opacity", null);
      iceTransition(vis.selectAll("text.icicle"))
          .style("opacity", 1e-6).remove();
      iceTransition(vis.selectAll("g.dimension rect, g.category")
          .attr("visibility", null)
          .style("opacity", 1e-6))
          .style("opacity", 1);
      iceTransition(vis.selectAll("text.dimension"))
          .attr("transform", "translate(0,-25)");
      vis.selectAll("tspan.sort").style("visibility", null);
    }
  };
  d3.select("#icicle")
      .on("change", icicle)
      .each(icicle);
});

function iceTransition(g) {
  return g.transition().duration(1000);
}

function ribbonPath(s, t, tension) {
  var sx = s.node.x0 + s.x0,
      tx = t.node.x0 + t.x0,
      sy = s.dimension.y0,
      ty = t.dimension.y0;
  return (tension === 1 ? [
      "M", [sx, sy],
      "L", [tx, ty],
      "h", t.dx,
      "L", [sx + s.dx, sy],
      "Z"]
   : ["M", [sx, sy],
      "C", [sx, m0 = tension * sy + (1 - tension) * ty], " ",
           [tx, m1 = tension * ty + (1 - tension) * sy], " ", [tx, ty],
      "h", t.dx,
      "C", [tx + t.dx, m1], " ", [sx + s.dx, m0], " ", [sx + s.dx, sy],
      "Z"]).join("");
}

function stopClick() { d3.event.stopPropagation(); }

// Given a text function and width function, truncates the text if necessary to
// fit within the given width.
function truncateText(text, width) {
  return function(d, i) {
    var t = this.textContent = text(d, i),
        w = width(d, i);
    if (this.getComputedTextLength() < w) return t;
    this.textContent = "…" + t;
    var lo = 0,
        hi = t.length + 1,
        x;
    while (lo < hi) {
      var mid = lo + hi >> 1;
      if ((x = this.getSubStringLength(0, mid)) < w) lo = mid + 1;
      else hi = mid;
    }
    return lo > 1 ? t.substr(0, lo - 2) + "…" : "";
  };
}

d3.select("#file").on("change", function() {
  var file = this.files[0],
      reader = new FileReader;
  reader.onloadend = function() {
    var csv = d3.csv.parse(reader.result);
    vis.datum(csv).call(chart
        .value(csv[0].hasOwnProperty("Number") ? function(d) { return +d.Number; } : 1)
        .dimensions(function(d) { return d3.keys(d[0]).filter(function(d) { return d !== "Number"; }).sort(); }));
  };
  reader.readAsText(file);
});


 }

    window.onload = init

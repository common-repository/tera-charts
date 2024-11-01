 function makeChart () {
     

var margin = {top: 20, right: 120, bottom: 20, left: 120},
        width = 1600 - margin.right - margin.left,
        height = 800 - margin.top - margin.bottom;

var i = 0,
    duration = 750,
    root;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var database = "/wp-content/uploads/files/" + chart_userid + "/" + chart_filename;

var svg = d3.select("#chartbody").append("svg")
    .attr("id","svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    var width = 960,
                height = 500,
                twoPi = 2 * Math.PI,
                progress = 0,
                formatPercent = d3.format(".0%");
  
  var arc = d3.svg.arc()
                .startAngle(0)
                .innerRadius(180)
                .outerRadius(240);

var meter = svg.append("g")
                .attr("class", "progress-meter")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            meter.append("path")
                .attr("class", "background")
                .attr("d", arc.endAngle(twoPi));

            var foreground = meter.append("path")
                .attr("class", "foreground");

          var text = meter.append("text")
              .attr("text-anchor", "middle")
                .attr("dy", ".35em");

    d3.json(database, function(error, flare) 
    {
      root = flare;
      root.x0 = height / 2;
      root.y0 = 0;



    function collapse(d) 
    {
      if (d.children) 
    {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
    }

  root.children.forEach(collapse);
  update(root);
  })


    .on("progress", function() {
                  var i = d3.interpolate(progress, d3.event.loaded /d3.event.total);
                  d3.transition().tween("progress", function() {
                   return function(t) {
                     progress = i(t);
                     foreground.attr("d", arc.endAngle(twoPi * progress));
                     text.text(formatPercent(progress))
                     meter.transition().delay(250).duration(250).attr("transform", "scale(0)").remove();
                                    };
                                    });
                              });      
      ;


d3.select(self.frameElement).style("height", "800px");

function update(source) 
  {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);

  var rScale = d3.scale.log()
      .domain([100,total_value])
      .range([0.1, 11]);

 var colorScaleGood = d3.scale.linear()
          .domain([0,0.3])
        .range(["#98fb98","#228B22"])
               .clamp(true);
          var colorScaleBad = d3.scale.linear()
          .domain([-0.3,0])
        .range(["#ffb6c1","#8B0000"])
               .clamp(true);

  nodeEnter.append("circle")
      .attr("r", 1e-7)

  if(format == "€")
      {
          nodeEnter.append("text")
          .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
          .text(function(d) { return d.name + ": " + accounting.formatMoney(d.value, "€", 0, ".", ","); })
          .style("fill","Blue")
          .style("fill", "black")
          .style("fill-opacity", 1e-6);
      }
  else
      {
         nodeEnter.append("text")
          .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
          .text(function(d) { return d.name + ": " + accounting.formatMoney(d.value/total_value*100, "%", 2, ".", ","); })
          .style("fill","Blue")
          .style("fill", "black")
          .style("fill-opacity", 1e-6);
      };


  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", function(d) {return rScale(d.value);})
     // .attr("r", 4.5)
       .style("fill", function(d) {if (d.value-d.previous > 0)
                      {return colorScaleGood((d.value-d.previous)/d.value);}
                      else 
                        { return colorScaleBad((d.value-d.previous)/d.value);}
                        })

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
  }

// Toggle children on click.
    function click(d) {
        if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
      }

}

    window.onload = init;



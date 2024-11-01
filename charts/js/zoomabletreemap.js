

// Detect for ie
var ie = ( function(){
    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');

    while ( div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0] );

    return v > 4 ? v : undef;

}());

var total_value = null;
var format = "EU";

function init() {

    // Alert users if they are using ie 8 or lower
    if (ie < 9) {
        alert("This site requires a modern web browser.  Please install Google Chrome, Mozilla Firefox, Apple Safari, or Internet Explorer 9 or higher.");
    }

    d3.select("svg").remove();

    var paroleEng = "<p><span style='color:#ff0000'> Red: decrease vs previous period. </span><span style='color:#006400'>Green: increase vs previous period.</span><br>The darker the color, the larger the change relative to the previous year. The larger the cells, the higher the revenues. Click on any cell to zoom, to go back click on the label on the top. </p>"

    document.getElementById("parole").innerHTML = paroleEng;

    var columns = columns_names.split(",");
    document.getElementById("camera").innerHTML = camera;
    document.getElementById("titolo").innerHTML = "";

    for( var column = 0; column < columns.length; column++)
    {
        document.getElementById("titolo").innerHTML += columns[column];
        if (column < columns.length - 1)
        {
            document.getElementById("titolo").innerHTML += " ";
        }
    }


    var margin = {top: 30, right: 0, bottom: 0, left: 0},
        width = 960,
        height = 550 - margin.top - margin.bottom,
        formatNumber = d3.format(",d"),
        transitioning;

    // We used to use this when using d3's standard color schemes
    //var color = d3.scale.category20();

    var database = "/wp-content/uploads/files/" + chart_userid + "/" + chart_filename;

    var x = d3.scale.linear()
        .domain([0, width])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([0, height])
        .range([0, height]);

    var treemap = d3.layout.treemap()
        .children(function(d, depth) { return depth ? null : d.children; })
        .sort(function(a, b) { return a.value - b.value; })
        .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
        .round(false);

    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .style("margin-left", -margin.left + "px")
        .style("margin.right", -margin.right + "px")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style("shape-rendering", "crispEdges");

    var grandparent = svg.append("g")
        .attr("class", "grandparent");

    grandparent.append("rect")
        .attr("y", -margin.top)
        .attr("width", width)
        .attr("height", margin.top);
    grandparent.append("text")
        .attr("fill", "#777")
        .style("letter-spacing", "+0.05em")
        .attr("x", 6)
        .attr("y",  margin.top - 60)
        .attr("dy", "0.5em");

    // Initialize tooltips
    $(document).ready(function () {
        $("[rel=tooltip]").tooltip();
    });

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

    d3.json(database, function(root) {

        initialize(root);
        accumulate(root);
        layout(root);
        display(root);

        function initialize(root) {
            root.x = root.y = 0;
            root.dx = width;
            root.dy = height;
            root.depth = 0;
        }

        // Aggregate the values for internal nodes. This is normally done by the
        // treemap layout, but not here because of our custom implementation.
        function accumulate(d) {
            return d.children
                ? d.value = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
                : d.value;
        }

        // Compute the treemap layout recursively such that each group of siblings
        // uses the same size (1x1) rather than the dimensions of the parent cell.
        // This optimizes the layout for the current zoom state. Note that a wrapper
        // object is created for the parent node for each group of siblings so that
        // the parent's dimensions are not discarded as we recurse. Since each group
        // of sibling was laid out in 1x1, we must rescale to fit using absolute
        // coordinates. This lets us use a viewport to zoom.
        function layout(d) {
            if (d.children) {
                treemap.nodes({children: d.children});
                d.children.forEach(function(c) {
                    c.x = d.x + c.x * d.dx;
                    c.y = d.y + c.y * d.dy;
                    c.dx *= d.dx;
                    c.dy *= d.dy;
                    c.parent = d;
                    layout(c);
                });
            }
        }

        function display(d) {

            if(format == "EU")
            {
                grandparent
                    .datum(d.parent)
                    .on("click", transition)
                    .select("text")
                    .attr("dy", "1.5em")
                    .text(name(d) + " : " + accounting.formatMoney(d.value,  "EU", 0, ".", ","));
            }
            else
            {
                grandparent
                    .datum(d.parent)
                    .on("click", transition)
                    .select("text")
                    .attr("dy", "1.5em")
                    .text(name(d) + " : " + accounting.formatMoney(d.value/total_value*100, "%", 2, ".", ","));


            }


            var g1 = svg.insert("g", ".grandparent")
                .datum(d)
                .attr("class", "depth");

            var g = g1.selectAll("g")
                .data(d.children)
                .enter().append("g");

            g.filter(function(d) { return d.children; })
                .classed("children", true)
                .on("click", transition);

            g.selectAll(".child")
                .data(function(d) { return d.children || [d]; })
                .enter().append("rect")
                .attr("class", "child")
                .call(rect);

            g.append("rect")
                .attr("class", "parent")
                .attr("data-placement", "top")
                .attr("title", "Tooltip test")
                .attr("rel", "tooltip")
                .call(rect)
                .append("title")
                .text(function(d) { return formatNumber(d.value); });

            g.append("text")
                .attr("dy", ".75em")
                .attr("fill", "#333")
                .text(function(d) {
                    var w = (d.dx  / d.parent.dx) * 960;
                    if (d.name.length*6.5 < ((d.dx / d.parent.dx) * 960) && ((d.dy / d.parent.dy) * 500) > 18 && (w > 100)) {
                        d.hiddendata = false;
                        return d.name;
                    }
                    else {
                        d.hiddendata = true;
                        return "";
                    }
                })
                .call(text);

            if(format == "EU")
            {
                g.append("text")
                    .attr("dy", "1.75em")
                    .attr("fill", "#333")
                    .text( function(d) {
                        if (accounting.formatMoney(d.value).length*6 > ((d.dx / d.parent.dx) * 960) || d.hiddendata) {
                            d.hiddendata = true;
                            return "";
                        }
                        else {
                            return accounting.formatMoney(d.value,"EU", 0, ".", ",");
                        }
                    })
                    .call(text);
            }
            else
            {
                g.append("text")
                    .attr("dy", "1.75em")
                    .attr("fill", "#333")
                    .text( function(d) {
                        if (accounting.formatMoney(d.value).length*6 > ((d.dx / d.parent.dx) * 960) || d.hiddendata) {
                            d.hiddendata = true;
                            return "";
                        }
                        else {
                            return accounting.formatMoney(d.value/totale*100, "%", 2, ".", ",");
                        }
                    })
                    .call(text);
            }






            function transition(d) {
                if (transitioning || !d) return;
                transitioning = true;

                var g2 = display(d),
                    t1 = g1.transition().duration(750),
                    t2 = g2.transition().duration(750);

                // Update the domain only after entering new elements.
                x.domain([d.x, d.x + d.dx]);
                y.domain([d.y, d.y + d.dy]);

                // Enable anti-aliasing during the transition.
                svg.style("shape-rendering", null);

                // Draw child nodes on top of parent nodes.
                svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

                // Fade-in entering text.
                g2.selectAll("text").style("fill-opacity", 0);

                // Transition to the new view.
                t1.selectAll("text").call(text).style("fill-opacity", 0);
                t2.selectAll("text").call(text).style("fill-opacity", 1);
                t1.selectAll("rect").call(rect);
                t2.selectAll("rect").call(rect);

                // Remove the old node when the transition is finished.
                t1.remove().each("end", function() {
                    svg.style("shape-rendering", "crispEdges");
                    transitioning = false;
                });
            }

            return g;
        }

        function text(text) {
            text.attr("x", function(d) { return x(d.x) + 6; })
                .style("font-size", function(d) {
                    var size = "12px";
                    d.namedisplay = d.name;
                    return size;
                })
                .attr("y", function(d) { return y(d.y) + 6; });
        }


        function rect(rect) {
            var colorScaleGood = d3.scale.linear()
                .domain([0,0.3])
                .range(["#98fb98","green"])
                .clamp(true);
            var colorScaleBad = d3.scale.linear()
                .domain([-0.3,0])
                .range(["#ffb6c1","red"])
                .clamp(true);




            rect.attr("x", function(d) { return x(d.x); })
                .attr("y", function(d) { return y(d.y); })
                .attr("width", function(d) { tempwidth = x(d.x + d.dx) - x(d.x); return tempwidth > 0 ? tempwidth : 0; })
                .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
                .style("fill", function(d) {if (d.value-d.previous > 0)
                {return colorScaleGood((d.value-d.previous)/d.value);}
                else
                { return colorScaleBad((d.value-d.previous)/d.value);}
                }
            );
        }

        function name(d) {
            return d.parent
                ?  name(d.parent) + " : " + d.name
                : " " + d.name;
        }
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
}

window.onload = init;
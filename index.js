$(document).ready(function() {
  // data variables
  var dataURL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
  var xColumn = "Seconds";
  var yColumn = "Place";
  var cColumn = "Doping";

  // display variables
  var margin = {
      top: 10,
      right: 40,
      bottom: 40,
      left: 50
    },
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
  var xLabel = "Seconds Behind Fastest Time"
  var yLabel = "Overall Ranking";
  var labelBlack = "Riders without doping allegations";
  var labelRed = "Riders accused of doping"

  // render data to svg box
  function render(d) {
    // tool tip
    var tip = d3.tip()
      .attr('class', 'tooltip-custom')
      .offset([-10, 0])
      .html(function(d) {
        if (d["Doping"]) {
          return "<div>" + d["Name"] + ", " + d["Nationality"] + "</div><div>Year: " + d["Year"] + "</span></div><div>Doping Allegation: " + d["Doping"] + "</span></div>";
        } else {
          return "<div>" + d["Name"] + ", " + d["Nationality"] + "</div><div>Year: " + d["Year"] + "</span></div><div>No Doping Allegations</span></div>";
        }
      })

    // Make scale
    var xScale = d3.scale.linear().range([0, width]).domain([d3.min(d, function(d) {
      return d[xColumn]
    }), d3.max(d, function(d) {
      return d[xColumn]
    })]);
    var yScale = d3.scale.linear().range([0, height]).domain([1, d3.max(d, function(d) {
      return d[yColumn]
    })]);

    // Make axes
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(10);
    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10);

    // Initilize the chart size
    var chart = d3.select(".chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add axes
    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    chart.append("g")
      .attr("class", "x axis")
      .append("text")
      .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.bottom - 1) + ")")
      .style("text-anchor", "middle")
      .text(xLabel);

    chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    chart.append("g")
      .attr("class", "y axis")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yLabel);

    // add tip
    chart.call(tip);

    // bind data
    var circles = chart.selectAll("circle")
      .data(d);

    // on enter
    circles.enter().append("circle")

    // on update
    circles
      .attr("class", "circle")
      .attr("cx", function(d) {return xScale(d[xColumn]);})
      .attr("cy", function(d) {return yScale(d[yColumn]);})
      .attr("r", 5)
      .attr("fill", function(d) {
        if (d[cColumn] == "") {
          return "black";
        }
          return "red";
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

    // add legend
    chart.append("circle")
      .attr("class", "circle")
      .attr("cx", function(d) {return xScale(9);})
      .attr("cy", function(d) {return yScale(30)-5;})
      .attr("r", 5)
      .attr("fill", "black");

    chart.append("text")
      .attr("x", function(d) {return xScale(12);})
      .attr("y", function(d) {return yScale(30);})
      .attr("text-anchor", "left")
      .attr("class", "legend")
      .text(labelBlack);

    //red circle
    chart.append("circle")
      .attr("class", "circle")
      .attr("cx", function(d) {return xScale(9);})
      .attr("cy", function(d) {return yScale(30) + 15;})
      .attr("r", 5)
      .attr("fill", "red");

    chart.append("text")
      .attr("x", function(d) {return xScale(12);})
      .attr("y", function(d) {return yScale(30) + 20;})
      .attr("text-anchor", "left")
      .attr("class", "legend")
      .text(labelRed);


  };

  // get and format data
  d3.json(dataURL, function(json) {
    var d = json;
    var min = d3.min(d, function(d) {
      return d[xColumn]
    })
    d.forEach(function(d) {
      d[xColumn] = d[xColumn] - min;
    })

    render(d);
  });

});

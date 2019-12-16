var data;


$(function () {

  $('select').change(function () {
    getResults()
  });
});


function getResults() {

  var parameters = {};

  //call blog endpoint
  $.get('/sensor', parameters, function (response) {


    console.log(response)
    //data = response;
    var filteredData = response;


    getSliderValue(response, filteredData);


    console.log(filteredData)

    data = filteredData.map(function (d) {
      return { sensortime: d3.timeParse("%Y-%m-%dT%H")(d.sensoryear + '-' + d.sensormonth + '-' + d.sensorday + 'T' + d.sensorhour), sensorvalue: d.averagevalue }
    })


    console.log(data)
    drawGraph()


  });
}

// put anything you would like to run on pageload inside here
function init() {
  getResults()

}

// call the init function to start
init()
// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 800 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;



function drawGraph() {

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("class", "graph-svg")
    .attr("width", '100%')
    .attr("height", '300px')
    // height + margin.top + margin.bottom
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


  // Add X axis --> it is a date format
  var x = d3.scaleTime()
    .domain(d3.extent(data, function (d) { return d.sensortime; }))
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));


  // Add Y axis
  var y = d3.scaleLinear()
    .domain([70, 90])
    // d3.max(data, function (d) { return +d.sensorvalue; })
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add the line
  svg.append("path")
    .datum(data)
    //   .filter(function(d) { return d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ')(d.sensortime) < new Date() })
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      //.x(function (d) { return x(d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ')(d.sensortime)) })
      .x(function (d) { return x(d.sensortime) })
      .y(function (d) { return y(d.sensorvalue) })
      .curve(d3.curveMonotoneX) // apply smoothing to the line

    )


}


var slider = document.getElementById("myRange");
var value;


// Update the current slider value (each time you drag the slider handle)
function getSliderValue(response, filteredData) {
  slider.oninput = function () {
    value = this.value
    var timeDisplay = this.value
    var ampm = 'am'

    if (value == 0) {
      timeDisplay = 12;
    }
    else if (value >= 12) {
      ampm = 'pm';
      timeDisplay = value - 12;
    }

    var time = document.querySelector('.time-display');

    time.innerHTML = `${timeDisplay} ${ampm}`;


    console.log(value)
    filteredData = response.filter(d => d.sensorhour == value)
    data = filteredData.map(function (d) {
      return { sensortime: d3.timeParse("%Y-%m-%dT%H")(d.sensoryear + '-' + d.sensormonth + '-' + d.sensorday + 'T' + d.sensorhour), sensorvalue: d.averagevalue }
    })
    var graphSVG = document.querySelector('.graph-svg');
    if (graphSVG) {
      graphSVG.parentNode.removeChild(graphSVG);
    }
    drawGraph()
  }
}

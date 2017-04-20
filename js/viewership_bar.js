// // set the dimensions and margins of the graph
// var margin = {top: 20, right: 20, bottom: 30, left: 40},
//     width = 500 - margin.left - margin.right,
//     height = 300 - margin.top - margin.bottom;
//
// // set the ranges
// var x = d3.scaleBand()
//           .range([0, width])
//           .padding(0.1);
// var y = d3.scaleLinear()
//           .range([height, 0]);
//
// // append the svg object to the body of the page
// // append a 'group' element to 'svg'
// // moves the 'group' element to the top left margin
// var svg = d3.select("#viewership_bar").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom + 100)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");
//
// // get the data
// d3.csv("../data/viewership_total.csv", function(error, data) {
//   if (error) throw error;
//
//   // format the data
//   data.forEach(function(d) {
//     d.views = +d.views;
//   });
//
//   // Scale the range of the data in the domains
//   x.domain(data.map(function(d) { return d.date; }));
//   y.domain([0, d3.max(data, function(d) { return d.views; })]);
//
//   // append the rectangles for the bar chart
//   svg.selectAll(".bar")
//       .data(data)
//     .enter().append("rect")
//       .attr("class", "bar")
//       .attr("x", function(d) { return x(d.date); })
//       .attr("width", x.bandwidth())
//       .attr("y", function(d) { return y(d.views); })
//       .attr("height", function(d) { return height - y(d.views); });
//
//   // add the x Axis
//   svg.append("g")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x))
//       .selectAll("text")
//       .style("text-anchor", "end")
//       .attr("dx", "-.8em")
//       .attr("dy", "-.55em")
//       .attr("transform", "rotate(-90)" );
//
//   // add the y Axis
//   svg.append("g")
//       .call(d3.axisLeft(y));
//
// });

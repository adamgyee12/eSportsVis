var w = 500,
	h = 500;

var colorscale = d3.scale.category10();

//Legend titles
var LegendOptions = ['Basketball','Football','Baseball','Golf'];

//Data
var d = [
		  [//basketball
      {axis:"Endurance",value:7.3},
			{axis:"Strength",value:6.2},
			{axis:"Power",value:6.5},
			{axis:"Speed",value:7.2},
			{axis:"Agility",value:8.1},
			{axis:"Flexibility",value:5.6},
			{axis:"Nerve",value:4.1},
			{axis:"Durability",value:7.7},
			{axis:"Hand-Eye Coord",value:7.5},
			{axis:"Analytic Aptitude",value:7.3}
		],[ //football
      {axis:"Endurance",value:5.3},
			{axis:"Strength",value:8.6},
			{axis:"Power",value:8.1},
			{axis:"Speed",value:7.1},
			{axis:"Agility",value:6.3},
			{axis:"Flexibility",value:4.3},
			{axis:"Nerve",value:7.2},
			{axis:"Durability",value:8.5},
			{axis:"Hand-Eye Coord",value:5.5},
			{axis:"Analytic Aptitude",value:7.1}
    ],[ //baseball
      {axis:"Endurance",value:4.6},
			{axis:"Strength",value:5.7},
			{axis:"Power",value:7.6},
			{axis:"Speed",value:6.5},
			{axis:"Agility",value:6.7},
			{axis:"Flexibility",value:4.7},
			{axis:"Nerve",value:5.1},
			{axis:"Durability",value:5.6},
			{axis:"Hand-Eye Coord",value:9.2},
			{axis:"Analytic Aptitude",value:6.2}
    ],[ //golf
      {axis:"Endurance",value:3.2},
			{axis:"Strength",value:3.8},
			{axis:"Power",value:6.1},
			{axis:"Speed",value:1.6},
			{axis:"Agility",value:1.7},
			{axis:"Flexibility",value:4},
			{axis:"Nerve",value:2.5},
			{axis:"Durability",value:2.3},
			{axis:"Hand-Eye Coord",value:6},
			{axis:"Analytic Aptitude",value:6.3}
    ]
		];

//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 10,
  levels: 10,
  ExtraWidthX: 300
}

var emptycfg = {
  w: w,
  h: h,
  radius:0,
  maxValue: 10,
  levels: 10,
  ExtraWidthX: 300
}

//Call function to draw the Radar chart
//Will expect that data is in %'s
console.log(d);
RadarChart.draw("#chart",
    [[//empty
      {axis:"Endurance",value:0.0},
			{axis:"Strength",value:0.0},
			{axis:"Power",value:0.0},
			{axis:"Speed",value:0.0},
			{axis:"Agility",value:0.0},
			{axis:"Flexibility",value:0.0},
			{axis:"Nerve",value:0.0},
			{axis:"Durability",value:0.0},
			{axis:"Hand-Eye Coord",value:0.0},
			{axis:"Analytic Aptitude",value:0.0}
		]], emptycfg);

////////////////////////////////////////////
////////////  User Input  //////////////////
////////////////////////////////////////////

// when the input range changes update value
d3.selectAll(".interactive").on("input", function() {
  update([this.value, this.id]);
});
// Initial update value
//update(5);
// adjust the text
var interactive_data =
[[
  {axis:"Endurance",value:5.0},
  {axis:"Strength",value:5.0},
  {axis:"Power",value:5.0},
  {axis:"Speed",value:5.0},
  {axis:"Agility",value:5.0},
  {axis:"Flexibility",value:5.0},
  {axis:"Nerve",value:5.0},
  {axis:"Durability",value:5.0},
  {axis:"Hand-Eye Coord",value:5.0},
  {axis:"Analytic Aptitude",value:5.0}
]];
RadarChart.draw("#chart", interactive_data, mycfg);

function update(metric) {
  // adjust the value
  //update metric based on user input
  console.log(metric);

  for (var i = 0; i < interactive_data[0].length; i++){
    if (interactive_data[0][i].axis == metric[1]){
      interactive_data[0][i].value = metric[0];
    }
  }

  RadarChart.draw("#chart", interactive_data, mycfg);
  /*.select("text")
    .attr("transform", "translate(300,150) rotate("+nValue+")");*/
}

d3.select("#submitBtn").on("click", function(){
  console.log(interactive_data);
  console.log(d.splice(d.length,0,interactive_data[0]));
  console.log(d);

  //Hide selectors

  //Show rest of data
  drawChartWithData();
});


function drawChartWithData(){
  RadarChart.draw("#chart", d, mycfg);
}

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

var svg = d3.select('#body')
	.selectAll('svg')
	.append('svg')
	.attr("width", w+300)
	.attr("height", h)

//Create the title for the legend
/*
var text = svg.append("text")
	.attr("class", "title")
	.attr('transform', 'translate(120,0)')
	.attr("x", w - 70)
	.attr("y", 10)
	.attr("font-size", "12px")
	.attr("fill", "#404040")
	.text("Degree of Sport Difficulty");

//Initiate Legend
var legend = svg.append("g")
	.attr("class", "legend")
	.attr("height", 100)
	.attr("width", 200)
	.attr('transform', 'translate(120,20)')
	;
	//Create colour squares
	legend.selectAll('rect')
	  .data(LegendOptions)
	  .enter()
	  .append("rect")
	  .attr("x", w - 65)
	  .attr("y", function(d, i){ return i * 20;})
	  .attr("width", 10)
	  .attr("height", 10)
	  .style("fill", function(d, i){ return colorscale(i);})
	  ;
	//Create text next to squares
	legend.selectAll('text')
	  .data(LegendOptions)
	  .enter()
	  .append("text")
	  .attr("x", w - 52)
	  .attr("y", function(d, i){ return i * 20 + 9;})
	  .attr("font-size", "11px")
	  .attr("fill", "#737373")
	  .text(function(d) { return d; })
	  ;
*/

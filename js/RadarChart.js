//Practically all this code comes from https://github.com/alangrafu/radar-chart-d3
//I only made some additions and aesthetic adjustments to make the chart look better
//(of course, that is only my point of view)
//Such as a better placement of the titles at each line end,
//adding numbers that reflect what each circular level stands for
//Not placing the last level and slight differences in color
//
//For a bit of extra information check the blog about it:
//http://nbremer.blogspot.nl/2013/09/making-d3-radar-chart-look-bit-better.html

var RadarChart = {
  draw: function(id, d, options){
  var cfg = {
	 radius: 2,
	 w: 600,
	 h: 600,
	 factor: 1,
	 factorLegend: .85,
	 levels: 3,
	 maxValue: 0,
	 radians: 2 * Math.PI,
	 opacityArea: 0.05,
	 ToRight: 5,
	 TranslateX: 30,
	 TranslateY: 30,
	 ExtraWidthX: 100,
	 ExtraWidthY: 100,
	 color: d3.scale.category10()
	};

	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){
		  cfg[i] = options[i];
		}
	  }
	}
	cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))}));
	var allAxis = (d[0].map(function(i, j){
      return i.axis;
    //console.log(i.axis); return i.axis;
  }));
  console.log(allAxis);
	var total = allAxis.length;
	var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
	var Format = d3.format('#');
	d3.select(id).select("svg").remove();

	var g = d3.select(id)
			.append("svg")
			.attr("width", cfg.w+cfg.ExtraWidthX)
			.attr("height", cfg.h+cfg.ExtraWidthY)
			.append("g")
			.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
			;

	var tooltip;
  var label;

	//Circular segments
	for(var j=0; j<cfg.levels-1; j++){
	  var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
	  g.selectAll(".levels")
	   .data(allAxis)
	   .enter()
	   .append("svg:line")
	   .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
	   .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
	   .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
	   .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
	   .attr("class", "line")
	   .style("stroke", "grey")
	   .style("stroke-opacity", "0.75")
	   .style("stroke-width", "0.3px")
	   .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
	}

	//Text indicating at what % each level is
	for(var j=0; j<cfg.levels; j++){
	  var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
	  g.selectAll(".levels")
	   .data([1]) //dummy data
	   .enter()
	   .append("svg:text")
	   .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
	   .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
	   .attr("class", "legend")
	   .style("font-family", "sans-serif")
	   .style("font-size", "10px")
	   .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
	   .attr("fill", "#737373")
	   .text(Format((j+1)*cfg.maxValue/cfg.levels));
	}

	series = 0;

	var axis = g.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");

	axis.append("line")
		.attr("x1", cfg.w/2)
		.attr("y1", cfg.h/2)
		.attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
		.attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
		.attr("class", "line")
		.style("stroke", "grey")
		.style("stroke-width", "1px");

	axis.append("text")
		.attr("class", "legend")
		.text(function(d){return d})
		.style("font-family", "sans-serif")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "1.5em")
		.attr("transform", function(d, i){return "translate(0, -10)"})
		.attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
		.attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});


	d.forEach(function(y, x){
	  dataValues = [];
	  g.selectAll(".nodes")
		.data(y, function(j, i){
		  dataValues.push([
			cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
			cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
		  ]);
		});
	  dataValues.push(dataValues[0]);
	  var poly = g.selectAll(".area")
					 .data([dataValues])
					 .enter()
					 .append("polygon")
					 .attr("class", "radar-chart-serie"+series)
					 .style("stroke-width", "0px")
					 .style("stroke", cfg.color(series))
					 .attr("points",function(d) {
						 var str="";
						 for(var pti=0;pti<d.length;pti++){
							 str=str+d[pti][0]+","+d[pti][1]+" ";
						 }
						 return str;
					  })
					 .style("fill", function(j, i){return cfg.color(series)})
					 .style("fill-opacity", 0)
					 .on('mouseover', function (d){
										z = "polygon."+d3.select(this).attr("class");
										g.selectAll("polygon")
										 .transition(200)
										 .style("fill-opacity", 0.1);
										g.selectAll(z)
										 .transition(200)
										 .style("fill-opacity", .7);
                     console.log(d);
                     label
           						.attr('x', 300)
           						.attr('y', 300)
           						.text(Format(d.value))
           						.transition(200)
           						.style('opacity', 1);
									  })
					 .on('mouseout', function(){
										g.selectAll("polygon")
										 .transition(200)
										 .style("fill-opacity", cfg.opacityArea);

                     label
           						.attr('x', 300)
           						.attr('y', 300)
           						.text(Format(d.value))
           						.transition(200)
           						.style('opacity', 0);
					 });
      //poly.merge(poly);

      poly.transition().duration(0).style('fill-opacity',cfg.opacityArea).style("stroke-width", "2px");
	  series++;
	});
	series=0;


	d.forEach(function(y, x){
	  var circles = g.selectAll(".nodes")
		.data(y).enter()
		.append("svg:circle")
		.attr("class", "radar-chart-serie"+series)
		.attr('r', cfg.radius)
		.attr("alt", function(j){return Math.max(j.value, 0)})
		.attr("cx", function(j, i){
		  dataValues.push([
			cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
			cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
		]);
		return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
		})
		.attr("cy", function(j, i){
		  return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
		})
		.attr("data-id", function(j){return j.axis})
		.style("fill", cfg.color(series)).style("fill-opacity", .9)
		.on('mouseover', function (d){
					newX =  parseFloat(d3.select(this).attr('cx')) - 10;
					newY =  parseFloat(d3.select(this).attr('cy')) - 5;

					tooltip
						.attr('x', newX)
						.attr('y', newY)
						.text(Format(d.value))
						.transition(200)
						.style('opacity', 1);

					z = "polygon."+d3.select(this).attr("class");
					g.selectAll("polygon")
						.transition(200)
						.style("fill-opacity", 0.1);
					g.selectAll(z)
						.transition(200)
						.style("fill-opacity", .7);
				  })
		.on('mouseout', function(){
					tooltip
						.transition(200)
						.style('opacity', 0);
					g.selectAll("polygon")
						.transition(200)
						.style("fill-opacity", cfg.opacityArea);
				  })
		.append("svg:title")
		.text(function(j){return Math.max(j.value, 0)});

//    circles.transition.duration(2000).

	  series++;
	});
	//Tooltip
	tooltip = g.append('text')
			   .style('opacity', 0)
			   .style('font-family', 'sans-serif')
			   .style('font-size', '13px');
  }
};


/* START OF SCRIPT */


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
  radius:2,
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
d3.selectAll(".plusBtn").on("click", function() {
  plus_update(this.id);
});

// when the input range changes update value
d3.selectAll(".minusBtn").on("click", function() {
  minus_update(this.id);
});
// Initial update value
//update(5);
// adjust the text
var interactive_data =
[
  [//basketball
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
  ],[ //football
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
  ],[ //golf
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
],[ //user's esports
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
  ]
];
RadarChart.draw("#chart", interactive_data, mycfg);

function plus_update(metric) {
  // adjust the value
  //update metric based on user input

  for (var i = 0; i < interactive_data[3].length; i++){
    if (interactive_data[3][i].axis == metric){
      if (interactive_data[3][i].value >= 10) return;
      interactive_data[3][i].value++;
    }
  }

  RadarChart.draw("#chart", interactive_data, mycfg);
  /*.select("text")
    .attr("transform", "translate(300,150) rotate("+nValue+")");*/
}

function minus_update(metric) {
  // adjust the value
  //update metric based on user input

  for (var i = 0; i < interactive_data[3].length; i++){
    if (interactive_data[3][i].axis == metric){
      if (interactive_data[3][i].value <= 0) return;
      interactive_data[3][i].value--;
    }
  }

  RadarChart.draw("#chart", interactive_data, mycfg);
  /*.select("text")
    .attr("transform", "translate(300,150) rotate("+nValue+")");*/
}

d3.select("#toggleBasketball").on("click", function(){

  if (interactive_data[0][0].value > 0){
    //toggle off
    for (var j = 0; j < interactive_data[0].length; j++){
      interactive_data[0][j].value = 0;
    }
  } else {
    //toggle on
      for (var j = 0; j < interactive_data[0].length; j++){
        interactive_data[0][j].value = d[0][j].value;
      }
  }
  //Show rest of data
  drawChartWithData();
});

d3.select("#toggleFootball").on("click", function(){

  if (interactive_data[1][0].value > 0){
    //toggle off
    for (var j = 0; j < interactive_data[1].length; j++){
      interactive_data[1][j].value = 0;
    }
  } else {
    //toggle on
      for (var j = 0; j < interactive_data[1].length; j++){
        interactive_data[1][j].value = d[1][j].value;
      }
  }
  //Show rest of data
  drawChartWithData();
});

d3.select("#toggleGolf").on("click", function(){

  if (interactive_data[2][0].value > 0){
    //toggle off
    for (var j = 0; j < interactive_data[2].length; j++){
      interactive_data[2][j].value = 0;
    }
  } else {
    //toggle on
      for (var j = 0; j < interactive_data[2].length; j++){
        interactive_data[2][j].value = d[2][j].value;
      }
  }
  //Show rest of data
  drawChartWithData();
});


function drawChartWithData(){
  RadarChart.draw("#chart", interactive_data, mycfg);
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

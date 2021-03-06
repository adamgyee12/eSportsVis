//////////////////////////////////////
//////////// PIE CHART ///////////////
//////////////////////////////////////

function updatePieChart(date_filename){
  //d3.select("#viewership_pie").select("g").remove();
  var svg = d3.select("#viewership_pie"),
      width = +svg.attr("width"),
      height = +svg.attr("height"),
      radius = Math.min(width, height) / 2,
      g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.hours; });

  var path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

  var label = d3.arc()
      .outerRadius(radius - 140)
      .innerRadius(radius - 40);

  d3.csv("data/" + date_filename + "_hours.csv", function(d) {
    d.hours = +d.hours;
    return d;
  }, function(error, data) {
    if (error) throw error;

    //g.selectAll(".arc").remove();
    var arc = g.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
        .attr("class", "arc");

    //arc.select("path").remove();
    arc.append("path")
        .attr("d", path)
        .attr("fill", function(d) { return color(d.data.game); })
        .on("mouseenter", function(d,i){
          console.log(d);
          d3.select(this).transition(300).style("opacity",.7);
          updateBarChart(d.data.game);
          show_info(d.data);
        })
        .on("mouseout", function(d,i){
          d3.select(this).transition(300).style("opacity",1);
          updateBarChart("total");
          hide_info();
        });

    arc.append("text")
        .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
        .attr("dy", "0.35em")
        .attr('fill', '#fafafa')
        .text(function(d) { return d.data.game; });

    //arc.merge(arc);
  });
}

updatePieChart("past_18months");

//////////////////////////////////////
//////////// BAR CHART ///////////////
//////////////////////////////////////

function updateBarChart(game){
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 500 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var offset = 30;

  // set the ranges
  var x = d3.scaleBand()
            .range([offset, width+50])
            .paddingInner(0.2);
  var y = d3.scaleLinear()
            .range([height, offset]).nice();

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("#viewership_bar").select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + 100);/*
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");*/

  // get the data
  var file;
  switch (game){
    case "init":
      file = "data/viewership_init.csv";
      break;
    case "total":
      file = "data/viewership_total.csv";
      break;
    case "League of Legends":
      file = "data/viewership_lol.csv";
      break;
    case "Counter-Strike: GO":
      file = "data/viewership_csgo.csv";
      break;
    case "DOTA 2":
      file = "data/viewership_dota2.csv";
      break;
    case "Hearthstone":
      file = "data/viewership_hearthstone.csv";
      break;
    case "Other Games":
      file = "data/viewership_other.csv";
      break;
  }

  d3.csv(file, function(error, data) {
  if (error) throw error;
    // format the data
    data.forEach(function(d) {
      d.views = +d.views;
    });

    // Scale the range of the data in the domains

    x.domain(data.map(function(d) { return d.date; }));
    y.domain([0, 300]);

    // Draw the total, have it stay (use different class)
    var total_bars = svg.selectAll(".bar")
        .data(data);
      total_bars.enter().append("rect")
        .attr("class", "stay-bar")
        .attr("x", function(d) { return x(d.date); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return height; })
        .attr("height", function(d) { 0; })
        .merge(total_bars)
        .transition().duration(500).delay(function(d, i) { return i*10; })
        .attr("y", function(d) { return y(d.views); })
        .attr("height", function(d) { return height - y(d.views); })

    // append the rectangles for the bar chart
    var bars = svg.selectAll(".bar")
        .data(data);
      bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.date); })
        .on("mouseenter", function(d,i){
          console.log(d);
          //updatePieChart(d.date)
          d3.select("#time_range").text(d.date);
          d3.select("#view_amount").text(d.views + " Million");
        })
        .on("mouseout", function(d,i){
          hide_info();
        })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return height; })
        .attr("height", function(d) { 0; })
        .merge(bars)
        .transition().duration(500).delay(function(d, i) { return i*10; })
        .attr("height", function(d) { return height - y(d.views); })
        .attr("x", function(d) { return x(d.date); })
        .attr("fill", function(){
          switch (game){
            case "total":
              return "#BEBEBE";
              break;
            case "League of Legends":
              return "#a05d56";
              break;
            case "Counter-Strike: GO":
              return "#6b486b";
              break;
            case "DOTA 2":
              return "#7b6888";
              break;
            case "Hearthstone":
              return "#8a89a6";
              break;
            case "Other Games":
              return "#98abc5";
              break;
          }

          //"#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c","#ff8c00"
        })
        .attr("y", function(d) { return y(d.views); })
        .attr("height", function(d) { return height - y(d.views); });

    // add the x Axis
    svg.select("#xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

    // add the y Axis
    svg.select("#yAxis")
      .attr("transform","translate(" + offset + ",0)")
      .call(d3.axisLeft(y));

  });
}

function hide_info(){
  d3.select("#time_range").text("the past 18 months");
  d3.select("#view_amount").text("4 Billion");
  d3.select("#view_game").text("eSports");
}

function show_info(gameObject){
  d3.select("#view_amount").text(gameObject.hours + " Million");
  d3.select("#view_game").text(gameObject.game);
  /*
  d3.select("#viewership_panel").selectAll("p").remove();
  d3.select("#image_panel").selectAll("img").remove();
  d3.select("#viewership_panel").append("p").text(gameObject.game + " was watched for " +
    gameObject.hours + " Million hours").classed("lead",true);

  d3.select("#image_panel").append("img").attr("src", function(){
    switch (gameObject.game){
      case "League of Legends":
        return "../images/lol_logo.png";
        break;
      case "Counter-Strike: GO":
        return "../images/csgo_logo.png";
        break;
      case "DOTA 2":
        return "../images/dota2_logo.png";
        break;
      case "Hearthstone":
        return "../images/hearthstone_logo.png";
        break;
    }
  }).style("max-width", "100%")
  .style("max-height", "100%");
  */

}

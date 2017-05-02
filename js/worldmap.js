d3.json("data/world.json", function (error, world) {
    if (error) throw error;
    drawMap(world);
});

function drawMap(world) {

    ///var projection = d3.geoEquirectangular().scale(150).translate([400, 350]);

    var width = 1200;
    var height = 200;

    var svg = d3.select("#mapsvg");

    var circles = svg.select("#circles");
    var map = svg.select("#map");

    var projection = d3.geoMercator()
      //.scale(width / 2 / Math.PI)
      .scale(230)
      .translate([600,350])

    var path = d3.geoPath()
      .projection(projection);

    var url = "https://enjalot.github.io/wwsd/data/world/world-110m.geojson";
    d3.json(url, function(err, geojson) {
      svg.append("path")
        .classed("countries",true)
        .attr("d", path(geojson))

    })

    var scalefactor=1./50. ;

    setTimeout(function() {
      d3.csv("data/tournaments.csv", function(csv) {
        svg.append("g").attr("class","bubble")
        .selectAll("circle")
            .data(csv)
          .enter()
          .append("circle")
            .classed("circle",true)
            .attr("cx", function(d, i) { console.log(projection([+d["longitude"],+d["latitude"]])[0]); return projection([+d["longitude"],+d["latitude"]])[0]; })
            .attr("cy", function(d, i) { return projection([+d["longitude"],+d["latitude"]])[1]; })
            .attr("r", 0)
            .on("mouseover", function(d) {
                d3.select(this).style("fill","steelblue");
                console.log(d.event);
                d3.select("#event").text(d.event);
                d3.select("#views").text(d.views);
                d3.select("#year").text(d.year);

                //d3.select("#image_panel").selectAll("img").remove();
                d3.select("#image")
                  .attr("src", function(){
                    return "images/" + d.event + ".jpg";
                });


              })
            .on("mouseout", function(d) {
                d3.select(this).style("fill","black");
              })
            .transition().duration(3000)
            .attr("r",  function(d) { return 550 * scalefactor; }) // return (+d["views"])*scalefactor; })
            .attr("title",  function(d) { return d["event"]+": "+Math.round(d["views"]); })
            ;

      });
    }, 500);


    // function redraw(year) {
    //   circles.selectAll("circle")
   // 	 .transition().duration(1000)
    //           .attr("r",  function(d) { return (+d[year])*scalefactor; })
    //           .attr("title",  function(d) { return d["country"]+": "+Math.round(d[year]); });
    //
    // }
    // redraw(2000);
    // redraw(2001);


}

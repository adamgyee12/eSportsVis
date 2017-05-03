var axisSpace = 50;
var axisSpaceBottom = 200;
var axisTopPadding = 10;
var sumailWidth = 800;
var sumailHeight = 500;
var sumailBarWidth = sumailWidth - axisSpace;
var sumailBarHeight = sumailHeight - axisSpaceBottom;

var sumailDiv = d3.select('#sumail');

var sumailSVG = sumailDiv.select('#sumail-svg')
sumailSVG.attr('height', sumailHeight)
  .attr('width', sumailWidth);

// X scale
var sumailTournamentScale = d3.scaleBand()
    .paddingInner(.1)
    .rangeRound([0, sumailBarWidth]);

// Y scale
var sumailDollarScale = d3.scaleLinear()
    .domain([80000, 0])
    .rangeRound([0, sumailBarHeight]);

// Z sale
var sumailPlaceScale = d3.scaleOrdinal()
    .domain(['1st', '2nd', '3rd', '4th', 'Other'])
    .range(["#FFD739", "#BEBEBE", "#BB8644", "#F8996B", "#98abc5"]);

function processSumail(d, i, columns) {
  for (var key in d) {
    if (key == 'prize') {
      var numberPattern = /\d+/g;
      d[key] = parseFloat(d[key].match(numberPattern).join([])) / 5;
    }

    if (key == 'place') {
      if (d[key] != '1st' && d[key] != '2nd' && d[key] != '3rd' && d[key] != '4th') {
        d[key] = 'Other';
      }
    }
  }
  return d;
};

function successSumail(error, data) {
  var top3 = data.filter(function(d) {
      return d['prize'] > 100000;
    }).sort(function(d1, d2) {
      return d1['prize'] < d2['prize'];
    });

  data = data.filter(function(d) {
    return d['prize'] < 100000 && d['prize'] > 1000;
  }).sort(function(d1, d2) {
    return new Date(d1['date']) - new Date(d2['date']);
  });
  var tournaments = [];
  for (x = 0; x < data.length; x++) {
    tournaments.push(data[x]['tournament'])
  }

  sumailTournamentScale.domain(tournaments);

  sumailSVG.select('#yAxis')
    .attr('transform', 'translate(' + axisSpace + ', ' + axisTopPadding + ')')
    .call(d3.axisLeft(sumailDollarScale)
        .ticks(10)
        .tickFormat(d3.format(',')))

  sumailSVG.select('#xAxis')
    .attr('transform', 'rotate(-90) translate(' + (-axisTopPadding -sumailBarHeight - 1) + ', ' + axisSpace + ')')
    .call(d3.axisLeft(sumailTournamentScale))
      .selectAll(".tick text")
      .attr('alignment-baseline', 'middle')
      .attr('transform', 'translate(-10, 0)')
      .call(wrap, 150);

  sumailSVG.select('#bars')
    .attr('transform', 'translate(' + axisSpace + ', ' + axisTopPadding + ')')
    .selectAll('rect')
    .data(data)
    .enter().append('rect')
      .on('mouseover', function(d) {
        d3.select(this).attr('fill-opacity', '.50');
        sumailSVG.select('#' + 'tournament-' + d['date'])
          .attr('fill-opacity', '1');
      })
      .on('mouseout', function(d) {
        d3.select(this).attr('fill-opacity', '1');
        sumailSVG.select('#' + 'tournament-' + d['date'])
          .attr('fill-opacity', '0');
      })
      .attr('x', function(d) {
        return sumailTournamentScale(d['tournament']);
      })
      .attr('width', sumailTournamentScale.bandwidth())
      .attr("y", sumailBarHeight)
      .attr("height", 0)
      .attr('fill',  function(d) {
        return sumailPlaceScale(d['place']);
      });

    sumailSVG.select('#bars')
      .selectAll('text')
      .data(data)
      .enter().append('text')
        .attr('fill-opacity', '0')
        .attr('id', function(d) {
          return 'tournament-' + d['date'];
        })
        .attr('alignment-baseline', 'middle')
        .attr('transform', function(d) {
          return 'rotate(-90) translate(' + (5 - Math.min(sumailDollarScale(d['prize']), sumailBarHeight - 5)) + ',' + (sumailTournamentScale(d['tournament']) + (sumailTournamentScale.bandwidth()/2)) + ' )';
        })
        .text(function(d) {
          return '$' + d3.format(",")(d['prize']);
        });

    var legend = d3.legendColor()
      .scale(sumailPlaceScale);

    sumailSVG.select("#legend")
      .attr('transform', 'translate('+ (axisSpace + 20) +', ' + axisTopPadding + ')')
      .call(legend);

    for (x = 0; x < 3; x++) {
        sumailDiv.select('#dollars-value-' + (x + 1))
          .text(d3.format(",")(top3[x]['prize']))
        sumailDiv.select('#tournament-' + (x + 1))
          .text(top3[x]['place'] + ' place – ' + top3[x]['tournament']);
    }
}

d3.csv("data/sumail-earnings.csv", processSumail, successSumail);

function animateSumailChart() {
  sumailSVG.select('#bars')
    .selectAll("rect")
    .attr("y", sumailBarHeight)
    .attr("height", 0)
    .transition()
    .duration(500)
    .delay(function(d, i) { return i*20; })
    .attr('y', function(d) {
      return Math.min(sumailDollarScale(d['prize']), sumailBarHeight - 5);
    })
    .attr('height', function (d) {
      return Math.max(sumailBarHeight - sumailDollarScale(d['prize']), 5);
    });
}

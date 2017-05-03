var KEY_GAME = 'game';
var KEY_PLAYERS = 'players';
var KEY_PRIZE = 'prize';
var KEY_TOURNAMENTS = 'tournaments';
var KEY_TOURNAMENT_COUNT = 'tournamentCount';
var KEY_PLAYER_COUNT = 'playerCount';

var games = [];
var top5Games = [];

var topGamesSVG = d3.select('#top-games-svg');
var topGamesAxisSpace = 80;
var topGamesAxisTopPadding = 10;
var topGamesWidth = 700;
var topGamesHeight = 400;
var barWidth = topGamesWidth - topGamesAxisSpace;
var barHeight = topGamesHeight - topGamesAxisSpace;

var topGamesDiv = d3.select('#top-games');
var topGamesLeft = topGamesDiv.select('#top-games-left');
var topGamesRight = topGamesDiv.select('#top-games-right');

topGamesSVG.attr('width', topGamesWidth)
  .attr('height', topGamesHeight);

// Inner x scale (years grouped by game)
var yearScale = d3.scaleBand()
    .domain([2010, 2011, 2012, 2013, 2014, 2015, 2016])
    .paddingInner(0.1)

// Outer x scale (games)
var gamesScale = d3.scaleBand()
    .rangeRound([0, barWidth])
    .paddingInner(0.2);

// Y scale
var dollarScale = d3.scaleLinear()
    .rangeRound([0, barHeight]);

// Z sale
var yearColorScale = d3.scaleOrdinal()
    .domain([2010, 2011, 2012, 2013, 2014, 2015, 2016])
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

function print(d, i, columns) {
  for (var key in d) {
    if (key == 'game') {
      continue;
    }
    var numberPattern = /\d+/g;
    d[key] = parseFloat(d[key].match(numberPattern).join([]));
  }
  // console.log(d);
  return d;
};

function success(error, data) {
  if (error) throw error;

  for (var x = 0; x < data.length; x++) {
    var row = data[x];
    var name = row[KEY_GAME];
    var game;

    if (games[name] == null) {
      game = {};
      game[KEY_GAME] = name;
      game[KEY_PRIZE] = 0;
      game[KEY_TOURNAMENT_COUNT] = 0;
      game[KEY_PLAYER_COUNT] = 0;
    } else {
      game = games[name];
    }
    game[KEY_PRIZE] += row[KEY_PRIZE];
    game[KEY_TOURNAMENT_COUNT] += row[KEY_TOURNAMENTS];
    game[KEY_PLAYER_COUNT] = row[KEY_PLAYERS];

    games[name] = game;
    games[name][year] = row;
  }

  if (parsingIndex + 1 < topGameFiles.length) {
    parsingIndex++;
    year++;
    d3.csv(topGameFiles[parsingIndex], print, success);
    console.log("Parsing: " + topGameFiles[parsingIndex]);
  } else {
    filterTop5Games();
    drawGraph();
  }
};

function filterTop5Games() {
  for (var key in games) {
    game = games[key];

    for (var x = 0; x < 5; x++) {
      // insert
      if (top5Games[x] == null) {
        top5Games[x] = game;
        break;
      } else if (top5Games[x][KEY_PRIZE] < game[KEY_PRIZE]){
        // swap
        for (; x < 5; x++) {
          temp = top5Games[x];
          top5Games[x] = game;
          game = temp;
        }
        break;
      }
    }
  }

  // console.log('ALL GAMES');
  // console.log(games);
  // console.log('TOP 5 GAMES');
  // console.log(top5Games);
}

function drawGraph() {
  // dollarScale.domain(d3.extent(top5Games, function(d) {return d[KEY_PRIZE];}));
  dollarScale.domain([4000000000, 100000]);

  var gameNames = [];

  for (x = 0; x < top5Games.length; x++) {
    gameNames.push(top5Games[top5Games.length - x - 1][KEY_GAME]);
  }

  gamesScale.domain(gameNames);
  yearScale.rangeRound([0, gamesScale.bandwidth()]);

  var d = top5Games[0]['2016'];
  d['year'] = 2016;
  topGamesRight.select('#game-name')
    .text(d[KEY_GAME]);

  topGamesRight.select('#tournaments-value')
    .text(d[KEY_TOURNAMENTS]);

  topGamesRight.select('#players-value')
    .text(d[KEY_PLAYERS]);

  topGamesRight.select('#year')
    .text(d['year']);

  topGamesRight.select('#dollars-value')
    .text(d3.format(",")(d[KEY_PRIZE]));

  d3.select('#top-games-bars')
      .attr('transform', 'translate(' + topGamesAxisSpace + ', ' + topGamesAxisTopPadding + ')')
    .selectAll("g")
    .data(top5Games)
    .enter().append("g")
      .attr("transform", function(d){
        return 'translate(' + gamesScale(d[KEY_GAME]) + ', 0)';
      })
    .selectAll("rect")
    .data(function(d) {
      var years = [];

      for (x = 2010; x < 2017; x++) {
        year = d[x];
        if (year == undefined) {
          year = {
            'game' : d[KEY_GAME],
            'prize' : 0
          };
        }
        year.year = x;
        years.push(year);
      }
      return years;
    })
    .enter().append("rect")
      .on('mouseover', function(d) {
        topGamesRight.select('#game-name')
          .text(d[KEY_GAME]);

        topGamesRight.select('#tournaments-value')
          .text(d[KEY_TOURNAMENTS]);

        topGamesRight.select('#players-value')
          .text(d[KEY_PLAYERS]);

        topGamesRight.select('#year')
          .text(d['year']);

        topGamesRight.select('#dollars-value')
          .text(d3.format(",")(d[KEY_PRIZE]));

        d3.select(this).attr('fill-opacity', '.50');
      }).on('mouseout',  function(d) {
        d3.select(this).attr('fill-opacity', '1');
      })
      .attr("x", function(d) {
        return yearScale(d['year']);
      })
      .attr("width", function(d) {
        return yearScale.bandwidth();
      })
      .attr("fill", function(d) {
        return yearColorScale(d['year']);
      })
      .attr("y", barHeight)
      .attr("height", 0);

  topGamesSVG.select('#yAxis')
    .attr('transform', 'translate(' + topGamesAxisSpace + ', ' + topGamesAxisTopPadding + ')')
    .call(d3.axisLeft(dollarScale)
        .ticks(10)
        .tickFormat(d3.format(',')));

  topGamesSVG.select('#xAxis')
    .attr('transform', 'translate(' + topGamesAxisSpace + ', ' + (topGamesAxisTopPadding + barHeight) + ')')
    .call(d3.axisBottom(gamesScale))
      .selectAll(".tick text")
      .call(wrap, gamesScale.bandwidth());

  var legend = d3.legendColor()
  .orient('horizontal')
  .shapeWidth(50)
  .shapePadding(0)
  .scale(yearColorScale);

  topGamesSVG.select("#top-games-legend")
    .attr('transform', 'translate('+ (barWidth - (50 * 7)) +', 0)')
    .call(legend);
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function animateTopGamesChart() {
  d3.select('#top-games-bars')
    .selectAll("rect")
    .attr("y", barHeight)
    .attr("height", 0)
    .transition()
    .duration(500)
    .delay(function(d, i) { return (i%7)*50; })
    .attr("y", function(d) {
      return Math.min(dollarScale(d[KEY_PRIZE]), topGamesHeight - 1);
    })
    .attr("height", function(d) {
      return Math.max(barHeight - dollarScale(d[KEY_PRIZE]), 1);
    });
}

var topGameFiles = ["data/2010-top-games.csv", "data/2011-top-games.csv", "data/2012-top-games.csv", "data/2013-top-games.csv", "data/2014-top-games.csv", "data/2015-top-games.csv", "data/2016-top-games.csv"];
var parsingIndex = 0;
var year = 2010;

d3.csv(topGameFiles[0], print, success);

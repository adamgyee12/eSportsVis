var KEY_GAME = 'game';
var KEY_PLAYERS = 'players';
var KEY_PRIZE = 'prize';
var KEY_TOURNAMENTS = 'tournaments';
var KEY_TOURNAMENT_COUNT = 'tournamentCount';
var KEY_PLAYER_COUNT = 'playerCount';

var games = [];
var top5Games = [];

var svgHeight = 600;
var svgWidth = 800;

var svg = d3.select('#top-games');
var width = 600;
var height = 400;

svg.attr('width', width)
  .attr('height', height);

// Inner x scale (years grouped by game)
var yearScale = d3.scaleBand()
    .domain([2010, 2011, 2012, 2013, 2014, 2015, 2016])
    .paddingInner(0.1)

// Outer x scale (games)
var gamesScale = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05);

// Y scale
var dollarScale = d3.scaleLinear()
    .rangeRound([0, height]);

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
  var minDollars = d3.min(top5Games, function(d) {
    return d[KEY_PRIZE];
  });
  var maxDollars = d3.max(top5Games, function(d) {
    return d[KEY_PRIZE];
  });
  console.log("Min: " + minDollars + " Max: " + maxDollars);
  dollarScale.domain([100000, 5000000000]);

  var gameNames = [];

  for (x = 0; x < top5Games.length; x++) {
    gameNames.push(top5Games[x][KEY_GAME]);
  }

  gamesScale.domain(gameNames);
  yearScale.rangeRound([0, gamesScale.bandwidth()]);

  d3.select('#top-games-bars')
    .selectAll("g")
    .data(top5Games)
    .enter().append("g")
      .attr("transform", function(d){
        return "translate(" + gamesScale(d[KEY_GAME]) + ",0)";
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
      .attr("x", function(d) {
        console.log('year scale');
        console.log(yearScale(d['year']));
        return yearScale(d['year']);
      })
      .attr("y", function(d) {
        return Math.min(height - dollarScale(d[KEY_PRIZE]), height - 1);
      })
      .attr("width", function(d) {
        return yearScale.bandwidth();
      })
      .attr("height", function(d) {
        return Math.max(dollarScale(d[KEY_PRIZE]), 1);
      })
      .attr("fill", function(d) {
        return yearColorScale(d['year']);
      });
}

var topGameFiles = ["data/2010-top-games.csv", "data/2011-top-games.csv", "data/2012-top-games.csv", "data/2013-top-games.csv", "data/2014-top-games.csv", "data/2015-top-games.csv", "data/2016-top-games.csv"];
var parsingIndex = 0;
var year = 2010;

d3.csv(topGameFiles[0], print, success);

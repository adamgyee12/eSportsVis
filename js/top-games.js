var KEY_GAME = 'game';
var KEY_PLAYERS = 'players';
var KEY_PRIZE = 'prize';
var KEY_TOURNAMENTS = 'tournaments';
var KEY_TOTAL_PRIZE = 'prize';
var KEY_TOTAL_TOURNAMENTS = 'totalTournaments';
var KEY_TOTAL_PLAYERS = 'totalPlayers';

var games = [];
var top5Games = [];

var svgHeight = 600;
var svgWidth = 600;

var svg = d3.select('#top-games')
  .attr('height',  svgHeight)
  .attr('width',  svgWidth);
var margin = {top: 20, right: 20, bottom: 20, left: 20};
var width = svg.attr('width') - margin.left - margin.right;
var height = svg.attr('height') - margin.top - margin.bottom;
var g = svg.append('g')
    .attr('id', 'graph')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var yearScale = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);

var dollarScale = d3.scaleLinear()
    .rangeRound([height, 0]);

var colorScale = d3.scaleOrdinal()
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
      game[KEY_TOURNAMENTS] = 0;
      game[KEY_PLAYERS] = 0;
    } else {
      game = games[name];
    }
    game[KEY_TOTAL_PRIZE] += row[KEY_PRIZE];
    game[KEY_TOTAL_TOURNAMENTS] += row[KEY_TOURNAMENTS];
    game[KEY_TOTAL_PLAYERS] += row[KEY_PLAYERS];

    games[name] = game;
    games[name][year] = row;
  }

  if (parsingIndex + 1 < topGameFiles.length) {
    parsingIndex++;
    year++;
    d3.csv(topGameFiles[parsingIndex], print, success);
  } else {
    filterTop5Games();
    drawGraph();
  }
};

function filterTop5Games() {
  for (var key in games) {
    // for each game
    game = games[key];

    // starting from the top 1 game with the largest prize pool,
    // check if its prize pool is bigger than any of the existing top 5 games
    for (var x = 0; x < 5; x++) {
      // if this slot hasn't been taken yet, just insert the game into the list
      if (top5Games[x] == null) {
        top5Games[x] = game;
        break;
      // else if this game has a bigger prizepool, insert this in append
      // push others in the list down one position
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

  console.log(games);
  console.log(top5Games);
}

function drawGraph() {
  yearScale.domain([2010, 2016]);

  var minDollars = d3.min(top5Games, function(d) {
    return d[KEY_PRIZE];
  });
  var maxDollars = d3.max(top5Games, function(d) {
    return d[KEY_PRIZE];
  });
  dollarScale.domain([minDollars, maxDollars]);


  var stack = d3.stack();

  topGamesGroup = d3.select("#top-games");
}

var topGameFiles = ["data/2010-top-games.csv", "data/2011-top-games.csv", "data/2012-top-games.csv", "data/2013-top-games.csv", "data/2014-top-games.csv", "data/2015-top-games.csv", "data/2016-top-games.csv"];
var parsingIndex = 0;
var year = 2010;

d3.csv(topGameFiles[0], print, success);

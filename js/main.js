var stories;
var MyEventHandler = {};
/*
d3.json("data/stories.json", function(error, data) {
  stories = data;

  // create a typewriter for each story
  stories.forEach(function(story) {
    story.typewriter = malarkey(document.querySelector("#" + story.id), {
      typeSpeed: 20,
      setter: function(elem, val) {
        // replace "\n" with line breaks
        val = val.replace(/\n/, "<br><br>");
        // have a cursor at the end of the string
        val = val.replace(/\|/, "") + "|";
        elem.innerHTML = val;
      }
    });
  });
});
*/
$(function() {
  $('#fullpage')
    .fullpage({

      navigation: true,
      menu: '#main-menu',

      afterLoad: function(anchorLink, index) {
        console.log(index);

        if (index === 2) {
          updateBarChart("total");
          //setTimeout(function() { updateBarChart("League of Legends"); }, 5000);
        }

        /*
        // start typewriting each story once you visit it
        if (index === 3) {
          typewrite(stories[0]);

          $('#party-woman')
            .fadeTo(1000, 1, function complete() {
              // slide her in from the left
              $('#party-woman')
                .animate({
                  left: 200
                }, 1000, function complete() {
                  $('#party-woman')
                    .prop('src', 'images/woman-red.png');

                });
            });
        }
        if (index === 5) {
          survivors.updateVisualization();

          $('#survivor-button')
            .show();
        }
        if (index !== 5) {
          // Erase the facts when the user leaves the section
        //   $("#fact")
        //     .text(" ");

          // Reset the vis to the first one
          survivors.isNextVis = 0;
        }*/
      },

      onLeave: function(index, nextIndex) {}
    });
});




//var campusMap = new CampusMap("campus-map");
//var barChart = new BarChart("police-reports-bars", MyEventHandler);
//var lineChart = new LineChart("police-reports");

//var rateReport = new RateReport("rate-report");

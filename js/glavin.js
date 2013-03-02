/* 
 * Glavin Wiechert
 * Feb 20, 2013
 */


// Global variables
var origHeight = 0;
$(document).ready(function() {
  $("#options-panel").hide();
  $("#options-toggle").on("click", function() {
    console.log("Toggle Options");
    var options = $("#options-panel");
    if (!options.hasClass("active"))
    { // Is currently hidden
      console.log("Show");
      // Show
      options.addClass("active");
      //var origHeight = options.height();
      options.height(0);
      options.show();
      options.animate({height: origHeight}, 1000);
    }
    else
    { // Is current showing
      console.log("Hide");
      // Hide
      options.removeClass("active");
      //var origHeight = options.height();
      options.animate({height: 0}, 1000,
              function() {
                options.hide();
                options.height(origHeight);
              });
      options.show();
    }
  });
  
    resizePage();
  
});

(function($, sr) {

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function(func, threshold, execAsap) {
    var timeout;

    return function debounced() {
      var obj = this, args = arguments;
      function delayed() {
        if (!execAsap)
          func.apply(obj, args);
        timeout = null;
      }
      ;

      if (timeout)
        clearTimeout(timeout);
      else if (execAsap)
        func.apply(obj, args);

      timeout = setTimeout(delayed, threshold || 100);
    };
  }
  // smartresize 
  jQuery.fn[sr] = function(fn) {
    return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
  };

})(jQuery, 'smartresize');


// usage:
$(window).smartresize(function() {
  // Resize the display thingy
  resizePage();
});




function displayFieldList() {
  // Use the global data set, dataSet

  /* Format:    
   <select id="x-axis-select">
   <option value="1" selected="selected">F1</option>
   <option value="2">F2</option>
   <option value="3">F3</option>
   <option value="4">F4</option>
   </select>
   */

  // Create the initial jQuery object
  /*
   var xAxisSelect = $('<ul />', { 'id':"x-axis-select", 'class':"axis-select" } );
   var yAxisSelect = $('<ul />', { 'id':"y-axis-select", 'class':"axis-select" } );
   */
  var xAxisSelect = $('<select />', {'id': "x-axis-select"});
  var yAxisSelect = $('<select />', {'id': "y-axis-select"});


  // Add list items
  for (var c = 0; c < dataSet.length; c++)
  {
    /*
     xAxisSelect.append( 
     $('<li />', {})
     .append( $('<input />', {'type':'radio', 'name':'x-axis' } )
     .attr(((c===0)?"checked":"not-checked"), ((c===0)?"checked":"")) )
     .append("F"+(c+1)) );
     yAxisSelect.append(
     $('<li />', {})
     .append( $('<input />', {'type':'radio', 'name':'y-axis' } ) 
     .attr(((c===1)?"checked":"not-checked"), ((c===1)?"checked":"")) )
     .append("F"+(c+1)) );
     */
    xAxisSelect.append(
            $('<option />', {'value': c})
            .append("F" + (c + 1))
            .attr(((c === 0) ? "selected" : "not-selected"), ((c === 0) ? "selected" : "")));
    yAxisSelect.append(
            $('<option />', {'value': c})
            .append("F" + (c + 1))
            .attr(((c === 1) ? "selected" : "not-selected"), ((c === 1) ? "selected" : "")));

  }

  // Replace original with new field list
  /*
   $("ul#x-axis-select").replaceWith(xAxisSelect);
   $("ul#y-axis-select").replaceWith(yAxisSelect);    
   */
  $("select#x-axis-select").replaceWith(xAxisSelect);
  $("select#y-axis-select").replaceWith(yAxisSelect);
  $("select#x-axis-select, select#y-axis-select").change(function() {
    updateScreen();
  });
}

/*
function testDisplayFieldList() {
  dataSet = [["F1"], ["F2"], ["F3"], ["F4"], ["F5"], ["F1"], ["F2"], ["F3"], ["F4"], ["F5"]];
  displayFieldList();
}
*/


/*
function createDataSet(colNum, rowNum) {
  var dataSet = new Array();

  for (var c = 0; c < colNum; c++)
  {
    var newColumn = new Array();
    for (var r = 0; r < rowNum; r++)
    {
      newColumn.push((Math.random() * 1000));
    }
    dataSet.push(newColumn);
  }
  return dataSet;
}
*/


function resizePage()
{
  // resize all of the elements in the page
  // occurs onload and resize

  console.log("Resize Page");
  origHeight = $("#options-panel").height();

  $('.graphContainer').css({
    height: (
            $(window).height()
            - 2 * parseInt($("body").css("margin-top"))
            - $("header").height()
            - 2 * parseInt($("header").css("padding-top"))
            - $("footer").height()
            - 2 * parseInt($("footer").css("padding-top"))
            - 2 * parseInt($("#dm-graph").css("margin-top"))
            - $("#options-toggle").height()
            - 2 * parseInt($("#options-toggle").css("padding-top"))
            - 2 * parseInt($("#options-toggle").css("margin-top"))
            - 10
            )});

  $("#options-panel").css({
    bottom: (
            $(window).height()
            - $("#options-toggle").position().top
//         + parseInt( $("#options-toggle").css("padding-top"))
            )});
  $("#options-panel").css({width: $("#options-toggle").width()});
  
  if ( !$.isEmptyObject(dataSet) )
  {
    var dat = selectData();
    $.plot($('#dm-graph'), [{data: dat, points: {show: true}, grid: {minBorderMargin: 10}}]);
    //  $("#dm-graph canvas").height( $("dm-graph").height());
  }
}

function displayStats(stats)
{
  var statsPanel = $("#dm-stats");
  var key = stats.key; // FIX ME
  var value = stats.value; // FIX ME
  statsPanel.find("#"+key).append(value);
}
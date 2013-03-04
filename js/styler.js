/* 
 * Glavin Wiechert
 * Feb 20, 2013
 */


// Global variables
$(document).ready(function() {
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

  //=== Resize height
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
  
  
  //=== Resize Width
  // 20% / 50% / 30%
  var maxWidth = $("table#dig-visTable").width() - parseInt($("td#dm-graph-box").css('padding-right')) - parseInt($("td#dm-file").css('padding-right'));
  //console.log(maxWidth);
  //console.log( $("td#dm-graph-box").width() );
  $("td#dm-file").css({ width: (maxWidth*0.20) });
  $("td#dm-graph-box, .graphContainer, canvas").css({ width: (maxWidth*0.50) });
  $("td#dm-stats-panel").width(maxWidth*0.30);
  //console.log( $("td#dm-graph-box").width() );
  
  if ( !$.isEmptyObject(dataSet) )
  {
     updateScreen();
    //var dat = selectData();
    //$.plot($('#dm-graph'), [{data: dat, points: {show: true}, grid: {minBorderMargin: 10}}]);
    //  $("#dm-graph canvas").height( $("dm-graph").height());
  
  }
  
}
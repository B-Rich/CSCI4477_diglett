/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

// Global variables
$(document).ready(function() {

  
  $("#options-panel input").click(function() {
    if (!$.isEmptyObject(dataSet))
      updateScreen();
  });
  
  
  // Options Panel
  $("#options-panel").hide(); // Default
  // Clicking inside of options panel
  $("#options-toggle").click( function(event) {
    toggleOptionsPanel();
    event.stopPropagation(); // Prevent click event form occuring in $(document) 
  });
  $("#options-panel").click( function(event) {
    event.stopPropagation(); // Prevent click event form occuring in $(document) 
  });
  // Click outside of options panel
  $(document).click( function() {
    console.log("Hide");
    // Hide
    var options = $("#options-panel");
    if (options.hasClass("active"))
    {
      options.removeClass("active");
      //var origHeight = options.height();
      options.stop();
      options.show();
      options.animate({height: 0}, 500,
              function() {
                options.hide();
                options.height(origHeight);
      });
      
    }
  });

});

function toggleOptionsPanel() {
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
    options.stop();
    options.animate({height: origHeight}, 1000);
  }
  else
  { // Is current showing
    console.log("Hide");
    // Hide
    options.removeClass("active");
    //var origHeight = options.height();
    options.stop();
    options.show();
    options.animate({height: 0}, 1000,
            function() {
              options.hide();
              options.height(origHeight);
            });
  }

}

/* 
 * Specify the column selected by the user
 */
function selectData() {
  console.log(arguments.callee.caller.name);

  var colX = $('#x-axis-select option:selected');
  var colY = $('#y-axis-select option:selected');
  var colZ = $('#z-axis-select option:selected');
  return formatData(colX.val(), colY.val(), colZ.val());
}

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
  var zAxisSelect = $('<select />', {'id': "z-axis-select"});

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
    zAxisSelect.append(
            $('<option />', {'value': c})
            .append("F" + (c + 1))
            .attr(((c === 2) ? "selected" : "not-selected"), ((c === 2) ? "selected" : "")));

  }

  // Replace original with new field list
  /*
   $("ul#x-axis-select").replaceWith(xAxisSelect);
   $("ul#y-axis-select").replaceWith(yAxisSelect);    
   */
  $("select#x-axis-select").replaceWith(xAxisSelect);
  $("select#y-axis-select").replaceWith(yAxisSelect);
  $("select#z-axis-select").replaceWith(zAxisSelect);
  $("select#x-axis-select, select#y-axis-select, select#z-axis-select").change(function() {
    updateScreen();
  });
}


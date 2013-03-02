/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/* ----------------------------------------------------------------------------
 * socket methods
 * ----------------------------------------------------------------------------
 */

var socket = io.connect('http://localhost:1337');

// recieve data from server
socket.on('push data', function(data) {

    loggg('push recieved');
    if (data !== undefined && data !== null) {
        dataSet = data;
    }
});

function refreshDataClick() {
    socket.emit('pull data');
    formatInterface();
}

/* uploads the csv file to the server and then
 * pulls the data from the server and update the 
 * global dataset object.
 * 
 * keyValue - the name of the file uploaded.
 */
function uploadFile() {

    loggg('upload submitted.');
    $('#dm-upload-form').submit();
}

/* ----------------------------------------------------------------------------
 * upload dialog methods
 * ----------------------------------------------------------------------------
 */

/*
 * Sets up the custom upload file dialog.
 */
function setupUploadFile() {

    $('#dm-file-upload').css({
        left: ($(window).width() - $('#dm-file-upload').width()) / 2,
        top: ($(window).height() - $('#dm-file-upload').height()) / 4
    });

    $(document).click(function() {
        $('#dm-file-upload').css({visibility: 'hidden'});

        var options = $("#options-panel");
        if (options.hasClass("active")) {
            // Hide
            options.removeClass("active");
            //var origHeight = options.height();
            options.animate({height: 0}, 1000, function() {
                options.hide();
                options.height(origHeight);
            });
        }
    });

    $("#dm-file-upload").click(function(e) {
        e.stopPropagation();
    });

    $("#upload-button").click(function(e) {
        e.stopPropagation();
        $('#dm-file-upload').css({visibility: 'visible'});
        $('html, body').animate({scrollTop: 0}, 'slow');
    });
}

/* ----------------------------------------------------------------------------
 * visualization rendering methods
 * ----------------------------------------------------------------------------
 */

/* 
 * Make an aray of pairs from the columns to be plotted 
 */
function formatData(colX, colY) {
    var dat = [];
    for (var i = 0; i < dataSet[colX].length; i++) {
        dat.push([(dataSet[colX])[i], (dataSet[colY])[i]]);
    }
    return dat;
}

function selectData() {
    var colX = $('#x-axis-select option:selected');
    var colY = $('#y-axis-select option:selected');
    return formatData(colX.val(), colY.val());
}

function updateScreen() {

    var dat = selectData();
    $.plot($('#dm-graph'), [{
            data: dat,
            points: {show: true}
        }]);
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

function formatInterface() {
    displayFieldList();
    updateScreen();
}

/*
 * Method controles the slider interactions
 */

// Global variables
var origHeight = 0;
$(document).ready(function() {
    // On load
    var origHeight = $("#options-panel").height();
    /*
     $('#dm-graph').css( {
     height: ( 
     $(window).height() 
     - 2 * parseInt( $("body").css("margin-top") ) 
     - $("header").height() 
     - 2 * parseInt( $("header").css("padding-top") ) 
     - $("footer").height() 
     - 2 * parseInt( $("footer").css("padding-top") )
     - 2 * parseInt( $("#dm-graph").css("margin-top") ) 
     - $("#options-toggle").height() 
     - 2 * parseInt( $("#options-toggle").css("padding-top") )
     - 2 * parseInt( $("#options-toggle").css("margin-top") ) 
     - 10
     )});*/

    $("#options-panel").css({
        bottom: (
                $(window).height()
                - $("#options-toggle").position().top
//         + parseInt( $("#options-toggle").css("padding-top"))
                )});
    $("#options-panel").css({width: $("#options-toggle").width()});
    $("#options-panel").hide();

    $("#options-toggle").on("click", function(e) {
        e.stopPropagation();
        var options = $("#options-panel");
        if (!options.hasClass("active"))
        { // Is currently hidden
            // Show
            options.addClass("active");
            //var origHeight = options.height();
            options.height(0);
            options.show();
            options.animate({height: origHeight}, 1000);
        }
        else
        { // Is current showing
            // Hide
            options.removeClass("active");
            //var origHeight = options.height();
            options.animate({height: 0}, 1000,
                    function() {
                        options.hide();
                        options.height(origHeight);
                    });
        }
    });

});
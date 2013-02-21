/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/* ----------------------------------------------------------------------------
 * socket methods
 * ----------------------------------------------------------------------------
 */

var socket = io.connect('http://localhost:8080');

/*
 * pulls the data from the server and update the global
 * dataset object.
 * 
 * keyValue - the name of the file uploaded.
 */
function updateData(fileName) {
    
    console.log('pull data');
    
    socket.emit('pull data', { key : fileName });
    socket.on('push data', function (data) {
        
        console.log('push recieved');
        dataSet = data;
    });
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
        left : ($(window).width() - $('#dm-file-upload').width()) / 2,
        top : ($(window).height() - $('#dm-file-upload').height()) / 2
    });
    
    $(document).click(function() {
        $('#dm-file-upload').css({ visibility : 'hidden' });
    });
    
    $("#dm-file-upload").click(function(e) {
        e.stopPropagation(); 
    });
    
    $("#upload-button").click(function(e) {
        e.stopPropagation(); 
        $('#dm-file-upload').css({ visibility : 'visible' });
        $('html, body').animate({scrollTop:0}, 'slow');
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
    for(var i = 0; i < dataSet[colX].length; i++) {
       dat.push([(dataSet[colX])[i], (dataSet[colY])[i]]);
    }
    return dat;
}

function selectData(){
    var colX = $('#x-axis-select option:selected');
    var colY = $('#y-axis-select option:selected');
    return formatData(colX.val(), colY.val());
}

function updateScreen() {
    
    var dat = selectData();
    $.plot($('#dm-graph'), [{
            data:dat,
            points:{show:true}
    }]);
}
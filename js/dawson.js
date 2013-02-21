/* 
 * Dawson Reid 
 * Feb 20, 2013
 */

var socket = io.connect('http://localhost:8080');

/*
 * pulls the data from the server and update the global
 * dataset object.
 * 
 * keyValue - the name of the file uploaded.
 */
function updateData(keyValue) {
    
    console.log('pull data');
    
    socket.emit('pull data', { key : keyValue });
    socket.on('push data', function (data) {
        
        console.log('push recieved');
        dataSet = data;
    });
} 

function test_updateData() {
    
    updateData('randat');
}
//test_updateData();

function uploadFile() {
    
    
}

function test_uploadFile() {
    
    uploadFile();
}
//test_uploadFile();

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

/* 
 * Dawson Reid 
 * Feb 20, 2013
 */

// recieve data from server
socket.on('push data', function (data) {
        
    loggg('push recieved');
    if (data !== undefined && data !== null) {
        dataSet = data;
        formatInterface();
    }
});

function refreshDataClick() {
    socket.emit('pull data');
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
        top : ($(window).height() - $('#dm-file-upload').height()) / 4
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

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

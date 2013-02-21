/* 
 * Dawson Reid 
 * Feb 20, 2013
 */

var socket = io.connect('http://localhost:8080');

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
    console.log(dataSet);
}
//test_updateData();

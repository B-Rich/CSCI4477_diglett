/* 
 * Dawson Reid 
 * Feb 20, 2013
 */

var socket = io.connect('http://localhost:8080');

function updateData(keyValue) {
    socket.emit('pull data', { key : keyValue });
    socket.on('push data', function (data) {
        console.log(JSON.stringify(data));
    });
} 

function test_updateData() {
    
    updateData('randat');
}
test_updateData();

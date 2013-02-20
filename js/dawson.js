/* 
 * Dawson Reid 
 * Feb 20, 2013
 */

var socket = io.connect('http://localhost:8080');

function updateData(keyValue) {
    
    logger.log('pull data');
    
    socket.emit('pull data', { key : keyValue });
    socket.on('push data', function (data) {
        
        logger.log('push recieved');
        dataSet = data;
    });
} 

function test_updateData() {
    
    updateData('randat');
    console.log(dataSet);
}
test_updateData();

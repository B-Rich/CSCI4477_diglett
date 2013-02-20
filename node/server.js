/* 
 * Dawson Reid
 * Feb 20, 2013
 */

// constants
var 
    LOGGING = true,
    DEBUGGING = true;
    
/*
* setup the logger if logging enabled
*/
var logger = undefined;
try {
    
    var nodeL = require('./libs/nodeL');
    logger = new nodeL.Logger
            (
            nodeL.LOG_MEDIUM.CONSOLE,
            nodeL.LOG_TYPE.INFO,
            nodeL.LOG_LEVEL.LOW
            );            
    logger.log('Logging ...');
    
} catch (e) {
    console.log("ERROR : Could not setup logger.");
    console.log("\tREASON : " + e);
    process.exit(1);
}


logger.log('Loading modules.');

// import all need libs
var 
        http = require('http'), // http processing utility
        util = require('util'),
        fs = require('fs'),
        url = require('url'),
        qs = require('querystring');


// ----------------------------------------------------------------------------
// START Server
// ----------------------------------------------------------------------------

logger.log('Loading server functions.');

function requestEnded(error) {
    logger.log('\tRequest ended.');
}

function requestClosed(error) {
    logger.log('\tRequest closed.');
}

function handleRequest(request, response) {
   
    logger.log('Request start.');
    
    // register request events
    request.on('end', requestEnded);
    request.on('close', requestClosed);
    
    if (request.method === 'POST') {
        var data = "";

        request.on("data", function(chunk) {
            data += chunk;
        });

        request.on("end", function() {
            util.log("raw: " + data);

            var json = qs.parse(data);

            util.log("json: " + json);
        });
    }
    
    // if not viewing from mobile device, redirect
    response.writeHead(302, {Location: 'http://www.mongoosetools.com'});
    response.end();
    
    return;
};

logger.log('Starting server.');

// create and init my server
var server = http.createServer();
server.on('request', handleRequest);
server.listen(8080);

// ----------------------------------------------------------------------------
// END Server
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// START Socket
// ----------------------------------------------------------------------------

logger.log('Loading socket methods');

function parse_data(key) {
    
    console.log(__dirname)
    try 
    {
        var dataSet = fs.readFileSync('./' + key + '.csv');
        console.log(dataSet);
    } catch (error) {
        console.log(error);
    }
}

logger.log('Starting socket.');

io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    
    logger.log('Socket Request.');
    
    // ship the data to client
    socket.on('pull data', function (data) {
        
        logger.log('pull data');
        var dataSet = parse_data(data.key);
        socket.emit('push data', dataSet);
    });
});

// ----------------------------------------------------------------------------
// END Socket
// ----------------------------------------------------------------------------



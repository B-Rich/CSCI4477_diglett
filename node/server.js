/* 
 * Dawson Reid
 * Feb 20, 2013
 */

// constants


// setup the logger 
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
    
    try 
    {
        var 
            fileData = [],
            rawData = fs.readFileSync(key + '.csv', 'utf8');
        
        // seperate data by line
        var lines = rawData.split('\n');

        // iterate through each line
        for (var i in lines) {

           // seperate line entries by comma
           var entries = lines[i].split(',');

           // iterate through each line entry
           for (var q in entries) {    
               if (fileData[q] === undefined) {
                   fileData[q] = [];
               }
               fileData[q][i] = entries[q];
           }
        }
        return fileData;    // return my dataset
        
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
        
        var fileData = parse_data(data.key, socket);
        
        logger.log('pull complete'); logger.log('push data');
        
        socket.emit('push data', fileData);
    });
});

// ----------------------------------------------------------------------------
// END Socket
// ----------------------------------------------------------------------------



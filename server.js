/* 
 * Dawson Reid
 * Feb 20, 2013
 */

// constants


// setup the logger 
var logger = undefined;
try {
    
    var nodeL = require('./node/nodeL');
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
        qs = require('querystring'),
        express = require('express'),
        connect = require('connect'),
        cookie = require('cookie');


// ----------------------------------------------------------------------------
// START Server
// ----------------------------------------------------------------------------

var userStore = {};

logger.log('Loading server functions.');

function requestEnded(error) {
    logger.log('\tRequest ended.');
}

function requestClosed(error) {
    logger.log('\tRequest closed.');
}

// create and init my server
var 
    app = express(),
    server = http.createServer(app),
    memStore = new express.session.MemoryStore();

logger.log('Configuring server.');

app.configure(function(){
  
  // web server config
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname));
  app.use(express.errorHandler({
    dumpExceptions: true, 
    showStack: true
  }));
  // session support
  app.use(express.cookieParser());
  app.use(express.session({
        store: memStore,
        secret: 'dugtrio',
        key: 'diglett.sid'
    }));
    
    app.use(app.router);
});

logger.log('Starting server.');

app.get('/', function (request, response) {
    
    logger.log('Request started.', nodeL.LOG_TYPE.REQUEST);
    
    request.on('end', requestEnded);
    request.on('close', requestClosed);
    
    response.sendfile('index.html');
});

app.post('/', function (request, response){
    
    request.on('end', requestEnded);
    request.on('close', requestClosed);
    
     logger.log('Upload started.', nodeL.LOG_TYPE.REQUEST);
     
     response.sendfile('index.html');
     
     fs.readFile(req.files.displayImage.path, function (err, data) {
        // ...
        var newPath = __dirname + "/uploads/uploadedFileName";
        fs.writeFile(newPath, data, function (err) {
          res.redirect("back");
        });
      });
});

server.listen(8080);

logger.log('Server started.');

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
            rawData = fs.readFileSync('./data/' + key + '.csv', 'utf8');
        
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
    
    logger.log('Socket connection.');
    
    // ship the data to client
    socket.on('pull data', function (data) {
        
        var fileData = parse_data(data.key, socket);
        
        logger.log('pull complete'); logger.log('push data');
        
        socket.emit('push data', fileData);
    });
});

io.set('authorization', function (data, accept) {
    
    if (data.headers.cookie) {    
        // attain the session id
        data.sessionID = connect.utils.parseSignedCookies(cookie.parse(decodeURIComponent(data.headers.cookie)),'m0ng00s3')['mwa.sid'];
        return accept(null, true);
    } else {
       return accept('No cookie transmitted.', false);
    }
});

// ----------------------------------------------------------------------------
// END Socket
// ----------------------------------------------------------------------------



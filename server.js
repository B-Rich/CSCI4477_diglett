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

// kmeans lib
/*
var kmeans = require('./node/k2d').kmeans; // 2D
/*/
var kmeans = require('./node/k3d').kmeans; // 3D
//*/

// ----------------------------------------------------------------------------
// START Server
// ----------------------------------------------------------------------------

var userStore = {};

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

app.use(function(req, res, next) {
  
  req.on('end', function() {
    logger.log('\treq : end');
  });
  
  req.on('close', function() {
    logger.log('\treq : close');
  });
  
  next();
});

app.get('/', function (request, response) {
    
    logger.log('Request started.', nodeL.LOG_TYPE.REQUEST);
    logger.log('GET : ' + request.sessionID, nodeL.LOG_TYPE.REQUEST);
    
    response.sendfile('index.html');
});

app.post('/', function (request, response){
    
     logger.log('Upload started.', nodeL.LOG_TYPE.REQUEST);
     logger.log('POST : ' + request.sessionID, nodeL.LOG_TYPE.REQUEST);
     
     // init user store object
     if (userStore[request.sessionID] === undefined) {
        userStore[request.sessionID] = {};
     }
     // save the upload file tmp location
     userStore[request.sessionID].file = request.files.data.path;
     
     response.sendfile('index.html');
});

app.get('/test', function (request, response) {
    
    logger.log('Request started.', nodeL.LOG_TYPE.REQUEST);
    logger.log('GET : ' + request.sessionID, nodeL.LOG_TYPE.REQUEST);
    
    response.sendfile('test.html');
});

server.listen(1337);

logger.log('Server started.');

// ----------------------------------------------------------------------------
// END Server
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// START Socket
// ----------------------------------------------------------------------------

logger.log('Loading socket methods');

function parse_data(file) {
    
    try 
    {
        var 
            fileData = [],
            rawData = fs.readFileSync(file, 'utf8');
        
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
               fileData[q][i] = parseFloat(entries[q]);
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
    logger.log('On : connection.');
    
    // ship the data to client
    socket.on('pull data', function () {
       console.log('On : pull data');
       
        var 
            file = userStore[socket.handshake.sessionID].file,
            fileData = parse_data(file, socket);
        
        logger.log('pull complete'); logger.log('push data');
        socket.emit('push data', fileData);
    });
    
    // testing function
    socket.on('ding', function () {
        console.log('On : ding');
        console.log('\tSID : ' + socket.handshake.sessionID);
    });
    
    /*
     * kmeans cluster 
     * 
     * Pipes data transmitted from client through R and emits 
     * the parsed R response to the client.
     */
    socket.on('kmeans cluster', function(data) {
      console.log('On : kmeans cluster');
      
      try {
        var kmData = kmeans(data);
        socket.emit('kmeans cluster', kmData);
      } catch (err) {
        console.log(err);
        socket.emit('server error', err);
      }
    });
    
    socket.on('auth', function(user) {
      console.log(JSON.stringify(user, null, 2));
    });    
});

/*
 * used to add the session ID to the handshake. 
 * this makes the session ID accessible from the 
 * socket.on methods.
 */
/*
io.set('authorization', function (data, accept) {
    
    if (data.headers.cookie) {    
        // attain the session id
        data.sessionID = connect.utils.parseSignedCookies(cookie.parse(decodeURIComponent(data.headers.cookie)),'dugtrio')['diglett.sid'];
        if (userStore[data.sessionID] === undefined) {
            userStore[data.sessionID] = {};
        }
        return accept(null, true);
    } else {
       return accept('No cookie transmitted.', false);
    }
});
//*/

// ----------------------------------------------------------------------------
// END Socket
// ----------------------------------------------------------------------------



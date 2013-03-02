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
        cookie = require('cookie'),
        spawn = require('child_process').spawn;

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
    logger.log('GET : ' + request.sessionID, nodeL.LOG_TYPE.REQUEST);
    
    request.on('end', requestEnded);
    request.on('close', requestClosed);
    
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
               fileData[q][i] = entries[q];
           }
        }
        return fileData;    // return my dataset
        
    } catch (error) {
        console.log(error);
    }
}

function parseR_kmeans(file, data) {
  
  fs.readFile(file, 'utf8', function (err, fileContent) {
    
    // parse the object into the template file
    for (var param in data) {      
      var rex = RegExp('\{' + param +  '\}', 'm');

      // replace all occurances of regex
      while (fileContent.match(rex)) {
        fileContent = fileContent.replace(rex, data[param]);
      }
    }
    
    // setup R process
    /*
    var R = spawn('R');
    R.stdout.setEncoding('utf8');
    R.runCmd = true;
    
    R.stdin.on('drian', function() {
      console.log('DRAIN');
    });
    R.stdin.on('close', function () {
      console.log('IN CLOSE');
    });
    R.stdin.on('pipe', function () {
      console.log('PIPE');
    });
    R.stdin.on('error', function () {
      console.log('IN ERROR');
    });
    R.stdout.on('close', function () {
      console.log('OUT CLOSE');
    });
    R.stdout.on('end', function () {
      console.log('END');
    });
    R.stdout.on('error', function () {
      console.log('OUT ERROR');
    });
    
    // output 
    R.stdout.on('data', function(msg) {
      console.log(msg);
    });
    
    var lines = fileContent.split('\n');
    for (var i in lines) {
      //console.log(JSON.stringify(lines[i] + '\n'));
      R.stdin.write('4;', 'utf8');
    }
    */
   
    
  });
};

logger.log('Starting socket.');

io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    
    logger.log('Socket connection.');
    
    // ship the data to client
    socket.on('pull data', function () {
       
        var 
            file = userStore[socket.handshake.sessionID].file,
            fileData = parse_data(file, socket);
        
        logger.log('pull complete'); logger.log('push data');
        socket.emit('push data', fileData);
    });
    
    // testing function
    socket.on('ding', function () {
        console.log('DING : ' + socket.handshake.sessionID);
    });
    
    /*
     * kmeans cluster 
     * 
     * Pipes data transmitted from client through R and emits 
     * the parsed R response to the client.
     */
    socket.on('kmeans cluster', function(data) {
      
      if (data.x === undefined || data.y === undefined ||
            data.maxIter === undefined || data.centers === undefined) {
        socket.emit('server error', 
          {
            id : 501,
            title : 'cluster data error',
            message : 'Undefined fields in transmitted kmeans data object.'
          });
          
          return ;
      }
      
      data.xstr = '' + data.x[0],
      data.ystr = '' + data.y[0];
      
      for (var i = 1; i < data.x.length && i < data.y.length; i++) {
        data.xstr += ',' + data.x[i];
        data.ystr += ',' + data.y[i];
      }
      
      parseR_kmeans('./rscript/kmeans.R.tmpl', data);
    });
});

/*
 * used to add the session ID to the handshake. 
 * this makes the session ID accessible from the 
 * socket.on methods.
 */
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

// ----------------------------------------------------------------------------
// END Socket
// ----------------------------------------------------------------------------



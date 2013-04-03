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
        mongo = require('mongodb');

// connect to mongo db
var db = new mongo.Db('diglett', new mongo.Server('localhost', 27017, {
  auto_reconnect: true
}, {}));
db.open(function() {
});

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

app.configure(function() {

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
  
  /*app.use(express.session({
    store: memStore,
    secret: 'dugtrio',
    key: 'diglett.sid'
  }));
*/
  app.use(app.router);
});

logger.log('Starting server.');

app.use(function(req, res, next) {

  // set request event listeners
  req.on('end', function() {
    logger.log('\treq : end');
  });

  req.on('close', function() {
    logger.log('\treq : close');
  });

  next();
});

app.get('/', function(request, response) {

  logger.log('Request started.', nodeL.LOG_TYPE.REQUEST);
  logger.log('GET : ' + request.sessionID, nodeL.LOG_TYPE.REQUEST);

  response.sendfile('index.html');
});

app.post('/', function(request, response) {

  logger.log('Upload started.', nodeL.LOG_TYPE.REQUEST);
  logger.log('POST : ' + request.sessionID, nodeL.LOG_TYPE.REQUEST);

  response.sendfile('index.html');
});

app.get('/test', function(request, response) {

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

/*
 * 
 * @param {type} file
 * @returns {Array}
 */
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
io.sockets.on('connection', function(socket) {
  logger.log('On : connection.');

// testing function
  socket.on('ding', function() {
    console.log('On : ding');
  });

  // ship the data to client
  socket.on('pull data', function() {
    console.log('On : pull data');

    var
            file = userStore[socket.handshake.sessionID].file,
            fileData = parse_data(file, socket);

    logger.log('pull complete');
    logger.log('push data');
    socket.emit('push data', fileData);
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

  socket.on('login', function(user) {
    console.log('On : login');

    /* select all entries from my collection where
     * the username = user.username and the 
     * password = user.password.
     */
    db.collection('users', function(error, collection) {
      collection.find(user).toArray(function(err, resultSet) {

        if (resultSet.length !== 1) {
          socket.emit('auth', false);
        } else {
          socket.emit('auth', true);
        }
      });
    });
  });
  
  socket.on('logout', function() {
    console.log('On : logout');
    
    
  });
});

// ----------------------------------------------------------------------------
// END Socket
// ----------------------------------------------------------------------------




/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , os = require('os')
  , sio = require('socket.io');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/control', function(req, res) {
  var sys_platform = os.platform();
  var sys_arch = os.arch();
  var total_mem = Math.round(os.totalmem() / 1024 / 1024);
  var free_mem = os.freemem() / 1024 / 1024;
  var used_mem = total_mem - free_mem;
  //res.send(sys_arch);
  res.render('index', { 
                      title: 'control', 
                      totalmem: total_mem, 
                      freemem: free_mem, 
                      usedmem: used_mem
                    });
});

var serv = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = sio.listen(serv);

io.sockets.on('connection', function(socket) {

  socket.on('moredata', function() {
    var total_mem = Math.round(os.totalmem() / 1024 / 1024);
    var free_mem = os.freemem() / 1024 / 1024;
    var used_mem = total_mem - free_mem;

    socket.emit('data', {
      totalmem: total_mem,
      freemem: free_mem,
      usedmem: used_mem
    });
  });

});

#!/usr/bin/env node
/* jshint esversion: 6 */

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var { generateMessage, generateLocationMessage } = require('./utils/message');
var { isRealString } = require('./utils/validation');

var { Users } = require('./utils/users');

var users = new Users();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


var debug = require('debug')('chat-PoC:server');
var http = require('http');

// get port from environment and store in Express.
var port = normalizePort(process.env.PORT || '3026');
app.set('port', port);

// create HTTP server
var server = http.createServer(app);

// Socket.io logic
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  console.log('Client connected...');

  socket.on("join", (params, callback) => {
    if(!isRealString(params.displayName) || !isRealString(params.roomName)) {
      return callback('Display name and room name are not valid');
    }
    else {
      // io.emit() --> io.to(room).emit()
      // socket.broadcast.emit() ---> socket.broadcast.to(room).emit()
      // socket.emit() ---> socket.to(room).emit()

      socket.join(params.roomName);
      
      users.removeUser(socket.id);
      users.addUser(socket.id, params.displayName, params.roomName)
      io.to(params.roomName).emit('updateUsersList', users.getUsersList(params.roomName));
      
      socket.emit("newMessage", generateMessage('Administrator', 'Welcome to our chat...'));
      socket.broadcast.to(params.roomName).emit("newMessage", generateMessage('Administrator', `${params.displayName} joined the chat...`));

      callback();
    }
  });

  socket.on("createMessage", (message, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit("newMessage", generateMessage(user.name, message.text));
      console.log('Create message: ', message);
      callback('Status: The message sent successfully!');
    }
  });

  socket.on('createLocationMessage', (location) => {
    var user = users.getUser(socket.id);
    
    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, location.latitude, location.longitude));
      console.log('Create location message: ', location);
    }
  });

  socket.on("disconnect", () => {
    var user = users.removeUser(socket.id);
    
    if(user) {
      io.to(user.room).emit('updateUsersList', users.getUsersList(user.room));
      io.to(user.room).emit("newMessage", generateMessage('Administrator', `${user.name} left the chat...`));
    }

    console.log('Client disconnected...');
  });
});

// listen on provided port, on all network interfaces
server.listen(port, () => {
  console.log(`Server is running on ${port}...`);
});

server.on('error', onError);
server.on('listening', onListening);

// normalize a port into a number, string, or false.
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// event listener for HTTP server "error" event
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// event listener for HTTP server "listening" event.
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

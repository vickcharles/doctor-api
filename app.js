require('./config/config');
require('./models/db');
require('./config/passportConfig');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const rtsIndex = require('./routes/index.router');
//router
const requestRoutes = require('./routes/request.router');
const notificationRouter = require('./routes/notification.router');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
const jwt = require('jsonwebtoken');


//Api
app.use('/api', rtsIndex);
app.use('/api/request', requestRoutes);

app.use('/api/notification', notificationRouter)
var socketioJwt = require('socketio-jwt');

const Notifications = require('./socket/notifications')




// //SOCKET CONECCTION
// io.on('connection', function(socket) {
//     console.log('a user connected');
//     Notifications.newNotifications(socket, io)
// });


io.sockets.on('connection', socketioJwt.authorize({
    secret: 'SECRET#123',
    timeout: 15000 // 15 seconds to send the authentication message
  })).on('authenticated', function(socket) {
    Notifications.newNotifications(socket, io)
    //this socket is authenticated, we are good to handle more events from it.
    console.log('hello! ' + socket.decoded_token._id);
  });


// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
});

// start server
var port = process.env.PORT || 3000;
http.listen(port , () => console.log(`Server started at port : ${port}`));

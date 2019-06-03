require('./config/config');
require('./models/db');
require('./config/passportConfig');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const rtsIndex = require('./routes/index.router');
const requestRoutes = require('./routes/request.router');

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

const Notifications = require('./socket/notifications')

// middleware
io.use((socket, next) => {
    let token = socket.handshake.query.token;

    jwt.verify(token, process.env.JWT_SECRET,
        (err, decoded) => {
            if (err)
                return next(new Error('authentication error'));
            else {
                socket._id = decoded._id;
                next();
            }
        }
    )
});


//SOCKET CONECCTION
io.on('connection', function(socket) {
    console.log('a user connected');
    Notifications.newNotifications(socket, io)
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

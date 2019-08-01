require('./config/config');
require('./models/db');
require('./config/passportConfig');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const rtsIndex = require('./routes/index.router');

//router
const doctorRoutes = require('./routes/doctors.router');

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
app.use('/api/doctors', doctorRoutes);

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

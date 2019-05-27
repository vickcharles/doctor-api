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

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

//Api
app.use('/api', rtsIndex);
app.use('/api/request', requestRoutes);

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
app.listen(port , () => console.log(`Server started at port : ${port}`));

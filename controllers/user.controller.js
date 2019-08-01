const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const User = mongoose.model('User')
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'vcharles@econtainers.co',
    pass: 'Vi04261566242'
  }
});

module.exports.getAllUsers = (req, res, next) => {
  User.find((err, users) => {
    if(err) {
       res.send({
          isError: true,
          mensaje: 'error buscando usuarios'
      })
    } else {
        res.send({
           isError: false,
           mensaje: 'Exitosamente',
           users: users
        });
    }
  })
}

module.exports.register = (req, res, next) => {
    let user = new User({
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    });

    user.save((err, doc) => {
        if(!err) {
            res.status(200).send({
              usuario: doc,
              token: doc.generateJwt(),
              mensaje: "Usuario registrado satifactoriamente"
            });
        } else if(err){
            res.send({
             isError: err,
            });
        }
        else {
           if (err.code == 11000) {
                res.status(422).send(['usted ya posee una cuenta']);
           }
            else
            return next(err);
        }
    });
}


module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).send({ token: user.generateJwt(), user});
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
};

module.exports.userProfile = (req, res, next) => {
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user: user});
        }
    );
};

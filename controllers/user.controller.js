const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const User = mongoose.model('User')
const Request = require('../models/request.model');
const crypto = require('crypto');

const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer');

/* Verificar el token del usuario */

module.exports.reset = (req, res, next) => {
    User.findOne({
       resetPasswordToken: req.query.resetPasswordToken,
    })

    .then(user => {
        if(user == null) {
            res.send({
               message: 'el link para resetear la contraseña es invalido o ha expirado'
            })
        } else {
            res.status(200).send({
              id: user._id,
              message: 'password link is ok'
            });
        }
    })
}

module.exports.updatePasswordViaEmail = (req, res) => {
  User.findById(req.body.userID)
  .then(user => {
    if(user == null) {
        res.send({
          message: 'este usuario no existe'
        });
    } else {
        user.password = req.body.password;
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        user.save()

        .then(user => {
          res.send({
            message: 'contraseña actualizada',
            user: user.email,
            password: user.password
          });
        });
    }
  })
}

module.exports.forgotPassword = (req, res, next) => {
  if (req.body.email == '') {
    res.json('email required');
  };

  console.log(req.body.email)

  User.findOne({
      email: req.body.email
  })

  .then(user => {
      if(user == null) {
        res.send({
            message: 'correo electronico no registrado'
        })
      } else {

        const token = crypto.randomBytes(20).toString('hex');
        console.log(token);
        user.resetPasswordToken = token
        user.resetPasswordExpire = Date.now() + 360000

        user.save();

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'charlesvikler@gmail.com',
            pass: '04261566242'
            }
        })


        const mailOptions = {
          from: 'charlesvikler@gmail.com',
          to: `${user.email}`,
          subject: 'Link to reset password',
          text:
          `hola, este es tu link para resetear contraseña \n \n` +
          `http://localhost:4210/reset/${token}`
        }

        console.log('sending email');
        transporter.sendMail(mailOptions, (err, response) => {
          if(err) {
            console.error('there was an error ' + err)
           } else {
              res.send({
                message: 'correo electronico enviado'
              })
           }
        });
      }
  });
};

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
        })
    }
  })
}

module.exports.getUserAndUpdate = (req, res, next) => {
    var userId = req._id;

    let user = {
      name:req.body.nombre,
      lastName: req.body.apellido,
      city: req.body.ciudad,
      cellPhone: req.body.telefono
    }

    User.findByIdAndUpdate(userId, user, function(error, newUser) {
       if(error){
          res.status(400).send({
            isError: true,
            mensaje: 'Error actualizando el usuario',
            error
          })
       } else {
            res.status(200).send({
              isError: false,
              mensaje: 'Usuario actualizado satisfactoriamente',
              user: newUser
           });
       }
    });
}

module.exports.getAllAdminUsers = (req, res, next) => {
    User.find({role: 'ADMIN'}, (err, users) => {
      if(err) {
         res.status(400).send({
           isError: true,
           mensaje: 'error buscando usuarios'
        })
      } else {
        res.status(200).send({
            isError: false,
            mensaje: 'exitosamente',
            users: users[Math.floor(Math.random() * users.length)]._id
        })
      }
    })
}

module.exports.register = (req, res, next) => {
    let user = new User({
      name: req.body.nombre,
      lastName: req.body.apellido,
      cellPhone: req.body.telefono,
      role: req.body.role,
      city: req.body.city,
      email: req.body.correo,
      password: req.body.contrasena
    });

    const credentials = {
      email: req.body.correo,
      password: req.body.contrasena
    };

    user.save((err, doc) => {
        if(!err) {
            res.status(200).send({
             usuario: doc,
             mensaje: "Usuario registrado satifactoriamente"
            });
        }
        else {
            if (err.code == 11000) {
                res.status(422).send(['Ya este usuario posee una cuenta']);
            }
            else
              return next(err);
        }
    });
}

// Metodo para crear un nuevo usuario y asignarle la solitud
module.exports.registerAndPostRequest = (req, res, next) => {

    var userToSave = new User({
      name: req.body.user.nombre,
      lastName: req.body.user.apellido,
      cellPhone: req.body.user.telefono,
      city: req.body.user.ciudad,
      role: 'User',
      email: req.body.user.correo,
      password: req.body.user.contrasena
    });

    var request = new Request({
       tipoDeServicio: req.body.request.tipoDeServicio,
       cliente: req.body.request.cliente,
       origen: req.body.request.origen,
       destino: req.body.request.destino,
       mensaje: req.body.request.mensaje
    });

    //Asignar comercial de 24/7
    User.find({ role: 'ADMIN' }, (err, users) => {
        if(err) {
            res.status(400).send({
              isError: true,
              mensaje: "Error buscando un usuarios adminitradores"
            })
        }
        request.operadorId = users[Math.floor(Math.random() * users.length)]._id;
    })

    User.findOne({email:  req.body.user.correo}, function(err, user){
        if(err) {
          console.log(err);
        }
        if(user) {
            res.status(422).send({
             isError: true,
             mensaje: "Error buscando un usuarios adminitradores"
            })
        } else {
            userToSave.save((err, doc) => {
                if(!err) {
                    request.usuario = doc._id;
                    request.save((err, request) => {
                        if(err) {
                            res.send({
                               isError: true,
                               mensaje: "Hubo un error creando el Request",
                               err: err
                            });
                        }
                        Request.populate(request, { path: 'operadorId' }, (err, req) => {
                            if(err) {
                                res.send({
                                   isError: true,
                                   mensaje: "Hubo un error populando (operadoriD)request",
                                   err: err
                                });
                            }

                            Request.populate(req, { path: 'usuario' }, (err, saverequest) => {
                                if(err) {
                                    res.send({
                                       isError: true,
                                       mensaje: "Hubo un error populando (usuario) request",
                                       err: err
                                    });
                                }

                                res.status(200).send({
                                  isError: false,
                                  mensaje: "Usuario y Solicitud creado satisfactoriamente",
                                  request: saverequest,
                                  token: doc.generateJwt()
                                });
                            })
                        })
                    })
                } else {
                    if (err.code == 11000) {
                        res.status(422).send(['Ya este usuario posee una cuenta']);
                    }
                    else
                     return next(err);
                }
            });
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
}

module.exports.userProfile = (req, res, next) => {
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user: user});
        }
    );
}

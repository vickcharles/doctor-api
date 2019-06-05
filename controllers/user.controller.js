const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const User = mongoose.model('User')
const Request = require('../models/request.model');


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

    User.findOneAndUpdate(userId, user, function(error, user) {
       if(error){
        res.status(400).send({
          isError: true,
          mensaje: 'Error actualizando el usuario',
          error
        })
       } else {
        res.status(200).send({
          isError: true,
          mensaje: 'Usuario actualizado satisfactoriemnete',
          user: user
        })
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

    var user = new User({
      name: req.body.user.nombre,
      lastName: req.body.user.apellido,
      cellPhone: req.body.user.telefono,
      city: req.body.user.ciudad,
      role: 'USER',
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

    user.save((err, doc) => {
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
                request.populate('usuario')
                res.send({
                  isError: false,
                  mensaje: "Usuario y Solicitud creado satisfactoriamente",
                  request: request,
                  token: doc.generateJwt()
                });

            })
        } else {
            if (err.code == 11000) {
                res.status(422).send(['Ya existe una cuenta']);
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

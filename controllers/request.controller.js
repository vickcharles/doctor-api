const Request = require("../models/request.model");
const mongoose = require('mongoose');
const User = mongoose.model('User')

module.exports.create = (req, res, next) => {
    const newRequest = new Request({
      usuario: req._id,
      tipoDeServicio: req.body.tipoDeServicio,
      cliente: req.body.cliente,
      origen: req.body.origen,
      destino: req.body.destino,
      mensaje: req.body.mensaje
    });

    //Asignar un comercial por el rol
    User.find({role:'ADMIN'} ,(err, users) => {
        if(err) {
            res.status(400).send({
              isError: true,
              mensaje: "Error buscando un usuarios adminitradores"
            })
        }
        newRequest.operadorId = users[Math.floor(Math.random() * users.length)]._id;
        newRequest.save((err, doc) => {
            if(err) {
                res.status(400).send({
                  isError: true,
                  mensaje: "Error crenado un nuevo request" + err
                })
            }
            res.status(200).send({
                isError: false,
                mensaje: "Request creado satisfactoriamete",
                request: doc
            })
         })
    })

}

module.exports.getAll = (req, res, next) => {
    Request.find({usuario: req._id})
    .populate("operadorId")
    .exec((err, doc) => {
        if(err) {
          res.status(400).send({
            isError: true,
            mensaje: "Error crenado un nuevo request"
          })
        }
        res.status(200).send({
          isError: false,
          mensaje: "Todos los requests",
          requests: doc
        })
    })
};


module.exports.getAllByStatus = (req, res, next) => {
    Request.find({ usuario: req._id, estado: req.body.status })
    .populate("operadorId")
    .exec((err, doc) => {
        if(err) {
            res.status(400).send({
              isError: true,
              mensaje: "Error crenado un nuevo request"
            })
        }
        res.status(200).send({
          isError: false,
          mensaje: "Todos los requests",
          requests: doc
        })
    })
};


// Admin

module.exports.getAllAdmin = (req, res, next) => {
    Request.find({operadorId: req._id})
    .populate("usuario")
    .exec((err, doc) => {
        if(err) {
            res.status(400).send({
              isError: true,
              mensaje: "Error creando un nuevo request"
            });
        }
        res.status(200).send({
          isError: false,
          mensaje: "Todos los requests",
          requests: doc
        })
    })
};


module.exports.getAllAdminByStatus = (req, res, next) => {
    Request.find({operadorId: req._id, estado: req.body.status})
    .populate("usuario")
    .exec((err, doc) => {
        if(err) {
            res.status(400).send({
              isError: true,
              mensaje: "Error creando un nuevo request"
            });
        }
        res.status(200).send({
          isError: false,
          mensaje: "Todos los requests",
          requests: doc
        })
    })
};

module.exports.updateRequestStatus = (req, res, next) => {
    Request.findOne({ _id: req.params.id })
    .exec((err, request) => {
        if(err) {
            res.status(400).send({
                isError: true,
                mensaje: "error buscando request"
            })
           }
        request.estado = req.body.status;
        request.save((err, request) => {
            if(err) {
                res.status(400).send({
                    isError: true,
                    mensaje: "error actualizando request"
                })
            }

            res.status(200).send({
                isError: true,
                mensaje: "Request actualizado satisfactoriamente",
                request
            });
        })
    })
}

module.exports.getById = (req, res, next) => {

  const id = req.params.id;
  Request.findById(id)
  .populate("operadorId")
  .populate("usuario")

    .exec((err, request) => {
        if(err) {
            res.status(400).send({
             isError: true,
             mensaje: "error buscando request"
            })
        }

        res.status(200).send({
          isError: false,
          mensaje: "Bien",
          request: request
        })
    })
};


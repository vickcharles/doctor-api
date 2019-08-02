const Doctor = require("../models/doctor.model");
const mongoose = require('mongoose');
const User = mongoose.model('User')

module.exports.create = (req, res) => {
    console.log(req.body)

    const newDoctor = new Doctor({
      userId: req._id,
      bio: req.body.bio,
      avatar: req.body.avatar,
      education: req.body.education,
    });

    Doctor.findOne({userId: req._id})
      .exec((err, doctor) => {
        if(err) {
          res.status(400).send({
            isError: true,
            mensaje: "erro bsucando" + err
          })
        }
        if(doctor) {
          doctor.bio = req.body.bio
          doctor.avatar = req.body.avatar
          doctor.education = req.body.education

          doctor.save((err, doc) => {
            if(err) {
              res.status(400).send({
                isError: true,
                mensaje: "error al actualizar un doctor " + err
              });
            }
            res.status(200).send({
              isError: false,
              mensaje: "it`s ok updated",
              doctor: doc
            });
          });
        } else {
          newDoctor.save((err, doc) => {
            if(err) {
              res.status(400).send({
                isError: true,
                mensaje: "erro al crear un doctor " + err
              })
            }
            res.status(200).send({
              isError: false,
              mensaje: "it`s ok created",
              doctor: doc
            });
          })
        }
    });
};

module.exports.getById = (req, res) => {
  Doctor.find({userId: req._id})
    .populate("userId")
    .exec((err, doctor) => {
      if(err) {
        res.status(400).send({
          isError: true,
          mensaje: "error"
        })
      }
      res.status(200).send({
        isError: false,
        doctor: doctor
      })
    })
};

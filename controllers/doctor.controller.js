const Doctor = require("../models/doctor.model");
const mongoose = require('mongoose');
const User = mongoose.model('User')

module.exports.create = (req, res) => {
    const newDoctor = new Doctor({
      userId: req._id,
      education: req.body.education,
    });

    newDoctor.save((err, doc) => {
      if(err) {
        res.status(400).send({
          isError: true,
          mensaje: "erro al crear un doctor" + err
        })
      }
      res.status(200).send({
        isError: false,
        mensaje: "it`s ok",
        doctor: doc
      })
    })
};

module.exports.getById = (req, res, next) => {
  const id = req.body._id;

  Doctor.find({userId: req._id})
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


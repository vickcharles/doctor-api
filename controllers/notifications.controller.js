const Notification = require("../models/notification.model");

module.exports.getAll = (req, res) => {
    Notification.find({receiver: req._id})
    .populate('sender')
    .exec((err, doc) => {
        if(err) {
            res.status(400).send({
              isError: true,
              mensaje: "Error buscando notificaciones"
            })
        }
        res.status(200).send({
           isError: false,
           notifications: doc
        })

    })
}
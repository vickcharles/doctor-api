require('../models/db');

const Notification = require("../models/notification.model");

module.exports.newNotifications = (cliente, io)  => {

    cliente.on('notifications', (payload) => {
        console.log('emitiendo');
        const NotificationSchema = new Notification ({
          sender: cliente._id, // Notification creator
          receiver: payload.receiver, // Ids of the receivers of the notification
          message: payload.message, // any description of the notification message
          seen: payload.seen
        });

        NotificationSchema.save()

        Notification.find({ receiver: cliente._id })
        .populate('sender')
        .populate('receiver')

        .exec((err, doc) => {
          io.emit('new-notifications', doc);
        })
    });

    cliente.on('listen-notifications', () => {
        console.log('escuchando notificaciones');
        Notification.find({ receiver: cliente._id })
        .populate('sender')
        .populate('receiver')

        .exec((err, doc) => {
          io.emit('new-notifications', doc);
        })
    })
}

require('../models/db');

const Notification = require("../models/notification.model");

module.exports.newNotifications = (cliente, io)  => {
    cliente.on('mensaje', (payload) => {
        const NotificationSchema = new Notification({
          sender: 'dsf', // Notification creator
          receiver: 'sdf', // Ids of the receivers of the notification
          message: 'hola perra', // any description of the notification message
          seen: false
        });

        NotificationSchema.save()

        Notification.find((err, doc) => {
            io.emit('mensaje-nuevo', 'tiene una nueva notificacion' + doc)
        })
    })
}


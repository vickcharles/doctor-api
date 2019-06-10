require('../models/db');

const Notification = require("../models/notification.model");
var ObjectID = require('mongodb').ObjectID;

module.exports.newNotifications = (cliente, io)  => {
    cliente.on('notifications', (payload) => {
      console.log("emitiendo")

        const NotificationSchema = new Notification ({
          sender: payload.userId, // Notification creator
          receiver: payload.receiver, // Ids of the receivers of the notification
          message: payload.message, // any description of the notification message
          seen: payload.seen
        });

        NotificationSchema.save((err, doc) => {
           if(err) {
             console.log('error creando notificacion' + err);
           }
           Notification.populate(doc, { path: 'sender' }, (err, newNotification) => {
              if(err) {
                console.log('Error in populate notification: ' + err)
              }
              io.emit('new-notifications', newNotification);
           })
        })
    });
}

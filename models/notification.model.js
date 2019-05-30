const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema  = new Schema({
  sender: String, // Notification creator
  receiver: String, // Ids of the receivers of the notification
  message: String, // any description of the notification message
  seen: Boolean,
  created_at:{type: Date, default: Date.now},
});

module.exports = mongoose.model('Notification', NotificationSchema)
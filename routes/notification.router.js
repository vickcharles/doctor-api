const express = require('express');
const router = express.Router();

const ctrlNotification = require('../controllers/notifications.controller');

const jwtHelper = require('../config/jwtHelper');

// Ver todas las notificaciones por usuario autenticado //
router.get('/getAll', jwtHelper.verifyJwtToken, ctrlNotification.getAll);

module.exports = router;


const express = require('express');
const router = express.Router();
const ctrlDoctor = require('../controllers/doctor.controller');
const jwtHelper = require('../config/jwtHelper');

// Crear un nuevo doctor
router.post('/create', jwtHelper.verifyJwtToken, ctrlDoctor.create);
router.get('/getById', jwtHelper.verifyJwtToken, ctrlDoctor.getById);

module.exports = router;

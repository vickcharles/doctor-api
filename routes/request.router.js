const express = require('express');
const router = express.Router();

const ctrlRequest = require('../controllers/request.controller');

const jwtHelper = require('../config/jwtHelper');


// Crear un nuevo request
router.post('/create', jwtHelper.verifyJwtToken, ctrlRequest.create);

// Ver todos los requests
router.get('/getAll', jwtHelper.verifyJwtToken, ctrlRequest.getAll);

// Ver todos los request del admin
router.get('/getAllAdmin', jwtHelper.verifyJwtToken, ctrlRequest.getAllAdmin);

router.get('/getById/:id', ctrlRequest.getById);

router.put('/update/status/:id', ctrlRequest.updateRequestStatus);

module.exports = router;


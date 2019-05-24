const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');
const jwtHelper = require('../config/jwtHelper');

router.post('/register', ctrlUser.register);
router.get('/users', ctrlUser.getAllUsers);
router.get('/', (req, res) => {
    res.send("hola mundo");
});

router.get('/users/admin', ctrlUser.getAllAdminUsers);
router.post('/register/request', ctrlUser.registerAndPostRequest);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.post('/user/update', jwtHelper.verifyJwtToken, ctrlUser.getUserAndUpdate);

module.exports = router;


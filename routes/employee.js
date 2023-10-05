const express = require('express');
const router = express.Router();

const employeeConrtoller = require('../controllers/employeeConrtoller');

router.get('/sign-up',employeeConrtoller.signUp);

module.exports = router;
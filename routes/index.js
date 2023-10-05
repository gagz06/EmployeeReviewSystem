const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const employeeConrtoller = require('../controllers/employeeConrtoller');
console.log('router loaded');
//router.get('/',homeController.home);
router.get('/',employeeConrtoller.signUp);

module.exports = router;
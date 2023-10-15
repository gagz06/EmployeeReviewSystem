const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const employeeConrtoller = require('../controllers/employeeConrtoller');
const passport = require('passport');

console.log('router loaded');
//router.get('/',homeController.home);
router.get('/',employeeConrtoller.signUp);
router.use('/employee',require('./employee'));
router.get('/adminHome',passport.checkAuthentication,homeController.adminHome);
router.get('/manageUser/:id',homeController.manageUser);
router.get('/manageReview/:id',homeController.manageReview);
router.get('/sign-out',homeController.signOut);
module.exports = router;
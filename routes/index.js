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
router.get('/manageUser/:id',passport.checkAuthentication,homeController.manageUser);
router.get('/manageReview/:id',homeController.manageReview);
router.get('/assignReview/:toFeedback/:forFeedback',homeController.assignReview);
router.get('/sign-out',homeController.signOut);
router.get('/feedback-form/:employeeId',homeController.adminFeedBackForm);
router.post('/admin/submit-feedback',homeController.submitFeedback);
router.get('/admin/update-review/:id/:from',homeController.updatReviewPage);
router.post('/admin/updateFeedback/:id/:from',homeController.updateFeedback);
router.get('/admin/delete/:id/:from',homeController.deleteFeedback);
module.exports = router;
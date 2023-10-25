const express = require('express');
const router = express.Router();
const passport = require('passport');
const employeeConrtoller = require('../controllers/employeeConrtoller');

router.get('/home',passport.checkAuthentication,employeeConrtoller.home);
router.get('/feedback-form/:reviewerId/:employeeId',employeeConrtoller.feedBackForm);
router.post('/submit-feedback',employeeConrtoller.submitFeedback);

module.exports = router;
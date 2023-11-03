const express = require('express');
const router = express.Router();
const passport = require('passport');
const employeeController = require('../controllers/employeeController');

// Route to the home page for employees
router.get('/home', passport.checkAuthentication, employeeController.home);

// Route to the feedback form
router.get('/feedback-form/:reviewerId/:employeeId', employeeController.feedBackForm);

// Route to submit feedback
router.post('/submit-feedback', employeeController.submitFeedback);

module.exports = router;

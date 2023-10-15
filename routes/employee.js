const express = require('express');
const router = express.Router();
const passport = require('passport');

const employeeConrtoller = require('../controllers/employeeConrtoller');

router.get('/sign-up',employeeConrtoller.signUp);
router.post('/create',employeeConrtoller.create);
router.post('/update/:id', employeeConrtoller.updateEmployee);
router.get('/sign-in',employeeConrtoller.signIn)
router.get('/home',passport.checkAuthentication,employeeConrtoller.home);
router.get('/delete/:id',employeeConrtoller.deleteEmployee);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/employee/sign-in'}
),employeeConrtoller.createSession);


module.exports = router;
const express = require("express");
const router = express.Router();
const passport = require("passport");
const adminController = require("../controllers/adminController");

// Route to delete an employee
router.get("/delete/:id", adminController.deleteEmployee);

// Route to update employee information
router.post("/update/:id", adminController.updateEmployee);

// Route to the admin home page
router.get("/adminHome", passport.checkAuthentication, adminController.adminHome);

// Route to manage user details
router.get("/manageUser/:id", passport.checkAuthentication, adminController.manageUser);

// Route to manage employee performance reviews
router.get("/manageReview/:id", adminController.manageReview);

// Route to assign a review between employees
router.get("/assignReview/:toFeedback/:forFeedback", adminController.assignReview);

// Route to the feedback form for an admin
router.get("/feedback-form/:employeeId", adminController.adminFeedBackForm);

// Route to submit feedback for an admin
router.post("/submit-feedback", adminController.submitFeedback);

// Route to update a review
router.get("/update-review/:id/:from", adminController.updatReviewPage);
router.post("/updateFeedback/:id/:from", adminController.updateFeedback);

// Route to delete feedback
router.get("/delete/:id/:from", adminController.deleteFeedback);

// Route to create an employee
router.post("/create", adminController.create);

module.exports = router;

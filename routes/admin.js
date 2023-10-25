//admin
const express = require("express");
const router = express.Router();
const passport = require("passport");
const adminController = require("../controllers/adminController");

router.get("/delete/:id", adminController.deleteEmployee);
router.post("/update/:id", adminController.updateEmployee);
router.get(
  "/adminHome",
  passport.checkAuthentication,
  adminController.adminHome
);
router.get(
  "/manageUser/:id",
  passport.checkAuthentication,
  adminController.manageUser
);
router.get("/manageReview/:id", adminController.manageReview);
router.get(
  "/assignReview/:toFeedback/:forFeedback",
  adminController.assignReview
);
router.get("/feedback-form/:employeeId", adminController.adminFeedBackForm);
router.post("/submit-feedback", adminController.submitFeedback);
router.get("/update-review/:id/:from", adminController.updatReviewPage);
router.post("/updateFeedback/:id/:from", adminController.updateFeedback);
router.get("/delete/:id/:from", adminController.deleteFeedback);
router.post("/create", adminController.create);
module.exports = router;
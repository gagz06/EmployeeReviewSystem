const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const passport = require("passport");

console.log("router loaded");

// Include the employee and admin routes
router.use("/employee", require("./employee"));
router.use("/admin", require("./admin"));

// Route to sign out (log out)
router.get("/sign-out", homeController.signOut);

// Route to the home page or sign-up page
router.get("/", homeController.signUp);
router.get("/sign-up", homeController.signUp);

// Route to create a session (log in)
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/sign-in" }),
  homeController.createSession
);

// Route to the sign-in page
router.get("/sign-in", homeController.signIn);

module.exports = router;

const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const passport = require("passport");

console.log("router loaded");

router.use("/employee", require("./employee"));
router.use("/admin", require("./admin"));

router.get("/sign-out", homeController.signOut);
router.get("/", homeController.signUp);
router.get("/sign-up", homeController.signUp);
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/sign-in" }),
  homeController.createSession
);
router.get("/sign-in", homeController.signIn);

module.exports = router;

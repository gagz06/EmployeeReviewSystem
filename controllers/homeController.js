const employeeSchema = require("../models/employeeModel");
const performanceReviewSchema = require("../models/performanceReview");

// Function to render the sign-up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/employee/home");
  }
  return res.render("employee_sign_up", {
    title: "ERS | Sign Up!",
  });
};

// Function to render the sign-in page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/employee/home");
  }
  return res.render("employee_sign_in", {
    title: "ERS | Sign In",
  });
};

// Function to create a session (log in)
module.exports.createSession = async function (req, res) {
  try {
    req.flash("success", "Logged in successfully");
    let emp = await employeeSchema.findOne({ email: req.body.email });
    let userAccessType = emp.userAccessType;
    console.log("Sign-in successful");
    if (userAccessType == "Employee") {
      return res.redirect("/employee/home");
    } else if (userAccessType == "Admin") {
      return res.redirect("/admin/adminHome");
    }
  } catch (error) {
    console.log(error);
  }
};

// Function to sign out (log out)
module.exports.signOut = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Signed Out successfully");
    res.redirect("/sign-in");
  });
};

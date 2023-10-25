const employeeSchema = require("../models/employeeModel");
const performanceReviewSchema = require("../models/performanceReview");

module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/employee/home");
  }
  return res.render("employee_sign_up", {
    title: "ERS | Sign UP!",
  });
};

module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/employee/home");
  }
  return res.render("employee_sign_in", {
    title: "ERS | Sign IN",
  });
};

module.exports.createSession = async function (req, res) {
  try {
    req.flash("success", "Logged in succesfully");
    let emp = await employeeSchema.findOne({ email: req.body.email });
    let userAccessType = emp.userAccessType;
    console.log("Sign in successfull");
    if (userAccessType == "Employee") {
      return res.redirect("/employee/home");
    } else if (userAccessType == "Admin") {
      return res.redirect("/admin/adminHome");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.signOut = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Signed Out successfully");
    res.redirect("/sign-in");
  });
};

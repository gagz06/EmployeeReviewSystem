const employeeSchema = require("../models/employeeModel");
const performanceReviewSchema = require("../models/performanceReview");

// Function to create a new employee
module.exports.create = function (req, res) {
  try {
    // Check if the provided password and confirm_password match
    if (req.body.password != req.body.confirm_password) {
      req.flash("error", "Password and confirm password doesn't match");
      return res.redirect("back");
    }
    
    // Check if an employee with the same email already exists
    employeeSchema.findOne({ email: req.body.email })
      .then((employee) => {
        if (!employee) {
          // Create and save the new employee
          employeeSchema.create(req.body)
            .then(() => {
              req.flash("success", "Employee created successfully");
              console.log("Employee created successfully");
              res.redirect("back");
            })
            .catch((createError) => {
              req.flash("error", "Error in creating employee: " + createError.message);
              console.error("Error in creating employee:", createError);
              res.redirect("back");
            });
        } else {
          req.flash("error", "Employee Already Exists");
          res.redirect("back");
        }
      })
      .catch((err) => {
        req.flash("error", "An error occurred while checking for existing employee: " + err.message);
        console.error("An error occurred while checking for existing employee:", err);
        res.redirect("back");
      });
  } catch (error) {
    console.log("Error in employee creation", error);
    return res.redirect("back");
  }
};

// Function to update employee details
module.exports.updateEmployee = async function (req, res) {
  try {
    // Check if the user's userAccessType is "Admin"
    if (res.locals.employee.userAccessType == "Admin") {
      const empId = req.params.id;
      const updatedEmployeeData = {
        name: req.body.name,
        email: req.body.email,
        userAccessType: req.body.role,
      };

      // Find and update the employee by their ID
      const employee = await employeeSchema.findByIdAndUpdate(
        empId,
        { $set: updatedEmployeeData }, // Use $set to update only specific fields
        { new: true } // This option returns the updated document
      );

      if (employee) {
        console.log("Employee updated:", employee);
        req.flash("success", "Employee Details Updated Successfully");
        return res.redirect("back"); // Redirect to the previous page
      } else {
        req.flash("error", "No such Employee exists");
        return res.redirect("back");
      }
    }
  } catch (error) {
    console.log("Error in employee updation", error);
    return res.redirect("back");
  }
};

// Function to delete an employee
module.exports.deleteEmployee = async function (req, res) {
  try {
    let empId = req.params.id;
    if (empId) {
      // Find and remove the employee by their ID
      let employee = await employeeSchema.findByIdAndRemove(empId);

      if (employee) {
        // Check if there are associated performance reviews, and delete them
        let review = await performanceReviewSchema.findOne({
          review_to: empId,
        });
        if (review) {
          await review.deleteOne();
        }
        let review2 = await performanceReviewSchema.findOne({
          reviewed_by: empId,
        });
        if (review2) {
          await review2.deleteOne();
        }
        req.flash("success", "Employee Deleted successfully");
        res.redirect("/admin/adminHome");
      } else {
        req.flash("error", "Employee doesn't exist");
        res.redirect("back");
      }
    } else {
      req.flash("error", "Employee doesn't exist");
      res.redirect("back");
    }
  } catch (error) {
    console.log(error);
    res.redirect("back");
  }
};

// Function to delete a feedback
module.exports.deleteFeedback = async function (req, res) {
  try {
    if (req.params.id) {
      let reviewId = req.params.id;
      let empId = req.params.from;
      // Find and delete the performance review by its ID
      let review = await performanceReviewSchema.findByIdAndDelete(reviewId);
      if (review) {
        return res.redirect(`/admin/manageReview/${empId}`);
      } else {
        return res.redirect("back");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Function to update feedback in a performance review
module.exports.updateFeedback = async function (req, res) {
  if (req.params.id) {
    let updatedReview = await performanceReviewSchema.findById(req.params.id);
    let emp = await employeeSchema.findById(req.params.from);
    if (updatedReview) {
      const feedback = req.body.feedback;
      const teamwork = req.body.teamworkRating;
      const knowledge = req.body.knowledgeRating;
      const communication = req.body.communicationRating;
      updatedReview.feedback = feedback;
      if (teamwork != undefined) {
        updatedReview.teamwork = teamwork;
      }
      if (knowledge != undefined) {
        updatedReview.knowledge = knowledge;
      }
      if (communication != undefined) {
        updatedReview.communication = communication;
      }
      await updatedReview.save();
      console.log(updatedReview);
      req.flash("success", "Employee Feedback updated successfully");
      return res.render("updateReview", {
        title: "Edit Feedback",
        review: updatedReview,
        emp: emp,
      });
    } else {
      req.flash("error", "Feedback not found");
      return res.redirect("back");
    }
  }
};

// Function to render the page for updating a review
module.exports.updatReviewPage = async function (req, res) {
  let review = await performanceReviewSchema
    .findById(req.params.id)
    .populate({
      path: "reviewed_by",
      model: "Employee",
    })
    .populate({
      path: "review_to",
      model: "Employee",
    });
  let emp = await employeeSchema.findById(req.params.from);
  return res.render("updateReview", {
    title: "Edit Feedback",
    review: review,
    emp: emp,
  });
};

// Function to submit feedback for an employee
module.exports.submitFeedback = async function (req, res) {
  let reviewer = await employeeSchema.findById(req.body.reviewerId);
  let employee = await employeeSchema.findById(req.body.employeeId);
  try {
    if (reviewer && req.body.reviewerId === res.locals.employee.id) {
      if (employee) {
        // Create a performance review and associate it with the employee and reviewer
        let reviewObject = await performanceReviewSchema.create({
          teamwork: req.body.teamworkRating,
          knowledge: req.body.knowledgeRating,
          communication: req.body.communicationRating,
          feedback: req.body.feedback,
          review_to: employee,
          reviewed_by: reviewer,
        });
        // Save the changes into the database
        await reviewObject.save();
        // Add the review record to the employee
        const employeeReviewRecord = await employeeSchema.findById(employee.id);
        employeeReviewRecord.reviews = reviewObject;
        await employeeReviewRecord.save();
        req.flash(
          "success",
          `${reviewer.name} successfully submitted feedback to ${employee.name}`
        );
        return res.redirect("/admin/adminHome");
      } else {
        console.log("employee does not exist");
        req.flash("error", "employee does not exist");
        return res.redirect("/admin/home");
      }
    } else {
      console.log("unauthorized");
      req.flash("error", `Unauthorized access, login to continue`);
      return res.redirect("/sign-out");
    }
  } catch (error) {
    console.log(error);
    req.flash("error", "error in submitting feedback");
    return res.redirect("back");
  }
};

// Function to render the feedback form for an admin
module.exports.adminFeedBackForm = async function (req, res) {
  let emp = await employeeSchema.findById(req.params.employeeId);
  let reviewer = await employeeSchema.findById(res.locals.employee.id);
  return res.render("feedback_Form", {
    title: "Admin Feedback",
    emp: emp,
    reviewer: reviewer,
  });
};

// Function to render the admin home page
module.exports.adminHome = async function (req, res) {
  try {
    if (req.isAuthenticated()) {
      if (res.locals.employee.userAccessType == "Admin") {
        let employeeList = await employeeSchema.find({});
        let filteredEmployeeList = employeeList.filter(
          (employee) => employee.id !== res.locals.employee.id
        );
        filteredEmployeeList = filteredEmployeeList.filter(
          (employee) => employee.userAccessType !== "Admin"
        );
        return res.render("adminHome", {
          title: "Admin Home",
          employeeList: filteredEmployeeList,
        });
      } else {
        return res.redirect("/employee/home");
      }
    } else {
      res.redirect("/sign-in");
    }
  } catch (error) {
    console.log(error);
    return res.redirect("back");
  }
};

// Function to manage user details
module.exports.manageUser = async function (req, res) {
  try {
    const userId = req.params.id;
    let employee = await employeeSchema.findById(userId);
    if (employee) {
      res.render("manageUser", {
        title: "Manage User",
        emp: employee,
      });
    } else {
      console.log("Error in finding employee");
      return res.redirect("/adminHome");
    }
  } catch (error) {
    console.log(error);
    return res.redirect("back");
  }
};

// Function to manage employee performance reviews
module.exports.manageReview = async function (req, res) {
  let employeeForReview = await employeeSchema
    .findById(req.params.id)
    .populate({
      path: "assigned_reviewers",
      model: "Employee",
    })
    .populate({
      path: "assigned_reviews",
      model: "Employee",
    })
    .populate({
      path: "reviews",
      model: "Review",
    });

  let reviews = await performanceReviewSchema
    .find({ review_to: req.params.id })
    .populate({
      path: "reviewed_by",
      model: "Employee",
    })
    .populate({
      path: "review_to",
      model: "Employee",
    });
  let employeeList = await employeeSchema.find({});
  let filteredEmployeeList = employeeList.filter(
    (employee) => employee.id !== req.params.id
  );
  filteredEmployeeList = filteredEmployeeList.filter(
    (employee) => employee.userAccessType !== "Admin"
  );
  res.render("manageReview", {
    title: "Manage Review",
    employeeList: filteredEmployeeList,
    employeeForReview: employeeForReview,
    reviews: reviews,
  });
};

// Function to assign a review between employees
module.exports.assignReview = async function (req, res) {
  let admin = await employeeSchema.findById(res.locals.employee.id);
  let employeeToForFeedback = await employeeSchema.findById(
    req.params.toFeedback
  );
  let employeeForFeedback = await employeeSchema.findById(
    req.params.forFeedback
  );

  if (admin && admin.userAccessType == "Admin") {
    if (employeeToForFeedback && employeeForFeedback) {
      let assignedReviewList = employeeToForFeedback.assigned_reviews;
      let assignedReviewersList = employeeForFeedback.assigned_reviewers;
      let assignedReviewer = employeeForFeedback.assigned_reviewers.filter(
        (a) => {
          return a.equals(employeeToForFeedback.id);
        }
      );
      if (!assignedReviewer.length) {
        assignedReviewList?.push(employeeForFeedback);
        await employeeToForFeedback.save();

        assignedReviewersList?.push(employeeToForFeedback);
        await employeeForFeedback.save();
      }
      const employee = await employeeSchema
        .findById(req.params.toFeedback)
        .populate({
          path: "assigned_reviewers",
          model: "Employee",
        })
        .populate({
          path: "assigned_reviews",
          model: "Employee",
        });
      req.flash(
        "success",
        `${employeeToForFeedback.name} is assigned to review ${employeeForFeedback.name}`
      );
      return res.redirect("back");
    } else {
      if (!employeeToForFeedback) {
        console.log("reviewer does not exist");
        req.flash("reviewer does not exist");
        return res.redirect("back");
      } else if (!employeeForFeedback) {
        console.log("employee does not exist");
        req.flash("employee does not exist");
        return res.redirect("/adminHome");
      }
    }
  }
  return res.redirect("back");
};

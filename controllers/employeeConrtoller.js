const employeeSchema = require("../models/employeeModel");
const performanceReviewSchema = require("../models/performanceReview");

// Function to submit feedback for an employee
module.exports.submitFeedback = async function (req, res) {
  let reviewer = await employeeSchema.findById(req.body.reviewerId);

  // Find the data of the employee by id
  let employee = await employeeSchema.findById(req.body.employeeId);

  try {
    if (reviewer && req.body.reviewerId === res.locals.employee.id) {
      if (employee) {
        // Create a reviewObject to submit the review
        let reviewObject;
        
        // Check if the reviewer ID exists in the assigned reviewers of the employee
        if (employee.assigned_reviewers.includes(reviewer.id)) {
          reviewObject = await performanceReviewSchema.create({
            teamwork: req.body.teamworkRating,
            knowledge: req.body.knowledgeRating,
            communication: req.body.communicationRating,
            feedback: req.body.feedback,
            review_to: employee,
            reviewed_by: reviewer,
          });
          // Save the changes into the database
          await reviewObject.save();
        }

        // Remove the reviewed employee record from the assigned reviews of reviewers
        const index = await reviewer.assigned_reviews.indexOf(employee.id);
        if (index > -1) {
          // Only splice when the item is found
          reviewer.assigned_reviews.splice(index, 1); // 2nd parameter means remove one item only
        }
        await reviewer.save();

        // Remove the reviewer from the assigned reviewers of the employee
        const indexReviewer = await employee.assigned_reviewers.indexOf(reviewer.id);
        if (indexReviewer > -1) {
          // Only splice when the item is found
          employee.assigned_reviewers.splice(indexReviewer, 1); // 2nd parameter means remove one item only
        }
        await employee.save();

        // Save the updates to the reviewer and employee

        // Add the review record to the employee
        const employeeReviewRecord = await employeeSchema.findById(employee.id);
        employeeReviewRecord.reviews = reviewObject;
        await employeeReviewRecord.save();

        req.flash(
          "success",
          `${reviewer.name} successfully submitted feedback to ${employee.name}`
        );
        return res.redirect("/employee/home");
      } else {
        console.log("employee does not exist");
        req.flash("error", "employee does not exist");
        return res.redirect("/employee/home");
      }
    } else {
      req.flash("error", `Unauthorized access, login to continue`);
      return res.redirect("/sign-out");
    }
  } catch (error) {
    req.flash("error", "error in submitting feedback");
    return res.redirect("back");
  }
};

// Function to render the feedback form
module.exports.feedBackForm = async function (req, res) {
  try {
    // Find the data of the reviewer by id
    let reviewer = await employeeSchema.findById(req.params.reviewerId);

    // Find the data of the employee by id
    let emp = await employeeSchema.findById(req.params.employeeId);
    return res.render("feedback_Form", {
      title: "Feedback",
      emp: emp,
      reviewer: reviewer,
    });
  } catch (error) {
    console.log(error);
  }
};

// Function to render the home page
module.exports.home = async function (req, res) {
  try {
    let empId = res.locals.employee.id;
    const employeeDetails = await employeeSchema
      .findById(empId)
      .populate({
        path: "assigned_reviewers",
        model: "Employee"
      })
      .populate({
        path: "assigned_reviews",
        model: "Employee",
      });
    return res.render("home", {
      title: "ERS | Home",
      employeeDetails: employeeDetails
    });
  } catch (error) {
    console.log(error);
    return res.redirect('/sign-in');
  }
};

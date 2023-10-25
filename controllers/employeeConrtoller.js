const employeeSchema = require("../models/employeeModel");
const performanceReviewSchema = require("../models/performanceReview");
module.exports.submitFeedback = async function (req, res) {
  let reviewer = await employeeSchema.findById(req.body.reviewerId);

  //find the data of the employer by id
  let employee = await employeeSchema.findById(req.body.employeeId);

  try {
    if (reviewer && req.body.reviewerId === res.locals.employee.id) {
      if (employee) {
        //the review Objectto submitthe review
        let reviewObject;
        //if the reviewer id exsts new record for review
        if (employee.assigned_reviewers.includes(reviewer.id)) {
          reviewObject = await performanceReviewSchema.create({
            teamwork: req.body.teamworkRating,
            knowledge: req.body.knowledgeRating,
            communication: req.body.communicationRating,
            feedback: req.body.feedback,
            review_to: employee,
            reviewed_by: reviewer,
          });
          //save the changes into db
          await reviewObject.save();
        }

        //Remove the reviewed employee record from the assigned reviews of reviewers
        const index = await reviewer.assigned_reviews.indexOf(employee.id);
        if (index > -1) {
          // only splice when item is found
          reviewer.assigned_reviews.splice(index, 1); // 2nd parameter means remove one item only
        }
        await reviewer.save();

        //Remove the reviewer  from the assigned reviewers of employee
        const indexReviewer = await employee.assigned_reviewers.indexOf(
          reviewer.id
        );
        if (index > -1) {
          // only splice array when item is found
          employee.assigned_reviewers.splice(indexReviewer, 1); // 2nd parameter means remove one item only
        }
        await employee.save();

        //save the updates to reviewer and employee

        //add the review recordto the employee
        const employeeReviewRecord = await employeeSchema.findById(employee.id);
        employeeReviewRecord.reviews = reviewObject;
        await employeeReviewRecord.save();
        // console.log(reviewer.assigned_reviews.indexOf(employee.id));

        req.flash(
          "success",
          `${reviewer.name} succesfully submitted feedback to ${employee.name}`
        );
        return res.redirect("/employee/home");
      } else {
        console.log("employee does not exist");
        req.flash("error", "employee does not exist");
        return res.redirect("/employee/home");
      }
    } else {
      // console.log("unauthorised");
      req.flash("error", `Unauthorised access, login to continue`);
      return res.redirect("/sign-out");
    }
  } catch (error) {
    //console.log(error);
    req.flash("error", "error in submiting feedback");
    return res.redirect("back");
  }
};
module.exports.feedBackForm = async function (req, res) {
  try {
    //find the data of the reviewer by id
    let reviewer = await employeeSchema.findById(req.params.reviewerId);

    //find the data of the employee by id
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

module.exports.home = async function (req, res) {
  try{
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
  }
  catch(error){
    console.log(err);
    return res.redirect('/sign-in');
  }
};

const employeeSchema = require("../models/employeeModel");
const performanceReviewSchema = require('../models/performanceReview');
module.exports.submitFeedback = async function (req,res) {
  console.log(req.body);
  let reviewer = await employeeSchema.findById(req.body.reviewerId);

  //find the data of the employer by id
  let employee = await employeeSchema.findById(req.body.employeeId);
  console.log(res.locals.employee);
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
            feedback : req.body.feedback,
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

        // req.flash(
        //   "success",
        //   `${reviewer.name} succesfully submitted feedback to ${employee.name}`
        // );
        return res.redirect("/employee/home");
      } else {
        console.log("employee does not exist");
        req.flash("error", "employee does not exist");
        return res.redirect("/employee/home");
      }
    } else {
      console.log("unauthorised");
      //req.flash("error", `Unauthorised access, login to continue`);
      return res.redirect("/sign-out");
    }
  } catch (error) {
    console.log(error);
    //req.flash("error", "error in submiting feedback");
    return res.redirect("back" );
  }
}
module.exports.feedBackForm = async function (req,res) {
  try {
    //find the data of the reviewer by id
  let reviewer = await employeeSchema.findById(req.params.reviewerId);

  //find the data of the employee by id
  let emp = await employeeSchema.findById(req.params.employeeId);
  return res.render('feedback_Form',{
    title:'Feedback',
    emp:emp,
    reviewer:reviewer
  })
  
  } catch (error) {
    console.log(error);
  }
}
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/employee/home");
      }
  return res.render("employee_sign_up", {
    title: "ERS | Sign UP!",
  });
};
module.exports.create = function (req, res) {
  try {
    if (req.body.password != req.body.confirm_password) {
      return res.redirect("back");
    }
    employeeSchema.findOne({ email: req.body.email }).then((err, employee) => {
      if (err) {
        console.log("Employee already exist in db");
        return res.redirect("back");
      }
      if (!employee) {
        employeeSchema
          .create(req.body)
          .then(() => {
            console.log("Employee created successfully");
            res.redirect("back");
          })
          .catch((err) => {
            console.log("error in creating employee", err);
          });
      } else {
        console.log("error in line 25 employeeController");
        return res.redirect("back");
      }
    });
  } catch (error) {
    console.log("Error in employee creation", error);
    return res.redirect("back");
  }
};

module.exports.updateEmployee = async function (req, res) {
  try {
    if(res.locals.employee.userAccessType=='Admin'){
      const empId = req.params.id;
    const updatedEmployeeData = {
      name: req.body.name,
      email: req.body.email,
      userAccessType: req.body.role,
    };

    const employee = await employeeSchema.findByIdAndUpdate(
      empId,
      { $set: updatedEmployeeData }, // Use $set to update only specific fields
      { new: true } // This option returns the updated document
    );

    if (employee) {
      console.log("Employee updated:", employee);
      return res.redirect("back"); // Redirect to the previous page
    } else {
      console.log("No such Employee exists");
      return res.status(404).send("No such Employee exists");
    }
    }
  } catch (error) {
    console.log("Error in employee updation", error);
    return res.redirect("back");
  }
};

module.exports.home = async function (req, res) {
    let empId = res.locals.employee.id;
    const employeeDetails = await employeeSchema.findById(empId).populate({
      path: "assigned_reviewers",
      model: "Employee",
    })
    .populate({
      path: "assigned_reviews",
      model: "Employee",
    });
    return res.render("home", {
      title: "ERS | Home",
      employeeDetails:employeeDetails
    });
  
  
};
module.exports.deleteEmployee = async function (req, res) {
  try {
    let empId = req.params.id;
    if (empId) {
      let employee = await employeeSchema.findByIdAndRemove(empId);
      if (employee) {
        console.log("Employee Deleted successfully");
        res.redirect("/adminHome");
      } else {
        console.log("Employee doesnt exist");
        res.redirect("back");
      }
    } else {
      console.log("params id error");
      res.redirect("back");
    }
  } catch (error) {
    console.log(error);
    res.redirect("back");
  }
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
    let emp = await employeeSchema.findOne({email:req.body.email});
    let userAccessType = emp.userAccessType;
    console.log("Sign in successfull");
    if(userAccessType== 'Employee'){
        return res.redirect('/employee/home');
        // return res.render("home", {
        //     title: "ERS | Sign IN",
        //     Heading: "Emp Home",
        //     Employee : emp
        //   });
    }
    else if(userAccessType=='Admin'){
        return res.redirect('/adminHome');
        // let employeeList = await employeeSchema.find({});
        // return res.render("adminHome",{
        //     title:"Admin Home",
        //     employeeList: employeeList,
        //     Admin: emp
        // });
    }
    
  } catch (error) {
    console.log(error);
  }
};

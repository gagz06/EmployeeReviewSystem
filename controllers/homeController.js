const employeeSchema = require('../models/employeeModel');
const performanceReviewSchema = require('../models/performanceReview');

module.exports.deleteFeedback = async function (req,res) {
  try {
    if(req.params.id){
      let reviewId = req.params.id;
      let empId = req.params.from;
      let review = await performanceReviewSchema.findByIdAndDelete(reviewId);
      if(review){
        return res.redirect(`/manageReview/${empId}`);
      }
      else{
        return res.redirect('back');
      }
    }
  } catch (error) {
    console.log(error);
  }
}
module.exports.updateFeedback = async function (req,res) {
  if(req.params.id){
    let updatedReview = await performanceReviewSchema.findById(req.params.id);
    let emp= await employeeSchema.findById(req.params.from);
    if (updatedReview) {
        const feedback= req.body.feedback;
        const teamwork=req.body.teamworkRating;
        const knowledge= req.body.knowledgeRating;
        const communication= req.body.communicationRating;
        updatedReview.feedback=feedback;
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
      return res.render("updateReview",{
        title:"Edit Feedback",
        review: updatedReview,
        emp:emp
      });
    }
    else{
      req.flash("error", "Feedback not found");
      return res.redirect('back');
    }
  }
}

module.exports.updatReviewPage = async function(req,res){
  let review = await performanceReviewSchema.findById(req.params.id)
  .populate({
    path: "reviewed_by",
    model: "Employee",
  })
  .populate({
    path: "review_to",
    model: "Employee",
  });
  let emp = await employeeSchema.findById(req.params.from);
  //console.log(emp);
  return res.render("updateReview",{
    title:"Edit Feedback",
    review: review,
    emp: emp
  })
}

module.exports.submitFeedback = async function (req,res) {
  
  let reviewer = await employeeSchema.findById(req.body.reviewerId);

  //find the data of the employer by id
  let employee = await employeeSchema.findById(req.body.employeeId);
  // console.log("-----------------");
  // console.log(req.body);
  try {
    if (reviewer && req.body.reviewerId === res.locals.employee.id) {
      if (employee) {
          let reviewObject = await performanceReviewSchema.create({
            teamwork: req.body.teamworkRating,
            knowledge: req.body.knowledgeRating,
            communication: req.body.communicationRating,
            feedback : req.body.feedback,
            review_to: employee,
            reviewed_by: reviewer,
          });
          //save the changes into db
          await reviewObject.save();
           //add the review recordto the employee
        const employeeReviewRecord = await employeeSchema.findById(employee.id);
        employeeReviewRecord.reviews = reviewObject;
        await employeeReviewRecord.save();
        // console.log(reviewer.assigned_reviews.indexOf(employee.id));

        req.flash(
          "success",
          `${reviewer.name} succesfully submitted feedback to ${employee.name}`
        );
        return res.redirect("/adminHome");
        

       
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

module.exports.adminFeedBackForm = async function (req,res) {
  let emp = await employeeSchema.findById(req.params.employeeId);
  let reviewer = await employeeSchema.findById(res.locals.employee.id);
  return res.render("feedback_Form",{
    title: "Admin Feedback",
    emp:emp,
    reviewer: reviewer
  })
}
module.exports.signOut = function (req,res) {
    req.logout(function (err) {
        if (err) {
          return next(err);
        }
        req.flash("success", "Signed Out successfully");
        res.redirect('/employee/sign-in');
});
}
module.exports.adminHome = async function (req,res) {
    try {
        if (req.isAuthenticated()) {
            if (res.locals.employee.userAccessType=='Admin') {
                //console.log(res.locals.employee);
            let employeeList = await employeeSchema.find({});
            let filteredEmployeeList = employeeList.filter(employee => employee.id !== res.locals.employee.id);
            filteredEmployeeList = filteredEmployeeList.filter(employee => employee.userAccessType !== 'Admin');
            let performanceReviewList = await performanceReviewSchema.find({}).populate({
              path: "reviewed_by",
              model: "Employee",
            })
            .populate({
              path: "review_to",
              model: "Employee",
            });
            //console.log(performanceReviewList);
        return res.render("adminHome",{
            title:"Admin Home",
            employeeList: filteredEmployeeList,
            performanceReviewList:performanceReviewList
        })

            } else {
                return res.redirect('/employee/home');
            }
        }
        else{
            res.redirect('/employee/sign-in');
        }
    } catch (error) {
        console.log(error);
         return res.redirect('back');
    }
}

module.exports.manageUser = async function(req,res){
    try {
        const userId= req.params.id;
        let employee = await employeeSchema.findById(userId);
        if(employee){
            //console.log(employee);
            res.render("manageUser",{
                title:"Manage User",
                emp:employee
            })
        }
        else{
            console.log("Error in finding employee");
            return res.redirect('/adminHome');
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }
}

module.exports.manageReview = async function (req,res) {
    let employeeForReview = await employeeSchema.findById(req.params.id)
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
    
    let reviews = await performanceReviewSchema.find({ review_to: req.params.id })
    .populate({
      path: "reviewed_by",
      model: "Employee",
    })
    .populate({
      path: "review_to",
      model: "Employee",
    });
    // console.log(reviews);
    // console.log(employeeForReview.assigned_reviewers);
    let employeeList = await employeeSchema.find({});
    let filteredEmployeeList = employeeList.filter(employee => employee.id !== req.params.id);
    filteredEmployeeList = filteredEmployeeList.filter(employee => employee.userAccessType !== 'Admin');
    console.log(filteredEmployeeList);
    res.render('manageReview',{
        title: 'Manage Review',
        employeeList:filteredEmployeeList,
        employeeForReview:employeeForReview,
        reviews:reviews
    });
}

module.exports.assignReview = async function (req,res) {
    let admin = await employeeSchema.findById(res.locals.employee.id);
    let employeeToForFeedback = await employeeSchema.findById(req.params.toFeedback);
    let employeeForFeedback = await employeeSchema.findById(req.params.forFeedback);
    //console.log(admin);
    //console.log(employeeToForFeedback);
    //console.log(employeeForFeedback);
    if(admin && admin.userAccessType=='Admin'){
        if(employeeToForFeedback && employeeForFeedback){
            let assignedReviewList = employeeToForFeedback.assigned_reviews;
            let assignedReviewersList = employeeForFeedback.assigned_reviewers;
            let assignedReviewer = employeeForFeedback.assigned_reviewers.filter((a) => {
                return a.equals(employeeToForFeedback.id);
              });
              if(!assignedReviewer.length){
                assignedReviewList?.push(employeeForFeedback);
                await employeeToForFeedback.save();
      
                assignedReviewersList?.push(employeeToForFeedback);
                await employeeForFeedback.save();
              }
              const employee = await employeeSchema.findById(req.params.toFeedback)
          .populate({
            path: "assigned_reviewers",
            model: "Employee",
          })
          .populate({
            path: "assigned_reviews",
            model: "Employee",
          });

        // console.log(employeeToForFeedback.name+' is assigned to review '+employeeForFeedback.name);
        // console.log(employeeToForFeedback);
        // console.log(employeeForFeedback);
        req.flash(
          "success",
          `${employeeToForFeedback.name} is assigned to review ${employeeForFeedback.name}`
        );
        return res.redirect("back");
        }
        else{
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
    return res.redirect('back');
}
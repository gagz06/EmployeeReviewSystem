const employeeSchema = require('../models/employeeModel');
const performanceReviewSchema = require('../models/performanceReview');
module.exports.signOut = function (req,res) {
    req.logout(function (err) {
        if (err) {
          return next(err);
        }
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
            let performanceReviewList = await performanceReviewSchema.find({});
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
            console.log(employee);
            res.render("manageUser",{
                title:"Manage User",
                employee:employee
            })
        }
        else{
            console.log("Error in finding employee");
            return res.redirect('back');
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }
}

module.exports.manageReview = async function (req,res) {
    let employeeForReview = await employeeSchema.findById(req.params.id);
    let employeeList = await employeeSchema.find({});
    let filteredEmployeeList = employeeList.filter(employee => employee.id !== req.params.id);

    res.render('manageReview',{
        title: 'Manage Review',
        employeeList:filteredEmployeeList,
        employeeForReview:employeeForReview
    });
}

module.exports.assignReview = async function (req,res) {
    let admin = await employeeSchema.findById(res.locals.employee.id);
    let employeeToForFeedback = await employeeSchema.findById(req.params.toFeedback);
    let employeeForFeedback = await employeeSchema.findById(req.params.forFeedback);
    //console.log(admin);
    console.log(employeeToForFeedback);
    console.log(employeeForFeedback);
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

        console.log(employeeToForFeedback.name+' is assigned to review '+employeeForFeedback.name);
        console.log(employeeToForFeedback);
        console.log(employeeForFeedback);
        return res.redirect("back");
        }
        else{
            if (!employeeToForFeedback) {
                console.log("reviewer does not exist");
      
                
                return res.redirect("back");
              } else if (!employeeForFeedback) {
                console.log("employee does not exist");
      
                return res.redirect("/adminHome");
              }
        }
    }
    return res.redirect('back');
}
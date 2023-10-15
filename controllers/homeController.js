const employeeSchema = require('../models/employeeModel');

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
        return res.render("adminHome",{
            title:"Admin Home",
            employeeList: employeeList
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

module.exports.manageReview = function (req,res) {
    
}
const employeeSchema = require("../models/employeeModel");

module.exports.submitFeedback = async function (req,res) {
  console.log(req.body);
  res.redirect('back');
}
module.exports.feedBackForm = async function (req,res) {
  try {
    //find the data of the reviewer by id
  let reviewer = await employeeSchema.findById(req.params.reviewerId);

  //find the data of the employee by id
  let employee = await employeeSchema.findById(req.params.employeeId);
  return res.render('feedback_Form',{
    title:'Feedback',
    employee:employee,
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

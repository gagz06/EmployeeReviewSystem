const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const employeeSchema = require("../models/employeeModel");

//aurthentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    function(req,email,password,done){
        //find user and establish  the identity
        employeeSchema.findOne({email: email})
        .then((employee)=>{
            if(!employee||employee.password!=password){
                console.log('Invalid username/password');
                //req.flash('error','Invalid username/password');
                return done(null,false);
            }
            return done(null,employee);
        })
        .catch((err)=>{
            console.log('Error in finding user --> passport1');
            //req.flash('error',err);
            return done(err);
        });

    }
  )
);

//serializing the user  to decide which key is to be keptin cookies
passport.serializeUser(function (employee, done) {
  done(null, employee.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
  employeeSchema
    .findById(id)
    .then((employee) => {
      return done(null, employee);
    })
    .catch((err) => {
      console.log("Error in finding user --> passport2");
      return done(err);
    });
});

//check if user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // if user is signed in, then pass on the request to the next function(controller action)
  if (req.isAuthenticated()) {
    return next();
  }

  // if user is not authenticated
  return res.redirect("/employee/sign-in");
};
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user containes the current signed in user from the session cookie
    // and we are just sending this to the local views
    res.locals.employee = req.user;
  }
  next();
};

module.exports = passport;

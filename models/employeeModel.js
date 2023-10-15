const  mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    userAccessType:{
        type: String,
        enum: ['Admin', 'Employee'], 
        default: 'Employee',
        require: true
    },
     //Assigned reviews to user
     assigned_reviews: [
        {
          type: mongoose.Schema.Types.ObjectId,
          model: "User",
        },
      ],
      //Assigned reviewers to user
      assigned_reviewers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      //Reviews list of user
      reviews: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Review",
        },
      ]
},{
    timestamps: true
});

const Employee = mongoose.model('Employee',employeeSchema);
module.exports=Employee;
const mongoose = require('mongoose');
const performanceReviewSchema = new mongoose.Schema({
  //Feedback
  feedback: {
    type: "String",
  },
  //Review given to
  review_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  //Reviewed by
  reviewed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
},
{
  timestamps: true,
});

const performanceReview  =  mongoose.model("Review",performanceReviewSchema);

module.exports = performanceReview;
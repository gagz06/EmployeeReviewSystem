const mongoose = require('mongoose');
const performanceReviewSchema = new mongoose.Schema({

  //teamwork rating
  teamwork: {
    type: Number,
    required: true,
  },
  //work knowledge rating
  knowledge: {
    type: Number,
    required: true,
  },
  //communication with team rating
  communication: {
    type: Number,
    required: true,
  },
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
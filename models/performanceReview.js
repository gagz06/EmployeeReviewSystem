const mongoose = require('mongoose');

// Define the performance review schema
const performanceReviewSchema = new mongoose.Schema({
    // Teamwork rating
    teamwork: {
        type: Number,
        required: true,
    },
    // Work knowledge rating
    knowledge: {
        type: Number,
        required: true,
    },
    // Communication with team rating
    communication: {
        type: Number,
        required: true,
    },
    // Feedback
    feedback: {
        type: "String", // Typo: Should be "type: String" instead of "type: 'String'"
    },
    // Review given to (Reference to Employee)
    review_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee", // Reference to the Employee model
        required: true,
    },
    // Reviewed by (Reference to Employee)
    reviewed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee", // Reference to the Employee model
        required: true,
    },
}, {
    timestamps: true, // Include timestamps for created and updated fields
});

// Create the PerformanceReview model using the performance review schema
const performanceReview = mongoose.model("Review", performanceReviewSchema);

module.exports = performanceReview;

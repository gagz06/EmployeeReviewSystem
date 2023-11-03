const mongoose = require("mongoose");

// Define the employee schema
const employeeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    userAccessType: {
        type: String,
        enum: ['Admin', 'Employee'], // User access type can be 'Admin' or 'Employee'
        default: 'Employee', // Default value is 'Employee'
        required: true
    },
    // Assigned reviews to user
    assigned_reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            model: "User",
        },
    ],
    // Assigned reviewers to user
    assigned_reviewers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    // Reviews list of user
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ]
}, {
    timestamps: true // Include timestamps for created and updated fields
});

// Create the Employee model using the employee schema
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;

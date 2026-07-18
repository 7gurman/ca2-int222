const mongoose = require("mongoose");

const ALLOWED_STATUSES = ["Pending", "In Progress", "Submitted", "Approved", "Rejected"];

const projectSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student Name is required"],
      trim: true,
      minlength: [2, "Student Name must be at least 2 characters long"],
      maxlength: [100, "Student Name cannot exceed 100 characters"],
    },
    registrationNumber: {
      type: String,
      required: [true, "Registration Number is required"],
      trim: true,
      unique: true,
      match: [/^[A-Za-z0-9\/-]+$/, "Registration Number has an invalid format"],
    },
    projectTitle: {
      type: String,
      required: [true, "Project Title is required"],
      trim: true,
      minlength: [3, "Project Title must be at least 3 characters long"],
      maxlength: [200, "Project Title cannot exceed 200 characters"],
    },
    technologyUsed: {
      type: String,
      required: [true, "Technology Used is required"],
      trim: true,
    },
    submissionDate: {
      type: Date,
      required: [true, "Submission Date is required"],
    },
    projectStatus: {
      type: String,
      required: [true, "Project Status is required"],
      enum: {
        values: ALLOWED_STATUSES,
        message: `Project Status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
      },
      default: "Pending",
    },
  },
  {
    timestamps: true, 
  }
);

projectSchema.statics.ALLOWED_STATUSES = ALLOWED_STATUSES;

module.exports = mongoose.model("Project", projectSchema);

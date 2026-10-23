const mongoose = require("mongoose");

const applicationStatuses = [
  "WISHLIST",
  "APPLIED",
  "ASSESSMENT",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: applicationStatuses,
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    location: {
      type: String,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
      default: "FULL_TIME",
    },
    workMode: {
      type: String,
      enum: ["ONSITE", "HYBRID", "REMOTE"],
      default: "ONSITE",
    },
    salary: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },
    jobUrl: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: [
        "LINKEDIN",
        "COMPANY_WEBSITE",
        "REFERRAL",
        "JOB_PORTAL",
        "OTHER",
      ],
      default: "OTHER",
    },
    status: {
      type: String,
      enum: applicationStatuses,
      default: "APPLIED",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    nextAction: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: function () {
        return [
          {
            status: this.status,
            changedAt: this.appliedAt || new Date(),
          },
        ];
      },
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ user: 1, appliedAt: -1 });
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1, company: 1 });

module.exports = mongoose.model("Application", applicationSchema);
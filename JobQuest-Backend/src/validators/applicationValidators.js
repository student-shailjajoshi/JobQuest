const { body, query, param } = require("express-validator");

const APPLICATION_STATUSES = [
  "WISHLIST",
  "APPLIED",
  "ASSESSMENT",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

const JOB_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "INTERNSHIP",
  "CONTRACT",
];

const WORK_MODES = ["ONSITE", "HYBRID", "REMOTE"];

const SOURCES = [
  "LINKEDIN",
  "COMPANY_WEBSITE",
  "REFERRAL",
  "JOB_PORTAL",
  "OTHER",
];

const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

const SORT_FIELDS = ["appliedAt", "createdAt", "updatedAt", "role"];

const validateApplicationId = [
  param("id").isMongoId().withMessage("Invalid application ID"),
];

const validateCreateApplication = [
  body("role")
    .exists()
    .withMessage("Job role is required")
    .bail()
    .isString()
    .withMessage("Job role must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Job role cannot be empty")
    .bail()
    .isLength({ max: 150 })
    .withMessage("Job role cannot exceed 150 characters"),

  body("company")
    .exists()
    .withMessage("Company ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid company ID"),

  body("status")
    .optional()
    .isIn(APPLICATION_STATUSES)
    .withMessage("Invalid application status"),

  body("jobType")
    .optional()
    .isIn(JOB_TYPES)
    .withMessage("Invalid job type"),

  body("workMode")
    .optional()
    .isIn(WORK_MODES)
    .withMessage("Invalid work mode"),

  body("source")
    .optional()
    .isIn(SOURCES)
    .withMessage("Invalid application source"),

  body("priority")
    .optional()
    .isIn(PRIORITIES)
    .withMessage("Priority must be LOW, MEDIUM, or HIGH"),

  body("salary")
    .optional({ values: "null" })
    .isFloat({ min: 0 })
    .withMessage("Salary must be a non-negative number")
    .toFloat(),

  body("currency")
    .optional()
    .isString()
    .withMessage("Currency must be a string")
    .bail()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency must be a 3-letter currency code")
    .customSanitizer((value) => value.toUpperCase()),

  body("location")
    .optional({ values: "null" })
    .isString()
    .withMessage("Location must be a string")
    .bail()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Location cannot exceed 150 characters"),

  body("jobUrl")
    .optional({ values: "null" })
    .isString()
    .withMessage("Job URL must be a string")
    .bail()
    .trim()
    .custom((value) => {
      if (value === "") return true;

      try {
        const url = new URL(value);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error();
        }

        return true;
      } catch {
        throw new Error("Please provide a valid HTTP or HTTPS job URL");
      }
    }),

  body("appliedAt")
    .optional()
    .isISO8601()
    .withMessage("Applied date must be a valid ISO 8601 date")
    .toDate(),

  body("followUpDate")
    .optional({ values: "null" })
    .isISO8601()
    .withMessage("Follow-up date must be a valid ISO 8601 date")
    .toDate(),

  body("nextAction")
    .optional({ values: "null" })
    .isString()
    .withMessage("Next action must be a string")
    .bail()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Next action cannot exceed 500 characters"),

  body("notes")
    .optional({ values: "null" })
    .isString()
    .withMessage("Notes must be a string")
    .bail()
    .isLength({ max: 5000 })
    .withMessage("Notes cannot exceed 5000 characters"),
];

const validateUpdateApplication = [
  body("role")
    .optional()
    .isString()
    .withMessage("Job role must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Job role cannot be empty")
    .bail()
    .isLength({ max: 150 })
    .withMessage("Job role cannot exceed 150 characters"),

  body("company")
    .optional()
    .isMongoId()
    .withMessage("Invalid company ID"),

  body("status")
    .not()
    .exists()
    .withMessage("Use the status endpoint to update application status"),

  body("jobType")
    .optional()
    .isIn(JOB_TYPES)
    .withMessage("Invalid job type"),

  body("workMode")
    .optional()
    .isIn(WORK_MODES)
    .withMessage("Invalid work mode"),

  body("source")
    .optional()
    .isIn(SOURCES)
    .withMessage("Invalid application source"),

  body("priority")
    .optional()
    .isIn(PRIORITIES)
    .withMessage("Priority must be LOW, MEDIUM, or HIGH"),

  body("salary")
    .optional({ values: "null" })
    .isFloat({ min: 0 })
    .withMessage("Salary must be a non-negative number")
    .toFloat(),

  body("currency")
    .optional()
    .isString()
    .withMessage("Currency must be a string")
    .bail()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency must be a 3-letter currency code")
    .customSanitizer((value) => value.toUpperCase()),

  body("location")
    .optional({ values: "null" })
    .isString()
    .withMessage("Location must be a string")
    .bail()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Location cannot exceed 150 characters"),

  body("jobUrl")
    .optional({ values: "null" })
    .isString()
    .withMessage("Job URL must be a string")
    .bail()
    .trim()
    .custom((value) => {
      if (value === "") return true;

      try {
        const url = new URL(value);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error();
        }

        return true;
      } catch {
        throw new Error("Please provide a valid HTTP or HTTPS job URL");
      }
    }),

  body("appliedAt")
    .optional()
    .isISO8601()
    .withMessage("Applied date must be a valid ISO 8601 date")
    .toDate(),

  body("followUpDate")
    .optional({ values: "null" })
    .isISO8601()
    .withMessage("Follow-up date must be a valid ISO 8601 date")
    .toDate(),

  body("nextAction")
    .optional({ values: "null" })
    .isString()
    .withMessage("Next action must be a string")
    .bail()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Next action cannot exceed 500 characters"),

  body("notes")
    .optional({ values: "null" })
    .isString()
    .withMessage("Notes must be a string")
    .bail()
    .isLength({ max: 5000 })
    .withMessage("Notes cannot exceed 5000 characters"),
];

const validateUpdateApplicationStatus = [
  body("status")
    .exists()
    .withMessage("Status is required")
    .bail()
    .isIn(APPLICATION_STATUSES)
    .withMessage("Invalid application status"),

  body("note")
    .optional({ values: "null" })
    .isString()
    .withMessage("Status note must be a string")
    .bail()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Status note cannot exceed 1000 characters"),
];

const validateApplicationQuery = [
  query("status")
    .optional()
    .isIn(APPLICATION_STATUSES)
    .withMessage("Invalid application status"),

  query("jobType")
    .optional()
    .isIn(JOB_TYPES)
    .withMessage("Invalid job type"),

  query("workMode")
    .optional()
    .isIn(WORK_MODES)
    .withMessage("Invalid work mode"),

  query("company")
    .optional()
    .isMongoId()
    .withMessage("Invalid company ID"),

  query("search")
    .optional()
    .isString()
    .withMessage("Search must be a string")
    .bail()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search cannot exceed 100 characters"),

  query("location")
    .optional()
    .isString()
    .withMessage("Location must be a string")
    .bail()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Location cannot exceed 150 characters"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),

  query("sortBy")
    .optional()
    .isIn(SORT_FIELDS)
    .withMessage("Invalid sort field"),
];

module.exports = {
  validateApplicationId,
  validateCreateApplication,
  validateUpdateApplication,
  validateUpdateApplicationStatus,
  validateApplicationQuery,
};
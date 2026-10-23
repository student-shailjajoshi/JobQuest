const { body, query, param } = require("express-validator");

const validateCompanyId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid company ID"),
];

const validateCreateCompany = [
  body("name")
    .exists()
    .withMessage("Company name is required")
    .bail()
    .isString()
    .withMessage("Company name must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Company name cannot be empty")
    .bail()
    .isLength({ max: 150 })
    .withMessage("Company name cannot exceed 150 characters"),

  body("website")
    .optional({ values: "null" })
    .isString()
    .withMessage("Website must be a string")
    .bail()
    .trim()
    .custom((value) => {
      if (value === "") return true;

      try {
        const url = new URL(value);
        return ["http:", "https:"].includes(url.protocol);
      } catch {
        throw new Error("Please provide a valid website URL");
      }
    }),

  body("industry")
    .optional({ values: "null" })
    .isString()
    .withMessage("Industry must be a string")
    .bail()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Industry cannot exceed 150 characters"),

  body("location")
    .optional({ values: "null" })
    .isString()
    .withMessage("Location must be a string")
    .bail()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Location cannot exceed 150 characters"),

  body("notes")
    .optional({ values: "null" })
    .isString()
    .withMessage("Notes must be a string")
    .bail()
    .isLength({ max: 2000 })
    .withMessage("Notes cannot exceed 2000 characters"),
];

const validateUpdateCompany = [
  body("name")
    .optional()
    .isString()
    .withMessage("Company name must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Company name cannot be empty")
    .bail()
    .isLength({ max: 150 })
    .withMessage("Company name cannot exceed 150 characters"),

  body("website")
    .optional({ values: "null" })
    .isString()
    .withMessage("Website must be a string")
    .bail()
    .trim()
    .custom((value) => {
      if (value === "") return true;

      try {
        const url = new URL(value);
        return ["http:", "https:"].includes(url.protocol);
      } catch {
        throw new Error("Please provide a valid website URL");
      }
    }),

  body("industry")
    .optional({ values: "null" })
    .isString()
    .withMessage("Industry must be a string")
    .bail()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Industry cannot exceed 150 characters"),

  body("location")
    .optional({ values: "null" })
    .isString()
    .withMessage("Location must be a string")
    .bail()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Location cannot exceed 150 characters"),

  body("notes")
    .optional({ values: "null" })
    .isString()
    .withMessage("Notes must be a string")
    .bail()
    .isLength({ max: 2000 })
    .withMessage("Notes cannot exceed 2000 characters"),
];

const validateCompanyQuery = [
  query("search")
    .optional()
    .isString()
    .withMessage("Search must be a string")
    .bail()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search cannot exceed 100 characters"),

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
];

module.exports = {
  validateCompanyId,
  validateCreateCompany,
  validateUpdateCompany,
  validateCompanyQuery,
};
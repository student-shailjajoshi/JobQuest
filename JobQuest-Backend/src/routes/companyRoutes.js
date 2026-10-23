/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Manage companies associated with job applications
 */

/**
 * @swagger
 * /api/v1/companies:
 *   post:
 *     summary: Create a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 150
 *                 example: Google
 *               website:
 *                 type: string
 *                 example: https://google.com
 *               industry:
 *                 type: string
 *                 example: Technology
 *               location:
 *                 type: string
 *                 example: Bengaluru, India
 *               notes:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Applied through the company careers portal.
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Invalid company data
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: A company with this name already exists
 *
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search companies by name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Companies retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/companies/{id}/applications:
 *   get:
 *     summary: Get applications associated with a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company MongoDB ID
 *     responses:
 *       200:
 *         description: Company applications retrieved successfully
 *       400:
 *         description: Invalid company ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */

/**
 * @swagger
 * /api/v1/companies/{id}:
 *   get:
 *     summary: Get a company by ID
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company MongoDB ID
 *     responses:
 *       200:
 *         description: Company retrieved successfully
 *       400:
 *         description: Invalid company ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 *
 *   patch:
 *     summary: Update a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company MongoDB ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 150
 *                 example: Google India
 *               website:
 *                 type: string
 *                 example: https://google.com
 *               industry:
 *                 type: string
 *                 example: Technology
 *               location:
 *                 type: string
 *                 example: Bengaluru, India
 *               notes:
 *                 type: string
 *                 maxLength: 2000
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       400:
 *         description: Invalid company data or ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 *       409:
 *         description: A company with this name already exists
 *
 *   delete:
 *     summary: Delete a company
 *     description: Deletion may be prevented if the company has associated applications.
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company MongoDB ID
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       400:
 *         description: Invalid company ID or company has associated applications
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */

const express = require("express");

const {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  getCompanyApplications,
} = require("../controllers/companyController");

const authMiddleware = require("../middleware/authMiddleware");
const validateObjectId = require("../middleware/validateObjectId");
const validateRequest = require("../middleware/validateRequest");

const {
  validateCreateCompany,
  validateUpdateCompany,
  validateCompanyQuery,
} = require("../validators/companyValidators");

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .post(validateCreateCompany, validateRequest, createCompany)
  .get(validateCompanyQuery, validateRequest, getCompanies);

router.get(
  "/:id/applications",
  validateObjectId("id"),
  getCompanyApplications
);

router
  .route("/:id")
  .get(validateObjectId("id"), getCompany)
  .patch(
    validateObjectId("id"),
    validateUpdateCompany,
    validateRequest,
    updateCompany
  )
  .delete(validateObjectId("id"), deleteCompany);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Manage job applications, status history, and follow-ups
 */

/**
 * @swagger
 * /api/v1/applications:
 *   post:
 *     summary: Create a job application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *               - company
 *             properties:
 *               role:
 *                 type: string
 *                 maxLength: 150
 *                 example: Backend Developer
 *               company:
 *                 type: string
 *                 description: MongoDB ID of an existing company
 *                 example: 68e123456789abcdef123456
 *               location:
 *                 type: string
 *                 example: Bengaluru, India
 *               jobType:
 *                 type: string
 *                 enum: [FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT]
 *                 default: FULL_TIME
 *               workMode:
 *                 type: string
 *                 enum: [ONSITE, HYBRID, REMOTE]
 *                 default: ONSITE
 *               salary:
 *                 type: number
 *                 minimum: 0
 *                 example: 1200000
 *               currency:
 *                 type: string
 *                 example: INR
 *               jobUrl:
 *                 type: string
 *                 example: https://example.com/jobs/backend-developer
 *               source:
 *                 type: string
 *                 enum: [LINKEDIN, COMPANY_WEBSITE, REFERRAL, JOB_PORTAL, OTHER]
 *               status:
 *                 type: string
 *                 enum: [WISHLIST, APPLIED, ASSESSMENT, INTERVIEW, OFFER, REJECTED, WITHDRAWN]
 *                 default: APPLIED
 *               appliedAt:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 default: MEDIUM
 *               followUpDate:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               nextAction:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Application created successfully
 *       400:
 *         description: Invalid input or company ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 *
 *   get:
 *     summary: Get all job applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [WISHLIST, APPLIED, ASSESSMENT, INTERVIEW, OFFER, REJECTED, WITHDRAWN]
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *           enum: [FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT]
 *       - in: query
 *         name: workMode
 *         schema:
 *           type: string
 *           enum: [ONSITE, HYBRID, REMOTE]
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: Filter by company MongoDB ID
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search application roles
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
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [appliedAt, createdAt, updatedAt, role]
 *           default: appliedAt
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/applications/follow-ups:
 *   get:
 *     summary: Get upcoming and overdue follow-ups
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Follow-ups retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to retrieve follow-ups
 */

/**
 * @swagger
 * /api/v1/applications/{id}/status:
 *   patch:
 *     summary: Update an application's status
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application MongoDB ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [WISHLIST, APPLIED, ASSESSMENT, INTERVIEW, OFFER, REJECTED, WITHDRAWN]
 *               note:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *       400:
 *         description: Invalid ID or status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */

/**
 * @swagger
 * /api/v1/applications/{id}/history:
 *   get:
 *     summary: Get application status history
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application MongoDB ID
 *     responses:
 *       200:
 *         description: Application history retrieved successfully
 *       400:
 *         description: Invalid application ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */

/**
 * @swagger
 * /api/v1/applications/{id}:
 *   get:
 *     summary: Get a job application by ID
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application retrieved successfully
 *       400:
 *         description: Invalid application ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *
 *   patch:
 *     summary: Update a job application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *               company:
 *                 type: string
 *               location:
 *                 type: string
 *               jobType:
 *                 type: string
 *                 enum: [FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT]
 *               workMode:
 *                 type: string
 *                 enum: [ONSITE, HYBRID, REMOTE]
 *               salary:
 *                 type: number
 *                 minimum: 0
 *               currency:
 *                 type: string
 *               jobUrl:
 *                 type: string
 *               source:
 *                 type: string
 *                 enum: [LINKEDIN, COMPANY_WEBSITE, REFERRAL, JOB_PORTAL, OTHER]
 *               appliedAt:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               followUpDate:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               nextAction:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Application updated successfully
 *       400:
 *         description: Invalid input or application ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application or company not found
 *
 *   delete:
 *     summary: Delete a job application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *       400:
 *         description: Invalid application ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */

const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const validateObjectId = require("../middleware/validateObjectId");
const validateRequest = require("../middleware/validateRequest");

const {
  validateCreateApplication,
  validateUpdateApplication,
  validateUpdateApplicationStatus,
  validateApplicationQuery,
} = require("../validators/applicationValidators");

const {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  updateApplicationStatus,
  getApplicationHistory,
  deleteApplication,
  getFollowUps,
} = require("../controllers/applicationController");

const router = express.Router();

router.use(authMiddleware);

router.get("/follow-ups", getFollowUps);

router
  .route("/")
  .post(validateCreateApplication, validateRequest, createApplication)
  .get(validateApplicationQuery, validateRequest, getApplications);

router.patch(
  "/:id/status",
  validateObjectId("id"),
  validateUpdateApplicationStatus,
  validateRequest,
  updateApplicationStatus
);

router.get(
  "/:id/history",
  validateObjectId("id"),
  getApplicationHistory
);

router
  .route("/:id")
  .get(validateObjectId("id"), getApplication)
  .patch(
    validateObjectId("id"),
    validateUpdateApplication,
    validateRequest,
    updateApplication
  )
  .delete(validateObjectId("id"), deleteApplication);

module.exports = router;

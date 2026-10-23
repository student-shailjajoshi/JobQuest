/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Application tracking statistics and insights
 */

/**
 * @swagger
 * /api/v1/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieves an overview of the authenticated user's job applications, status distribution, top companies, and recent applications.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object
 *                       properties:
 *                         totalApplications:
 *                           type: integer
 *                           example: 42
 *                         submittedApplications:
 *                           type: integer
 *                           example: 25
 *                         wishlistCount:
 *                           type: integer
 *                           example: 8
 *                         weeklyApplications:
 *                           type: integer
 *                           example: 5
 *                         monthlyApplications:
 *                           type: integer
 *                           example: 18
 *                         interviewCount:
 *                           type: integer
 *                           example: 6
 *                         offerCount:
 *                           type: integer
 *                           example: 2
 *                         interviewRate:
 *                           type: number
 *                           example: 14.29
 *                         offerRate:
 *                           type: number
 *                           example: 4.76
 *                     statusDistribution:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           status:
 *                             type: string
 *                             enum:
 *                               - WISHLIST
 *                               - APPLIED
 *                               - ASSESSMENT
 *                               - INTERVIEW
 *                               - OFFER
 *                               - REJECTED
 *                               - WITHDRAWN
 *                           count:
 *                             type: integer
 *                             example: 10
 *                     topCompanies:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           company:
 *                             type: string
 *                             example: Google
 *                           count:
 *                             type: integer
 *                             example: 5
 *                     recentApplications:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 66b7f1234567890123456789
 *                           role:
 *                             type: string
 *                             example: Backend Developer
 *                           status:
 *                             type: string
 *                             example: INTERVIEW
 *                           company:
 *                             type: object
 *       401:
 *         description: Missing or invalid authentication token
 *       500:
 *         description: Internal server error
 */

const express = require("express");
const { getDashboard } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getDashboard);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration, login, and profile management
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Shashank Pandey
 *               email:
 *                 type: string
 *                 format: email
 *                 example: shashank@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 maxLength: 128
 *                 example: StrongPassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid registration data
 *       409:
 *         description: Email is already registered
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in to an existing account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: shashank@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPassword123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Missing or invalid authentication token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

const express = require("express");

const {
  register,
  login,
  getMe,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const {
  validateRegister,
  validateLogin,
} = require("../validators/authValidators");

const router = express.Router();

router.post("/register", validateRegister, validateRequest, register);

router.post("/login", validateLogin, validateRequest, login);

router.get("/me", authMiddleware, getMe);

module.exports = router;
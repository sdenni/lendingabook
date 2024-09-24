const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { authenticateToken, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Get all members
 *     tags:
 *       - Member
 *     responses:
 *       200:
 *         description: List of members
 */
router.get('/', authenticateToken, adminOnly, memberController.getAllMembers);

/**
 * @swagger
 * /api/members:
 *   post:
 *     summary: Create a new member
 *     tags:
 *       - Member
 *     parameters:
 *       - in: body
 *         name: member
 *         description: Member details
 *         schema:
 *           type: object
 *           required:
 *             - code
 *             - name
 *           properties:
 *             code:
 *               type: string
 *             name:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       201:
 *         description: Created member
 */
router.post('/', authenticateToken, memberController.createMember);

module.exports = router;

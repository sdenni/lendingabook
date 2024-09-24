const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Get all members
 *     responses:
 *       200:
 *         description: List of members
 */
router.get('/', memberController.getAllMembers);

/**
 * @swagger
 * /api/members:
 *   post:
 *     summary: Create a new member
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
router.post('/', memberController.createMember);

/**
 * @swagger
 * /api/admin:
 *   post:
 *     summary: Create a new member
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
router.post('/', memberController.createAdmin);

module.exports = router;

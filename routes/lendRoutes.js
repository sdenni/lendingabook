const express = require('express');
const router = express.Router();
const LendController = require('../controllers/lendController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/lends:
 *   post:
 *     summary: Lend books to a member
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Lending
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberCode:
 *                 type: string
 *               bookCodes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Books lent successfully
 *       401: 
 *         description: Unauthorized, Bearer token is missing or invalid
 *       422:
 *         description: Unprocessable Entity, buku yang dipinjam lebih dari 2
 *       500:
 *         description: Failed to lend books
 */
router.post('/', authenticateToken, LendController.lendBooks);

/**
 * @swagger
 * /api/lends/return:
 *   post:
 *     summary: Return borrowed books
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Lending
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberCode:
 *                 type: string
 *               lendId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Books returned successfully
 *       401: 
 *         description: Unauthorized, Bearer token is missing or invalid
 *       500:
 *         description: Failed to return books
 */
router.post('/return', authenticateToken, LendController.returnBooks);

/**
 * @swagger
 * /api/lends/{lendId}/penalty:
 *   get:
 *     summary: Calculate penalty for late returns
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Lending
 *     parameters:
 *       - in: path
 *         name: lendId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Penalty amount
 *       401: 
 *         description: Unauthorized, Bearer token is missing or invalid
 *       500:
 *         description: Failed to calculate penalty
 */
router.get('/:lendId/penalty', authenticateToken, LendController.calculatePenalty);

module.exports = router;

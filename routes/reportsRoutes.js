const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const { authenticateToken, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /api/reports/books:
 *   get:
 *     summary: Get all books - Shows all existing books and quantities - Books that are being borrowed are not counted
 *     tags:
 *       - Reports
 *     responses:
 *       200:
 *         description: List of books - Shows all existing books and quantities - Books that are being borrowed are not counted
 */
router.get('/books', authenticateToken, adminOnly, reportsController.getBooks);

/**
 * @swagger
 * /api/reports/members:
 *   get:
 *     summary: Get all members - Shows all existing members - The number of books being borrowed by each member
 *     tags:
 *       - Reports
 *     responses:
 *       200:
 *         description: List of members - Shows all existing members - The number of books being borrowed by each member
 */
router.get('/members', authenticateToken, adminOnly, reportsController.getMembers);

module.exports = router;

const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticateToken, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: List of books
 *       401: 
 *         description: Unauthorized, Bearer token is missing or invalid
 */
router.get('/', authenticateToken, bookController.getAllBooks);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Books
 *     parameters:
 *       - in: body
 *         name: book
 *         description: Book details
 *         schema:
 *           type: object
 *           required:
 *             - code
 *             - title
 *             - author
 *             - stock
 *           properties:
 *             code:
 *               type: string
 *             title:
 *               type: string
 *             author:
 *               type: string
 *             stock:
 *               type: integer
 *     responses:
 *       201:
 *         description: Created book
 *       401: 
 *         description: Unauthorized, Bearer token is missing or invalid
 */
router.post('/', authenticateToken, adminOnly, bookController.createBook);

module.exports = router;

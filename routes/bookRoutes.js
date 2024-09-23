const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     responses:
 *       200:
 *         description: List of books
 */
router.get('/', bookController.getAllBooks);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
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
 */
router.post('/', bookController.createBook);

module.exports = router;

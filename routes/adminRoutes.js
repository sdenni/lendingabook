const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

/**
 * @swagger
 * /api/admin:
 *   post:
 *     summary: Create a new admin
 *     parameters:
 *       - in: body
 *         name: admin
 *         description: Admin details
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
 *         description: Created admin
 */
router.post('/', memberController.createAdmin);

module.exports = router;

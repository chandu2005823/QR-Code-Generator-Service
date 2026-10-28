const express = require('express');

const {
    generateQr,
    getHistory,
    deleteHistory
} = require('../controllers/qr.controller');

const qrRateLimiter = require(
    '../middleware/qr-rate-limit.middleware'
);

const validateQrRequest = require(
    '../middleware/qr-validation.middleware'
);

// Initialize the router BEFORE registering routes.
const router = express.Router();

/**
 * @openapi
 * /api/qr/generate:
 *   post:
 *     tags:
 *       - QR Codes
 *     summary: Generate a QR code
 *     description: Generates a PNG image and saves its details to history.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 maxLength: 2000
 *                 example: https://example.com
 *               size:
 *                 type: integer
 *                 enum: [200, 300, 500]
 *                 default: 300
 *               foreground:
 *                 type: string
 *                 default: '#000000'
 *               background:
 *                 type: string
 *                 default: '#FFFFFF'
 *               errorCorrectionLevel:
 *                 type: string
 *                 enum: [L, M, Q, H]
 *                 default: M
 *     responses:
 *       '200':
 *         description: QR code generated successfully.
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       '400':
 *         description: Invalid request data.
 *       '429':
 *         description: Too many requests.
 */
router.post(
    '/generate',
    qrRateLimiter,
    validateQrRequest,
    generateQr
);

/**
 * @openapi
 * /api/qr/history:
 *   get:
 *     tags:
 *       - QR Codes
 *     summary: Retrieve QR generation history
 *     responses:
 *       '200':
 *         description: History records retrieved successfully.
 *       '500':
 *         description: Unexpected server error.
 */
router.get('/history', getHistory);

/**
 * @openapi
 * /api/qr/history/{id}:
 *   delete:
 *     tags:
 *       - QR Codes
 *     summary: Delete a QR history record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       '200':
 *         description: History record deleted successfully.
 *       '400':
 *         description: Invalid history ID.
 *       '404':
 *         description: History record not found.
 */
router.delete('/history/:id', deleteHistory);

module.exports = router;
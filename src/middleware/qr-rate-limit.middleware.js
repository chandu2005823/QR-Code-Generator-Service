const rateLimit = require('express-rate-limit');

const qrRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 30,

    standardHeaders: 'draft-8',

    legacyHeaders: false,

    message: {
        status: 'error',
        message: 'Too many QR generation requests. Please try again later.'
    }
});

module.exports = qrRateLimiter;
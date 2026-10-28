const { NODE_ENV } = require('../config/env');

function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    const isMalformedJson =
        err.type === 'entity.parse.failed';

    if (isMalformedJson) {
        return res.status(400).json({
            status: 'error',
            message: 'Request body contains invalid JSON.'
        });
    }

    const statusCode =
        Number.isInteger(err.statusCode) &&
        err.statusCode >= 400 &&
        err.statusCode < 600
            ? err.statusCode
            : 500;

    if (statusCode >= 500) {
        console.error({
            message: err.message,
            stack: err.stack,
            method: req.method,
            path: req.originalUrl
        });
    } else if (NODE_ENV === 'development') {
        console.warn({
            message: err.message,
            method: req.method,
            path: req.originalUrl
        });
    }

    const responseMessage =
        statusCode >= 500
            ? 'An unexpected server error occurred.'
            : err.message;

    const response = {
        status: 'error',
        message: responseMessage
    };

    if (NODE_ENV === 'development' && statusCode >= 500) {
        response.debug = err.message;
    }

    return res.status(statusCode).json(response);
}

module.exports = errorHandler;
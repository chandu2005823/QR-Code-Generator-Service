const ALLOWED_SIZES = [200, 300, 500];

const ALLOWED_ERROR_LEVELS = ['L', 'M', 'Q', 'H'];

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

function validateQrRequest(req, res, next) {
    const body = req.body;

    if (
        body === null ||
        typeof body !== 'object' ||
        Array.isArray(body)
    ) {
        return res.status(400).json({
            status: 'error',
            message: 'Request body must be a JSON object.'
        });
    }

    const {
        text,
        size,
        foreground,
        background,
        errorCorrectionLevel
    } = body;

    if (typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Text must be a non-empty string.'
        });
    }

    if (text.trim().length > 2000) {
        return res.status(400).json({
            status: 'error',
            message: 'Text must not exceed 2000 characters.'
        });
    }

    if (
        size !== undefined &&
        !ALLOWED_SIZES.includes(size)
    ) {
        return res.status(400).json({
            status: 'error',
            message: 'Size must be 200, 300, or 500.'
        });
    }

    if (
        foreground !== undefined &&
        (
            typeof foreground !== 'string' ||
            !HEX_COLOR_PATTERN.test(foreground)
        )
    ) {
        return res.status(400).json({
            status: 'error',
            message: 'Foreground must be a valid six-digit hexadecimal color.'
        });
    }

    if (
        background !== undefined &&
        (
            typeof background !== 'string' ||
            !HEX_COLOR_PATTERN.test(background)
        )
    ) {
        return res.status(400).json({
            status: 'error',
            message: 'Background must be a valid six-digit hexadecimal color.'
        });
    }

    if (
        errorCorrectionLevel !== undefined &&
        !ALLOWED_ERROR_LEVELS.includes(errorCorrectionLevel)
    ) {
        return res.status(400).json({
            status: 'error',
            message: 'Error correction level must be L, M, Q, or H.'
        });
    }

    next();
}

module.exports = validateQrRequest;
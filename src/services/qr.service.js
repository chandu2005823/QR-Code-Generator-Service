const { createQrHistory } = require('../repositories/qr.repository');
const QRCode = require('qrcode');

const MAX_TEXT_LENGTH = 2000;

const ALLOWED_SIZES = [200, 300, 500];

const ALLOWED_ERROR_LEVELS = ['L', 'M', 'Q', 'H'];

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

async function generateQrCode(text, options = {}) {
if (typeof text !== 'string') {
const error = new Error('Text must be a string.');
error.statusCode = 400;
throw error;
}


const trimmedText = text.trim();

if (trimmedText.length === 0) {
    const error = new Error('Text cannot be empty.');
    error.statusCode = 400;
    throw error;
}

if (trimmedText.length > MAX_TEXT_LENGTH) {
    const error = new Error(
        `Text must not exceed ${MAX_TEXT_LENGTH} characters.`
    );

    error.statusCode = 400;
    throw error;
}

const {
    size = 300,
    foreground = '#000000',
    background = '#FFFFFF',
    errorCorrectionLevel = 'M'
} = options;

if (!ALLOWED_SIZES.includes(size)) {
    const error = new Error(
        `Size must be one of: ${ALLOWED_SIZES.join(', ')}.`
    );

    error.statusCode = 400;
    throw error;
}

if (
    typeof foreground !== 'string' ||
    !HEX_COLOR_PATTERN.test(foreground)
) {
    const error = new Error(
        'Foreground must be a valid six-digit hexadecimal color.'
    );

    error.statusCode = 400;
    throw error;
}

if (
    typeof background !== 'string' ||
    !HEX_COLOR_PATTERN.test(background)
) {
    const error = new Error(
        'Background must be a valid six-digit hexadecimal color.'
    );

    error.statusCode = 400;
    throw error;
}

if (!ALLOWED_ERROR_LEVELS.includes(errorCorrectionLevel)) {
    const error = new Error(
        'Error correction level must be L, M, Q, or H.'
    );

    error.statusCode = 400;
    throw error;
}

const imageBuffer = await QRCode.toBuffer(trimmedText, {
    type: 'png',
    width: size,
    margin: 2,
    errorCorrectionLevel,
    color: {
        dark: foreground,
        light: background
    }
});

const historyId = createQrHistory({
    text: trimmedText,
    size,
    foreground,
    background,
    errorCorrectionLevel
});

return {
    imageBuffer,
    historyId
};


}

module.exports = {
generateQrCode
};

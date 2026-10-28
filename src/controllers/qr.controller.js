const { generateQrCode } = require('../services/qr.service');
const {
    getQrHistory,
    deleteQrHistory
} = require('../repositories/qr.repository');

async function generateQr(req, res, next) {
    try {
        const {
            text,
            size,
            foreground,
            background,
            errorCorrectionLevel
        } = req.body || {};

        const result = await generateQrCode(text, {
            size,
            foreground,
            background,
            errorCorrectionLevel
        });

        res.set('Content-Type', 'image/png');

        res.set(
            'Content-Disposition',
            'inline; filename="qr-code.png"'
        );

        res.set(
            'X-QR-History-Id',
            String(result.historyId)
        );

        return res.status(200).send(result.imageBuffer);
    } catch (error) {
        next(error);
    }
}

function getHistory(req, res, next) {
    try {
        const history = getQrHistory();

        return res.status(200).json({
            status: 'success',
            count: history.length,
            data: history
        });
    } catch (error) {
        next(error);
    }
}

function deleteHistory(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'History ID must be a positive integer.'
            });
        }

        const deleted = deleteQrHistory(id);

        if (!deleted) {
            return res.status(404).json({
                status: 'error',
                message: 'QR history record not found.'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'QR history record deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    generateQr,
    getHistory,
    deleteHistory
};
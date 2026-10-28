const db = require('../db/database');

// Prepare the SQL statement once.
const insertHistoryStatement = db.prepare(`
    INSERT INTO qr_history (
        text,
        size,
        foreground,
        background,
        error_correction_level
    )
    VALUES (
        @text,
        @size,
        @foreground,
        @background,
        @errorCorrectionLevel
    )
`);
const deleteHistoryStatement = db.prepare(`
    DELETE FROM qr_history
    WHERE id = ?
`);
function deleteQrHistory(id) {
    const result = deleteHistoryStatement.run(id);

    return result.changes > 0;
}
const getHistoryStatement = db.prepare(`
    SELECT
        id,
        text,
        size,
        foreground,
        background,
        error_correction_level AS errorCorrectionLevel,
        created_at AS createdAt
    FROM qr_history
    ORDER BY id DESC
    LIMIT 50
`);

function createQrHistory(record) {
    const result = insertHistoryStatement.run({
        text: record.text,
        size: record.size,
        foreground: record.foreground,
        background: record.background,
        errorCorrectionLevel: record.errorCorrectionLevel
    });

    return result.lastInsertRowid;
}

function getQrHistory() {
    return getHistoryStatement.all();
}

module.exports = {
    createQrHistory,
    getQrHistory,
    deleteQrHistory
};
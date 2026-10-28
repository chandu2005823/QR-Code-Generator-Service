const Database = require('better-sqlite3');
const fs = require('node:fs');
const path = require('node:path');

// Create the data directory if it does not exist.
const dataDirectory = path.join(__dirname, '..', '..', 'data');

fs.mkdirSync(dataDirectory, {
    recursive: true
});

// Define the database file location.
const databasePath = path.join(
    dataDirectory,
    'qr-history.db'
);

// Open or create the SQLite database.
const db = new Database(databasePath);

// Enable Write-Ahead Logging for database operations.
db.pragma('journal_mode = WAL');

// Create the history table if it does not exist.
db.exec(`
    CREATE TABLE IF NOT EXISTS qr_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        size INTEGER NOT NULL,
        foreground TEXT NOT NULL,
        background TEXT NOT NULL,
        error_correction_level TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`);

console.log('SQLite database initialized successfully.');

module.exports = db;
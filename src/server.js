require('dotenv').config();

const app = require('./app');
const { PORT, NODE_ENV } = require('./config/env');

const server = app.listen(PORT, () => {
    console.log(
        `QR Code Generator running on port ${PORT}`
    );

    console.log(`Environment: ${NODE_ENV}`);
});

function shutdown(signal) {
    console.log(`${signal} received. Shutting down...`);

    server.close((error) => {
        if (error) {
            console.error('Error while closing the server:', error);
            process.exitCode = 1;
        } else {
            console.log('HTTP server closed successfully.');
        }
    });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
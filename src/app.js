const helmet = require('helmet');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const qrRoutes = require('./routes/qr.routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(helmet());
app.use(express.static('public'));

app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => {
res.send('Welcome to the QR Code Generator API!');
});

app.get('/api/health', (req, res) => {
res.json({
status: 'success',
message: 'QR Code Generator API is running'
});
});

app.get('/api/about', (req, res) => {
res.json({
name: 'QR Code Generator',
version: '1.0.0',
description: 'A service for generating QR codes'
});
});

app.use('/api/qr', qrRoutes);

// Handle unknown endpoints
app.use((req, res) => {
res.status(404).json({
status: 'error',
message: 'Endpoint not found'
});
});

// Handle errors from routes and middleware
app.use(errorHandler);

module.exports = app;

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',

        info: {
            title: 'QR Code Generator API',
            version: '1.0.0',
            description:
                'API for generating QR codes and managing QR generation history.'
        },

        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local development server'
            }
        ],

        tags: [
            {
                name: 'Health',
                description: 'API health and information'
            },
            {
                name: 'QR Codes',
                description: 'QR code generation and history'
            }
        ]
    },

    apis: [
        './src/app.js',
        './src/routes/*.js'
    ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
const portValue = process.env.PORT || '3000';

const PORT = Number(portValue);

if (
    !Number.isInteger(PORT) ||
    PORT < 1 ||
    PORT > 65535
) {
    throw new Error('PORT must be an integer between 1 and 65535.');
}

const NODE_ENV = process.env.NODE_ENV || 'development';

const allowedEnvironments = [
    'development',
    'test',
    'production'
];

if (!allowedEnvironments.includes(NODE_ENV)) {
    throw new Error(
        'NODE_ENV must be development, test, or production.'
    );
}

module.exports = {
    PORT,
    NODE_ENV
};
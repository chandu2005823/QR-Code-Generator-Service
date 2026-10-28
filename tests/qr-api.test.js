const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../src/app');

test('GET /api/health returns a successful response', async () => {
const response = await request(app)
.get('/api/health');


assert.equal(response.status, 200);

assert.equal(
    response.body.status,
    'success'
);

assert.equal(
    response.body.message,
    'QR Code Generator API is running'
);


});

test('GET /api/about returns application information', async () => {
const response = await request(app)
.get('/api/about');


assert.equal(response.status, 200);
assert.equal(response.body.name, 'QR Code Generator');
assert.equal(response.body.version, '1.0.0');


});

test('POST /api/qr/generate returns a PNG image for valid text', async () => {
const response = await request(app)
.post('/api/qr/generate')
.send({
text: 'https://github.com/'
});


assert.equal(response.status, 200);

assert.match(
    response.headers['content-type'],
    /image\/png/
);

assert.ok(response.body.length > 0);

// PNG files begin with these eight signature bytes.
assert.deepEqual(
    response.body.subarray(0, 8),
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
);


});

test('POST /api/qr/generate rejects empty text', async () => {
const response = await request(app)
.post('/api/qr/generate')
.send({
text: ''
});


assert.equal(response.status, 400);
assert.equal(response.body.status, 'error');
assert.equal(response.body.message, 'Text cannot be empty.');


});

test('POST /api/qr/generate rejects missing text', async () => {
const response = await request(app)
.post('/api/qr/generate')
.send({});


assert.equal(response.status, 400);
assert.equal(response.body.status, 'error');


});

test('POST /api/qr/generate rejects unsupported image sizes', async () => {
const response = await request(app)
.post('/api/qr/generate')
.send({
text: 'Hello World',
size: 100000
});


assert.equal(response.status, 400);
assert.match(response.body.message, /Size must be one of/);


});

test('POST /api/qr/generate rejects invalid foreground colors', async () => {
const response = await request(app)
.post('/api/qr/generate')
.send({
text: 'Hello World',
size: 300,
foreground: 'blue'
});


assert.equal(response.status, 400);

assert.match(
    response.body.message,
    /valid six-digit hexadecimal color/
);


});

test('POST /api/qr/generate rejects invalid error correction levels', async () => {
const response = await request(app)
.post('/api/qr/generate')
.send({
text: 'Hello World',
size: 300,
foreground: '#000000',
background: '#FFFFFF',
errorCorrectionLevel: 'Z'
});


assert.equal(response.status, 400);

assert.match(
    response.body.message,
    /Error correction level must be L, M, Q, or H/
);


});

test('GET /api/unknown returns 404', async () => {
const response = await request(app)
.get('/api/unknown');


assert.equal(response.status, 404);
assert.equal(response.body.status, 'error');
assert.equal(response.body.message, 'Endpoint not found');


});


test('POST /api/qr/generate rejects whitespace-only text', async () => {
const response = await request(app)
.post('/api/qr/generate')
.send({
text: '     '
});


assert.equal(response.status, 400);
assert.equal(response.body.message, 'Text cannot be empty.');


});

test('POST /api/qr/generate rejects text exceeding the limit', async () => {
const response = await request(app)
.post('/api/qr/generate')
.send({
text: 'A'.repeat(2001)
});


assert.equal(response.status, 400);

assert.match(
    response.body.message,
    /must not exceed 2000 characters/
);


});

test('POST /api/qr/generate accepts supported customization options', async () => {
const response = await request(app)
.post('/api/qr/generate')
.send({
text: 'https://github.com/',
size: 500,
foreground: '#123456',
background: '#FFFFFF',
errorCorrectionLevel: 'H'
});


assert.equal(response.status, 200);

assert.match(
    response.headers['content-type'],
    /image\/png/
);

assert.deepEqual(
    response.body.subarray(0, 8),
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
);


});


test('POST /api/qr/generate rejects malformed JSON', async () => {
const response = await request(app)
.post('/api/qr/generate')
.set('Content-Type', 'application/json')
.send('{"text":');

assert.equal(response.status, 400);
assert.equal(response.body.status, 'error');
assert.equal(
    response.body.message,
    'An unexpected server error occurred.'
);


});

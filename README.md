# QR Code Generator Service

A QR Code Generator built with Node.js and Express.js. The application generates customizable QR codes, provides a web interface, and stores QR generation history using SQLite.

## Features

* Generate QR codes from text or URLs.
* Customize image size and foreground/background colors.
* Configure QR error-correction levels.
* Preview and download generated PNG images.
* Store QR generation metadata in SQLite.
* View recent QR generation history.
* Delete saved history records.
* Validate incoming requests.
* Apply rate limiting to QR generation.
* Configure HTTP security headers using Helmet.
* Explore API documentation through Swagger UI.
* Run automated API tests.

> Features should be listed as complete only after they have been implemented and tested successfully.

## Technology Stack

* Node.js
* Express.js
* JavaScript
* SQLite
* better-sqlite3
* HTML
* CSS
* Browser JavaScript
* Swagger UI
* Supertest
* Node.js Test Runner

## Project Structure

```text
qr-code-generator/
├── public/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
├── tests/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

* Node.js with a version compatible with the project's dependencies.
* npm.

Check your installed versions:

```bash
node --version
npm --version
```

## Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Enter the project directory:

```bash
cd qr-code-generator
```

Install dependencies:

```bash
npm install
```

Create your local environment file:

```powershell
Copy-Item .env.example .env
```

## Configuration

The application uses these environment variables:

| Variable | Purpose             | Example     |
| -------- | ------------------- | ----------- |
| PORT     | HTTP server port    | 3000        |
| NODE_ENV | Runtime environment | development |

## Run the Application

Start the development server:

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

## API Endpoints

| Method | Endpoint              | Description                    |
| ------ | --------------------- | ------------------------------ |
| GET    | `/api/health`         | Check API health               |
| GET    | `/api/about`          | Retrieve API information       |
| POST   | `/api/qr/generate`    | Generate a QR code             |
| GET    | `/api/qr/history`     | Retrieve QR generation history |
| DELETE | `/api/qr/history/:id` | Delete a history record        |

## Example Request

Generate a QR code:

```http
POST /api/qr/generate
Content-Type: application/json
```

```json
{
  "text": "https://example.com",
  "size": 300,
  "foreground": "#000000",
  "background": "#FFFFFF",
  "errorCorrectionLevel": "M"
}
```

A successful request returns a PNG image.

## API Documentation

When the application is running, open:

```text
http://localhost:3000/api-docs
```

## Run Tests

Execute the automated test suite:

```bash
npm test
```

## Database

The application uses SQLite to store QR generation metadata.

The database file is created locally and should not be committed to the public repository.

## Security Notes

* Do not commit `.env` or other files containing secrets.
* Avoid storing passwords, private tokens, or confidential data in QR codes.
* Protect history and deletion endpoints before exposing the application to multiple users.
* Use persistent storage and suitable backups when deploying the database.
* Use a shared rate-limit store when operating multiple server instances.

## Current Limitations

* The current design is a learning project and is not automatically suitable for public production deployment.
* QR history requires appropriate access controls for multi-user deployments.
* SQLite deployment requires persistent storage and a compatible runtime environment.

## License

Choose and add an appropriate open-source license before publishing the project as open source.

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Load environment variables from .env file
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Import API handlers
const brewfatherHandler = require('./api/brewfather');
const readingsHandler = require('./api/readings');

// Wrapper to adapt Vercel-style handlers to Node.js HTTP
function adaptVercelHandler(handler) {
    return (req, res) => {
        // Parse query parameters
        const parsedUrl = url.parse(req.url, true);
        req.query = parsedUrl.query;

        // Add Vercel-style response methods
        const originalRes = res;
        const adaptedRes = {
            status(code) {
                originalRes.statusCode = code;
                return this;
            },
            json(data) {
                originalRes.setHeader('Content-Type', 'application/json');
                originalRes.end(JSON.stringify(data));
                return this;
            },
            send(data) {
                originalRes.end(data);
                return this;
            },
            setHeader(name, value) {
                originalRes.setHeader(name, value);
                return this;
            }
        };

        // Call the Vercel handler with adapted request/response
        handler(req, adaptedRes);
    };
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // API Routes
    if (pathname === '/api/brewfather') {
        adaptVercelHandler(brewfatherHandler)(req, res);
    } else if (pathname === '/api/readings') {
        adaptVercelHandler(readingsHandler)(req, res);
    } 
    // Serve setup page
    else if (pathname === '/setup.html') {
        fs.readFile(path.join(__dirname, 'setup.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading setup page');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }
    // Serve main HTML file
    else if (pathname === '/' || pathname === '/index.html') {
        fs.readFile(path.join(__dirname, 'brewfather-dashboard.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading page');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } 
    // 404
    else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(PORT, () => {
    console.log(`\n🍺 Brewfather Dashboard running at http://localhost:${PORT}\n`);
    console.log(`Environment variables loaded:`);
    console.log(`  BREWFATHER_USER_ID: ${process.env.BREWFATHER_USER_ID ? '✓ Set' : '✗ Missing'}`);
    console.log(`  BREWFATHER_API_KEY: ${process.env.BREWFATHER_API_KEY ? '✓ Set' : '✗ Missing'}\n`);
});


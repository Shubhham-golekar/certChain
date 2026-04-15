require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const statusMonitor = require('express-status-monitor');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// Security and Monitoring Middleware
app.use(helmet());
app.use(statusMonitor()); // Available at /status
app.use(cors());
app.use(express.json());

// Set up SQLite Database
const dbPath = path.resolve(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS certificates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            to_name TEXT,
            student_wallet TEXT,
            course TEXT,
            issuer TEXT,
            grade TEXT,
            status TEXT DEFAULT 'Active',
            hash TEXT UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        console.log('✅ SQLite Database connected and table initialized.');
    }
});

// Rate limiting for the email endpoint to prevent abuse
const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
});

app.post('/api/index-cert', emailLimiter, async (req, res) => {
    const { to_name, student_wallet, course, issuer, hash, grade } = req.body;

    if (!student_wallet || !hash || !to_name || !course || !issuer || !grade) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Log to database indexing
        db.run(`INSERT INTO certificates (to_name, student_wallet, course, issuer, grade, hash) VALUES (?, ?, ?, ?, ?, ?)`,
            [to_name, student_wallet, course, issuer, grade, hash],
            (err) => {
                if (err) console.error('Failed to index certificate to DB:', err.message);
                else console.log('✅ Certificate indexed in DB:', hash.slice(0, 10));
            }
        );

        res.status(200).json({ message: 'Certificate indexed successfully!' });
    } catch (err) {
        console.error('Index error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// API config for Data Indexing the Frontend Dashboard
app.get('/api/certificates', (req, res) => {
    db.all(`SELECT * FROM certificates ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ certificates: rows });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ CertChain Backend running on http://localhost:${PORT}`);
    console.log(`📈 Monitoring available at http://localhost:${PORT}/status`);
});

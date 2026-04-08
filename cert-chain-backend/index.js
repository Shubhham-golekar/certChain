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
            to_email TEXT,
            course TEXT,
            issuer TEXT,
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

function sendBrevoEmail({ to_email, to_name, course, issuer, hash }) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({
            sender: { name: 'CertChain', email: 'aabc57743@gmail.com' },
            to: [{ email: to_email, name: to_name || 'Student' }],
            subject: `Your Certificate for ${course} is Ready! 🎓`,
            htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Congratulations ${to_name}! 🎉</h2>
          <p>You have been issued a blockchain-verified certificate for <strong>${course}</strong> by <strong>${issuer}</strong>.</p>
          <p style="margin-top:16px;">Your permanent Certificate Hash:</p>
          <div style="background: #f4f4f4; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 13px; word-break: break-all; margin: 12px 0; border-left: 4px solid #4CAF50;">
            <strong>${hash}</strong>
          </div>
          <p>Paste this hash in the <strong>CertChain Verify tab</strong> to verify your certificate anytime.</p>
          <hr style="border:0;border-top:1px solid #eee;margin:24px 0;" />
          <p style="font-size:12px;color:#888;">Powered by Stellar Soroban · CertChain dApp</p>
        </div>
      `,
        });

        const options = {
            hostname: 'api.brevo.com',
            path: '/v3/smtp/email',
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json',
                'content-length': Buffer.byteLength(body),
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Brevo API error ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

app.post('/send-email', emailLimiter, async (req, res) => {
    const { to_email, to_name, course, issuer, hash } = req.body;

    if (!to_email || !hash || !to_name || !course || !issuer) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await sendBrevoEmail({ to_email, to_name, course, issuer, hash });
        console.log(`✅ Email sent to ${to_email} | ID: ${result.messageId}`);

        // Log to database indexing
        db.run(`INSERT INTO certificates (to_name, to_email, course, issuer, hash) VALUES (?, ?, ?, ?, ?)`,
            [to_name, to_email, course, issuer, hash],
            (err) => {
                if (err) console.error('Failed to index certificate to DB:', err.message);
                else console.log('✅ Certificate indexed in DB:', hash.slice(0, 10));
            }
        );

        res.status(200).json({ message: 'Email sent successfully & certificate indexed!', messageId: result.messageId });
    } catch (err) {
        console.error('Email error:', err.message);
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

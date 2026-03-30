require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
app.use(cors());
app.use(express.json());

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

app.post('/send-email', async (req, res) => {
    const { to_email, to_name, course, issuer, hash } = req.body;

    if (!to_email || !hash) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await sendBrevoEmail({ to_email, to_name, course, issuer, hash });
        console.log(`✅ Email sent to ${to_email} | ID: ${result.messageId}`);
        res.status(200).json({ message: 'Email sent successfully!', messageId: result.messageId });
    } catch (err) {
        console.error('Email error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ CertChain Backend running on http://localhost:${PORT}`);
});

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'data.db');

// We will delete the old database to apply the new schema (wallet instead of email)
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('🗑️ Deleted old data.db');
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        process.exit(1);
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE certificates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        to_name TEXT,
        student_wallet TEXT,
        course TEXT,
        issuer TEXT,
        hash TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    const stmt = db.prepare(`INSERT INTO certificates (to_name, student_wallet, course, issuer, hash, created_at) VALUES (?, ?, ?, ?, ?, ?)`);

    const names = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Ananya', 'Diya', 'Kavya', 'Neha', 'Priya', 'Riya', 'Rahul', 'Rohan', 'Amit', 'Vikram', 'Sakshi', 'Simran', 'Ishaan', 'Aryan', 'Karan', 'Sneha', 'Rishabh', 'Aisha', 'Pooja', 'Tanvi', 'Vikas', 'Manish', 'Neha', 'Kunal', 'Shruti', 'Akash'];
    const courses = ['Blockchain Development', 'Web Development', 'Data Science', 'Machine Learning', 'Cybersecurity', 'Cloud Computing'];
    const issuers = ['IIT Bombay', 'MIT OpenCourseWare', 'Stanford Online', 'Coursera', 'Udemy', 'edX'];

    let count = 0;
    const now = Date.now();

    for (let i = 0; i < 35; i++) {
        const student_name = names[i % names.length] + ' ' + names[(i + 1) % names.length];
        const student_wallet = 'G' + Array.from({ length: 55 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('');
        const course = courses[Math.floor(Math.random() * courses.length)];
        const issuer = issuers[Math.floor(Math.random() * issuers.length)];
        const hash = Array.from({ length: 56 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('');

        // Random date within the last 30 days
        const randomPastTime = now - (Math.random() * 30 * 24 * 60 * 60 * 1000);
        const created_at = new Date(randomPastTime).toISOString().replace('T', ' ').split('.')[0];

        stmt.run([student_name, student_wallet, course, issuer, hash, created_at], (err) => {
            if (err) console.error(err);
            else count++;
        });
    }

    stmt.finalize(() => {
        console.log(`✅ Seeded ${count} verified active user certificates.`);
        db.close();
    });
});

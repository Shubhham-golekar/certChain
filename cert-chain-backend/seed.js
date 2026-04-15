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
        grade TEXT,
        status TEXT DEFAULT 'Active',
        hash TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    const stmt = db.prepare(`INSERT INTO certificates (to_name, student_wallet, course, issuer, grade, hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    const users = [
        {name: "Shubham Golekar", wallet: "GADY24FFOBCTVQJIBCP6OCX6QPVODAQM4IEMYUKS5VSVN564XQPSWXGY"},
        {name: "Harshal Jagdale", wallet: "GCATAASNFHODIKA4VTIEZHONZB3BGZJL42FXHHZ3VS6YKX2PCDIJ3LDY"},
        {name: "yuvraj vibhute", wallet: "GDIKNWX7PRCJHYSB3LQEQSWTZAXV4SEO6XPVY6FV64R3KFFASRT3A7W5"},
        {name: "Soham Ghuge", wallet: "GCZXHLXNKRQZ7FA3MV575L2OZ7UCYCMZCKKMBZN64MQ2XTD2TFCYHP2V"},
        {name: "Rushikesh Gaiwal", wallet: "GBXU3XKT5W66VJOTZBEINMAXQYGJ7HYNFWITQQ6VQKZBHDQ2EX5ACG2F"},
        {name: "Yash annadate", wallet: "GBWDGDXAN4AW22OBEQADIOSK2GE7EFNDLZDTBJV6AP33SEPTGNNGFDAE"},
        {name: "Sarthak Dhere", wallet: "GCRYPAQB3TFLQE727TA3R723QIEPTP5KCMP7OMH4HVXNLCEUKPD4AZJP"},
        {name: "Shritesh Patil", wallet: "GAGBMRVUN2IBMXJUFNGRD7BHWYQACCGXDVV6X4GXTNXQC5DGCRMW2CQ3"},
        {name: "Vaibhavi Agale", wallet: "GALWWEGHOMU5YODTZBVGPFP2OHCJH5VO3VKWNMW7ZNT6OECINVPQT7SQ"},
        {name: "om golekar", wallet: "GDUFDJ23MIR2KR6FC3VTKA7YTCLJAJY5GL2UIX35HCFCZUPJCW7ZT6K5"},
        {name: "Runav Phate", wallet: "GCHB2KGFMWFAM7HOQYUFNPQXAQMAY6U7OLXAP4BEJWIJWXBV6IDKB7DR"},
        {name: "Nandini Jadhav", wallet: "GCT3E7HUMKYVC2MXFURGRQJF5PMS4V6ZFZQORNW75L2TZIWFF2HM5CMH"},
        {name: "ved malkunaik", wallet: "GACUAJJ5XYAOHFRNASQU472IEZHMU5G37CLNPGKA7HK55MEFZV6ZJQ45"},
        {name: "Poorva Mulimani", wallet: "GBNOBRJ73DRVVHE4MJPDRIOVP3MZ7BHOO2ISZDMPJWDNHPCPVRZLRILT"},
        {name: "sudhakar sutar", wallet: "GALULA4PSYS4AVX7AIUDZ5IVUUWJAGT4BECMICA3JQMCO3HICKQEKJXS"},
        {name: "Samruddhi Nevse", wallet: "GDHOWWJM3ZU7XN7BF7IQFFXXFNN3Y2ZL7I4253F5KHTA5FFN57SFLMWZ"},
        {name: "Aryan Shirke", wallet: "GAH647NIZOC346BI6W5BQQ7ZCIZR3ZXWT2RDAVRGIGQLBHOSY4UPLF6H"},
        {name: "Sanket D", wallet: "GA3PMUXWSCWLT2FMQ76PODPODHLJHOWAHTD7JGOWHGGE5FZ3WWF6EJBO"},
        {name: "Shekhar Jadhav", wallet: "GCXZBKGVR5XATK2CVCXOXMHOBYUYLH5OUBADSMP4XN2ID6TN6N7ZL52M"},
        {name: "Akanksha shinde", wallet: "GCPQV7JCPIEQNXYRY54BCT3M7L24EM5XVJNSQAGXRFOKQJI7Z3E6LYLZ"},
        {name: "Nikhil Dhokane", wallet: "GAF4SUBPSJL6QATQILXS6JK7X4A6J6FA3UXOR2A2FQM6U2QMQNJ5TYPH"},
        {name: "Ronit Arune", wallet: "GCLNJPXUXC5QYY47CPZZUAHKAXSFKKI2X4EUEAMPRDKD6OLRGXQQQREY"},
        {name: "Sugat", wallet: "GBIXQLFE54OK32JKGLK3MLEAJ35IIX6RVHJV4YWALBCWKEYXOWEDXE2P"},
        {name: "krishna latelwar", wallet: "GANBGUREB5ZAY26ZIAB6VHVQ7CG4KNQMEILZUG2ZWLEPF3DUARLMRHBS"},
        {name: "Himanshu Jaware", wallet: "GBTBZDY7OIOYMINOYHHZVHGJOASPL4BQL5U4B6NP3LLHMKDXO6BSYBDH"},
        {name: "Mahesh patil", wallet: "GCG4FCF4UB74JJXVWHFXIENK6DKGIXQZ3563RRMK2VH5EU4TBEM7YSG7"},
        {name: "Satish Khedkar", wallet: "GAYO3AHUNNQDP6RRZG4OAGBLY723JKAEDYQ247Q65XIFBVHDRGXXX4MV"},
        {name: "janhavi lipare", wallet: "GBLUMAX4IIPS54AIGD5WXRRAXISG4HLV3BE3YR3SQAD3GZSXRTVJY5GI"},
        {name: "Jadhav Vaibhavi Ajay", wallet: "GDJ6VJX3OVJJLIF2J2JRBBDD6PYAZNLAMJIDOLJQSWTUCGDSKEBOEOFP"},
        {name: "Siddharth Gaikwad", wallet: "GCEUIM5JT65THJO6TCRNH37VYPXNJQ7NQICETMV7235R4JARE3PTIZ27"},
        {name: "Meghiya Tulse", wallet: "GB2FK6UX2HC7U2LFML6OZFJLJGFUCX7S37EZDVA5MPM5O5D5NLH65SOV"}
    ];

    const courses = ['Blockchain Development', 'Web Development', 'Data Science', 'Machine Learning', 'Cybersecurity', 'Cloud Computing'];
    const issuers = ['IIT Bombay', 'MIT OpenCourseWare', 'Stanford Online', 'Coursera', 'Udemy', 'edX'];
    const grades = ['Distinction', 'First Class', 'Second Class', 'Pass'];

    let count = 0;
    const now = Date.now();

    for (let i = 0; i < users.length; i++) {
        const student = users[i];
        const student_name = student.name.trim();
        const student_wallet = student.wallet.trim();
        const course = courses[Math.floor(Math.random() * courses.length)];
        const issuer = issuers[Math.floor(Math.random() * issuers.length)];
        const grade = grades[Math.floor(Math.random() * grades.length)];
        const hash = Array.from({ length: 56 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('');

        // Random date within the last 30 days
        const randomPastTime = now - (Math.random() * 30 * 24 * 60 * 60 * 1000);
        const created_at = new Date(randomPastTime).toISOString().replace('T', ' ').split('.')[0];

        stmt.run([student_name, student_wallet, course, issuer, grade, hash, created_at], (err) => {
            if (err) console.error(err);
            else count++;
        });
    }

    stmt.finalize(() => {
        console.log(`✅ Seeded ${count} verified active user certificates.`);
        db.close();
    });
});

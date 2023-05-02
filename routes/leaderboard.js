// auth.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require('./../db')
const router = express.Router();


function verifyToken(token) {
    return jwt.verify(token, "secret-key");
}

// Leaderboard route (requires JWT token)
router.post('/success', async (req, res) => {
    const { token } = req.body;

    try {
        // Verify the JWT token
        const { id } = verifyToken(token);

        const user = db.get('SELECT * FROM users WHERE id = ?', id, (err, rows) => {
            if (!rows) {
                return res.status(404).json({ error: 'User not found' });
            }

            console.log('rows', rows)


            // Insert the leaderboard entry into the database
            const now = new Date();
            const createdAt = now.toISOString();

            db.run('INSERT INTO leaderboard (username, email, created_at) VALUES (?, ?, ?)', [rows.name, rows.email, createdAt], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                res.json({ message: 'Leaderboard entry saved' });
            });
        });






    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        const rows = db.all('SELECT * FROM leaderboard ORDER BY created_at DESC LIMIT 10', (err, rows) => {

            return res.json(rows);
        })
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

module.exports = router;
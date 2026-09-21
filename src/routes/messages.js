const express = require('express');
const { db } = require('../db');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/api/messages/:otherId', isAuthenticated, (req, res) => {
    db.all('SELECT * FROM messages WHERE (senderId=? AND receiverId=?) OR (senderId=? AND receiverId=?) ORDER BY id ASC',
        [req.user.id, req.params.otherId, req.params.otherId, req.user.id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows || []);
        });
});

router.post('/api/messages', isAuthenticated, (req, res) => {
    const { receiverId, text } = req.body;
    if (!receiverId || !text) return res.status(400).json({ error: 'Missing fields' });
    db.run('INSERT INTO messages (senderId, receiverId, text, time) VALUES (?, ?, ?, ?)',
        [req.user.id, receiverId, text, new Date().toLocaleString()], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
});

router.get('/api/messages', isAuthenticated, (req, res) => {
    db.all(`SELECT m.*, u.displayName as senderName, u.avatar as senderAvatar
            FROM messages m
            JOIN users u ON m.senderId = u.id
            WHERE m.receiverId = ? OR m.senderId = ?
            ORDER BY m.id DESC LIMIT 200`,
        [req.user.id, req.user.id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows || []);
        });
});

module.exports = router;

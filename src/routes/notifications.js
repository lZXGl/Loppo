const express = require('express');
const { db } = require('../db');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/api/notifications', isAuthenticated, (req, res) => {
    db.all('SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC LIMIT 50',
        [req.user.id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows || []);
        });
});

router.post('/api/notifications/:id/read', isAuthenticated, (req, res) => {
    db.run('UPDATE notifications SET isRead = 1 WHERE id = ? AND userId = ?',
        [req.params.id, req.user.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
});

router.post('/api/notifications/read-all', isAuthenticated, (req, res) => {
    db.run('UPDATE notifications SET isRead = 1 WHERE userId = ? AND isRead = 0',
        [req.user.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
});

module.exports = router;

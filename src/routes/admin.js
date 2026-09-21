const express = require('express');
const { db } = require('../db');
const { isAdmin } = require('../middleware/auth');
const path = require('path');

const router = express.Router();

router.get('/admin', (req, res) => {
    if (req.isAuthenticated() && req.user.isAdmin) res.sendFile(path.join(__dirname, '../../admin.html'));
    else res.redirect('/');
});

router.get('/api/admin/stats', isAdmin, (req, res) => {
    db.get('SELECT (SELECT COUNT(*) FROM users) as userCount, (SELECT COUNT(*) FROM posts) as postCount', (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

router.get('/api/admin/users', isAdmin, (req, res) => {
    db.all('SELECT id, username, displayName, email, isAdmin FROM users', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.delete('/api/admin/users/:id', isAdmin, (req, res) => {
    db.run('DELETE FROM users WHERE id = ?', req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

router.delete('/api/admin/posts/:id', isAdmin, (req, res) => {
    db.run('DELETE FROM posts WHERE id = ?', req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

module.exports = router;

const express = require('express');
const { db } = require('../db');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/api/posts/:id/comments', (req, res) => {
    db.all('SELECT * FROM comments WHERE postId = ? ORDER BY id ASC', [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

router.post('/api/posts/:id/comments', isAuthenticated, (req, res) => {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Comment text is required' });
    const author = req.user.displayName || req.user.username;
    const time = new Date().toLocaleString();
    db.run('INSERT INTO comments (postId, userId, text, author, time) VALUES (?, ?, ?, ?, ?)',
        [req.params.id, req.user.id, text.trim(), author, time], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            // Update user karma
            db.run('UPDATE users SET karma = COALESCE(karma, 0) + 1 WHERE id = ?', [req.user.id]);
            // Notify post author
            db.get('SELECT userId FROM posts WHERE id = ?', [req.params.id], (err, post) => {
                if (post && post.userId !== req.user.id) {
                    db.run('INSERT INTO notifications (userId, type, message, relatedId) VALUES (?, ?, ?, ?)',
                        [post.userId, 'comment', `${req.user.displayName || req.user.username} commented on your post`, req.params.id]);
                }
            });
            res.json({ success: true, id: this.lastID });
        });
});

module.exports = router;

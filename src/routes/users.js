const express = require('express');
const { db } = require('../db');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/api/users', (req, res) => {
    db.all('SELECT id, username, displayName, avatar, bio, karma FROM users LIMIT 100', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

router.put('/api/user/profile', isAuthenticated, (req, res) => {
    const { displayName, bio, avatar, coverPhoto } = req.body;
    const updates = [];
    const params = [];
    if (displayName !== undefined && displayName !== null) { updates.push('displayName = ?'); params.push(displayName); }
    if (bio !== undefined && bio !== null) { updates.push('bio = ?'); params.push(bio); }
    if (avatar !== undefined && avatar !== null) { updates.push('avatar = ?'); params.push(avatar); }
    if (coverPhoto !== undefined && coverPhoto !== null) { updates.push('coverPhoto = ?'); params.push(coverPhoto); }
    if (updates.length === 0) return res.json({ success: true });
    params.push(req.user.id);
    db.run('UPDATE users SET ' + updates.join(', ') + ' WHERE id = ?', params,
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
});

router.get('/api/profile/stats', isAuthenticated, (req, res) => {
    const userId = req.user.id;
    db.get('SELECT COUNT(*) as followers FROM follows WHERE followingId = ?', [userId], (err, row1) => {
        const followers = row1 ? row1.followers : 0;
        db.get('SELECT COUNT(*) as posts FROM posts WHERE userId = ?', [userId], (err, row2) => {
            const posts = row2 ? row2.posts : 0;
            db.get('SELECT COUNT(*) as following FROM follows WHERE followerId = ?', [userId], (err, row3) => {
                const following = row3 ? row3.following : 0;
                res.json({ followers, posts, following });
            });
        });
    });
});

router.post('/api/users/:id/follow', isAuthenticated, (req, res) => {
    // Check if already following
    db.get('SELECT * FROM follows WHERE followerId = ? AND followingId = ?', [req.user.id, req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            // Unfollow
            db.run('DELETE FROM follows WHERE followerId = ? AND followingId = ?', [req.user.id, req.params.id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true, following: false });
            });
        } else {
            // Follow
                db.run('INSERT OR IGNORE INTO follows (followerId, followingId) VALUES (?, ?)', [req.user.id, req.params.id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                // Update karma
                db.run('UPDATE users SET karma = COALESCE(karma, 0) + 1 WHERE id = ?', [req.params.id]);
                // Notify followed user
                db.run('INSERT INTO notifications (userId, type, message, relatedId) VALUES (?, ?, ?, ?)',
                    [req.params.id, 'follow', `${req.user.displayName || req.user.username} started following you`, req.user.id]);
                res.json({ success: true, following: true });
            });
        }
    });
});

router.get('/api/users/:id/followers', (req, res) => {
    db.all('SELECT u.id, u.displayName, u.username, u.avatar FROM follows f JOIN users u ON f.followerId = u.id WHERE f.followingId = ?',
        [req.params.id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows || []);
        });
});

router.get('/api/users/:id/following', (req, res) => {
    db.all('SELECT u.id, u.displayName, u.username, u.avatar FROM follows f JOIN users u ON f.followingId = u.id WHERE f.followerId = ?',
        [req.params.id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows || []);
        });
});

// Check if following a specific user
router.get('/api/follows/:targetId', isAuthenticated, (req, res) => {
    db.get('SELECT * FROM follows WHERE followerId = ? AND followingId = ?',
        [req.user.id, req.params.targetId], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ following: !!row });
        });
});

module.exports = router;

const express = require('express');
const { db } = require('../db');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/api/posts', isAuthenticated, (req, res) => {
    const { text, image, video, poll } = req.body;
    const time = new Date().toLocaleString();
    db.run(`INSERT INTO posts (userId, author, authorAvatar, text, image, video, poll, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, req.user.displayName, req.user.avatar, text || '', image || null, video || null, poll ? JSON.stringify(poll) : null, time],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        });
});

router.get('/api/posts', (req, res) => {
    const query = `
        SELECT p.*, COUNT(c.id) as commentCount
        FROM posts p
        LEFT JOIN comments c ON p.id = c.postId
        WHERE p.isHidden = 0 OR p.isHidden IS NULL
        GROUP BY p.id
        ORDER BY p.id DESC`;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const posts = rows.map(r => ({
            ...r,
            likedBy: (() => { try { return JSON.parse(r.likedBy || '[]'); } catch { return []; } })(),
            poll: (() => { try { return JSON.parse(r.poll || 'null'); } catch { return null; } })()
        }));
        res.json(posts);
    });
});

router.get('/api/posts/all', isAdmin, (req, res) => {
    const query = `
        SELECT p.*, COUNT(c.id) as commentCount
        FROM posts p
        LEFT JOIN comments c ON p.id = c.postId
        GROUP BY p.id
        ORDER BY p.id DESC`;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const posts = rows.map(r => ({
            ...r,
            likedBy: (() => { try { return JSON.parse(r.likedBy || '[]'); } catch { return []; } })(),
            poll: (() => { try { return JSON.parse(r.poll || 'null'); } catch { return null; } })()
        }));
        res.json(posts);
    });
});

router.post('/api/posts/:id/like', isAuthenticated, (req, res) => {
    db.get('SELECT likedBy FROM posts WHERE id = ?', [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Post not found' });
        let likedBy = (() => { try { return JSON.parse(row.likedBy || '[]'); } catch { return []; } })();
        const userIdentifier = String(req.user.displayName || req.user.username || req.user.id);
        const index = likedBy.indexOf(userIdentifier);
        if (index > -1) {
            likedBy.splice(index, 1);
        } else {
            likedBy.push(userIdentifier);
        }
        const likes = likedBy.length;
        db.run('UPDATE posts SET likes = ?, likedBy = ? WHERE id = ?', [likes, JSON.stringify(likedBy), req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (index === -1) {
                db.get('SELECT userId FROM posts WHERE id = ?', [req.params.id], (err, post) => {
                    if (post && post.userId !== req.user.id) {
                        db.run('INSERT INTO notifications (userId, type, message, relatedId) VALUES (?, ?, ?, ?)',
                            [post.userId, 'like', `${req.user.displayName || req.user.username} liked your post`, req.params.id]);
                    }
                });
            }
            res.json({ success: true, likes, userLiked: index === -1 });
        });
    });
});

router.delete('/api/posts/:id', isAuthenticated, (req, res) => {
    db.run('DELETE FROM posts WHERE id = ? AND userId = ?', [req.params.id, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(403).json({ error: 'Forbidden or not found' });
        res.json({ success: true });
    });
});

router.put('/api/posts/:id', isAuthenticated, (req, res) => {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Text is required' });
    db.run('UPDATE posts SET text = ? WHERE id = ? AND userId = ?', [text.trim(), req.params.id, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(403).json({ error: 'Forbidden or not found' });
        res.json({ success: true });
    });
});

router.put('/api/posts/:id/hide', isAuthenticated, (req, res) => {
    const { isHidden } = req.body;
    db.run('UPDATE posts SET isHidden = ? WHERE id = ? AND userId = ?', [isHidden ? 1 : 0, req.params.id, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

module.exports = router;

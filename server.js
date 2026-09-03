const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const qrcode = require('qrcode');

let otplibModule = null;
let otplibLoadError = null;

const app = express();
const PORT = process.env.PORT || 8787;
const SESSION_SECRET = process.env.SESSION_SECRET || 'loppo_secret_key_2026';

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false,
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: "Too many requests, please try again later."
});
app.use('/api/', limiter);

app.use(cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (!err) console.log('Connected to SQLite.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        googleId TEXT,
        displayName TEXT,
        email TEXT UNIQUE,
        avatar TEXT,
        twoFactorSecret TEXT,
        isTwoFactorEnabled INTEGER DEFAULT 0,
        password TEXT,
        isAdmin INTEGER DEFAULT 0,
        bio TEXT,
        coverPhoto TEXT,
        karma INTEGER DEFAULT 0,
        username TEXT UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    text TEXT,
    image TEXT,
    video TEXT,
    author TEXT,
    authorAvatar TEXT,
    time TEXT,
    likes INTEGER DEFAULT 0,
    likedBy TEXT DEFAULT '[]',
    isHidden INTEGER DEFAULT 0,
    poll TEXT DEFAULT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
)`);

// Add userId column if it doesn't exist (for existing DBs)
db.run("ALTER TABLE posts ADD COLUMN userId INTEGER REFERENCES users(id)", () => {});

db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    postId INTEGER,
    userId INTEGER,
    text TEXT,
    author TEXT,
    time TEXT,
    FOREIGN KEY (postId) REFERENCES posts (id),
    FOREIGN KEY (userId) REFERENCES users(id)
)`);

db.run("ALTER TABLE comments ADD COLUMN userId INTEGER REFERENCES users(id)", () => {});

db.run(`CREATE TABLE IF NOT EXISTS follows (
    followerId INTEGER,
    followingId INTEGER,
    PRIMARY KEY (followerId, followingId),
    FOREIGN KEY (followerId) REFERENCES users(id),
    FOREIGN KEY (followingId) REFERENCES users(id)
)`);

db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    senderId INTEGER,
    receiverId INTEGER,
    text TEXT,
    time TEXT,
    isRead INTEGER DEFAULT 0,
    FOREIGN KEY (senderId) REFERENCES users(id),
    FOREIGN KEY (receiverId) REFERENCES users(id)
)`);

db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    relatedId INTEGER DEFAULT NULL,
    isRead INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id)
)`);
});

// Load otplib dynamically
(async () => {
    try {
        otplibModule = await import('otplib');
    } catch (e) {
        otplibLoadError = e.message;
        console.error('Failed to load otplib dynamically:', e);
    }
})();

// Passport Local Strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, (identifier, password, done) => {
    db.get('SELECT * FROM users WHERE email = ? OR username = ?', [identifier, identifier], (err, user) => {
        if (err) return done(err);
        if (!user || !user.password) return done(null, false, { message: 'Incorrect email/username or password.' });

        bcrypt.compare(password, user.password, (err, res) => {
            if (res) return done(null, user);
            else return done(null, false, { message: 'Incorrect email/username or password.' });
        });
    });
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
        if (err) return done(err);
        done(null, user);
    });
});

// Serve static files
app.use(express.static(path.join(__dirname, '.')));

// --- AUTH ROUTES ---
app.post('/api/signup', (req, res) => {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({ error: 'Username can only contain letters, numbers, and underscores' });
    }

    bcrypt.hash(password, 10, (err, hash) => {
        db.run('INSERT INTO users (displayName, username, email, password) VALUES (?, ?, ?, ?)',
            [fullName, username, email, hash], function(err) {
                if (err) {
                    const msg = err.message.includes('UNIQUE')
                        ? 'Username or email already exists'
                        : 'Registration failed';
                    return res.status(400).json({ error: msg });
                }
                res.json({ success: true });
            }
        );
    });
});

app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: info.message });
        req.logIn(user, (err) => {
            if (err) return next(err);
            if (req.body.rememberMe) {
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
            }
            req.session.save((err) => {
                if (err) return next(err);
                console.log('LOGIN_RESPONSE_SENT:' + JSON.stringify({id: user.id, hasPassword: !!user.password})); return res.json({
                    success: true,
                    user: {
                        id: user.id, username: user.username, displayName: user.displayName,
                        email: user.email, avatar: user.avatar, bio: user.bio,
                        coverPhoto: user.coverPhoto, karma: user.karma, isAdmin: user.isAdmin,
                        isTwoFactorEnabled: user.isTwoFactorEnabled, googleId: user.googleId
                    }
                });
            });
        });
    })(req, res, next);
});

app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
        const u = req.user;
        res.json({
            id: u.id, username: u.username, displayName: u.displayName,
            email: u.email, avatar: u.avatar, bio: u.bio,
            coverPhoto: u.coverPhoto, karma: u.karma, isAdmin: u.isAdmin,
            isTwoFactorEnabled: u.isTwoFactorEnabled, googleId: u.googleId
        });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

app.get('/api/profile/stats', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
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

// --- 2FA ROUTES ---
app.get('/api/2fa/setup', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    if (!otplibModule) {
        return res.status(500).json({ error: '2FA service currently unavailable: ' + (otplibLoadError || 'loading otplib') });
    }

    let secret = req.user.twoFactorSecret;
    if (!secret) {
        secret = otplibModule.generateSecret();
        db.run('UPDATE users SET twoFactorSecret = ? WHERE id = ?', [secret, req.user.id], (err) => {
            if (err) console.error('Failed to save 2FA secret:', err);
        });
    }

    const email = req.user.email || req.user.username || 'user';
    const otpauth = otplibModule.generateURI({
        secret,
        label: email,
        issuer: 'Loppo'
    });
    
    qrcode.toDataURL(otpauth, (err, imageUrl) => {
        if (err) return res.status(500).json({ error: 'Failed to generate QR code' });
        res.json({ qrCode: imageUrl });
    });
});

app.post('/api/2fa/verify', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    if (!otplibModule) {
        return res.status(500).json({ error: '2FA service currently unavailable' });
    }

    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Verification code token is required' });

    let secret = req.user.twoFactorSecret;
    if (!secret) return res.status(400).json({ error: '2FA setup not initialized. Visit /api/2fa/setup first.' });

    try {
        const isValid = await otplibModule.verify({ token, secret });
        if (isValid) {
            db.run('UPDATE users SET isTwoFactorEnabled = 1 WHERE id = ?', [req.user.id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true });
            });
        } else {
            res.status(400).json({ error: 'Invalid verification code' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to verify token: ' + err.message });
    }
});

app.get('/auth/logout', (req, res) => {
    req.logout(() => res.redirect('/login.html'));
});

// Google OAuth
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        db.get('SELECT * FROM users WHERE googleId = ? OR email = ?', [profile.id, profile.emails?.[0]?.value], (err, user) => {
            if (err) return done(err);
            if (user) {
                db.run('UPDATE users SET googleId = ?, avatar = COALESCE(NULLIF(?, ?), avatar) WHERE id = ?',
                    [profile.id, profile.photos?.[0]?.value, undefined, user.id]);
                return done(null, user);
            }
            db.run('INSERT INTO users (googleId, displayName, email, avatar) VALUES (?, ?, ?, ?)',
                [profile.id, profile.displayName, profile.emails?.[0]?.value, profile.photos?.[0]?.value],
                function(err) {
                    if (err) return done(err);
                    db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, newUser) => done(err, newUser));
                });
        });
    }));

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login.html' }),
        (req, res) => res.redirect('/')
    );
}

// --- ADMIN API ---
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) return next();
    res.status(403).json({ error: 'Forbidden' });
}

app.get('/admin', (req, res) => {
    if (req.isAuthenticated() && req.user.isAdmin) res.sendFile(path.join(__dirname, 'admin.html'));
    else res.redirect('/');
});

app.get('/api/admin/stats', isAdmin, (req, res) => {
    db.get('SELECT (SELECT COUNT(*) FROM users) as userCount, (SELECT COUNT(*) FROM posts) as postCount', (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

app.get('/api/admin/users', isAdmin, (req, res) => {
    db.all('SELECT id, username, displayName, email, isAdmin FROM users', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.delete('/api/admin/users/:id', isAdmin, (req, res) => {
    db.run('DELETE FROM users WHERE id = ?', req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/admin/posts/:id', isAdmin, (req, res) => {
    db.run('DELETE FROM posts WHERE id = ?', req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- SOCIAL API ---
app.get('/api/users', (req, res) => {
    db.all('SELECT id, username, displayName, avatar, bio, karma FROM users LIMIT 100', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

app.put('/api/user/profile', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
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

app.post('/api/posts', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    const { text, image, video, poll } = req.body;
    const time = new Date().toLocaleString();
    db.run(`INSERT INTO posts (userId, author, authorAvatar, text, image, video, poll, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, req.user.displayName, req.user.avatar, text || '', image || null, video || null, poll ? JSON.stringify(poll) : null, time],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        });
});

app.get('/api/posts', (req, res) => {
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

app.get('/api/posts/all', isAdmin, (req, res) => {
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

app.get('/api/messages/:otherId', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    db.all('SELECT * FROM messages WHERE (senderId=? AND receiverId=?) OR (senderId=? AND receiverId=?) ORDER BY id ASC',
        [req.user.id, req.params.otherId, req.params.otherId, req.user.id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows || []);
        });
});

app.post('/api/messages', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    const { receiverId, text } = req.body;
    if (!receiverId || !text) return res.status(400).json({ error: 'Missing fields' });
    db.run('INSERT INTO messages (senderId, receiverId, text, time) VALUES (?, ?, ?, ?)',
        [req.user.id, receiverId, text, new Date().toLocaleString()], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
});

app.get('/api/messages', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
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

app.post('/api/posts/:id/like', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
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

app.delete('/api/posts/:id', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    db.run('DELETE FROM posts WHERE id = ? AND userId = ?', [req.params.id, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(403).json({ error: 'Forbidden or not found' });
        res.json({ success: true });
    });
});

app.put('/api/posts/:id', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Text is required' });
    db.run('UPDATE posts SET text = ? WHERE id = ? AND userId = ?', [text.trim(), req.params.id, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(403).json({ error: 'Forbidden or not found' });
        res.json({ success: true });
    });
});

app.put('/api/posts/:id/hide', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    const { isHidden } = req.body;
    db.run('UPDATE posts SET isHidden = ? WHERE id = ? AND userId = ?', [isHidden ? 1 : 0, req.params.id, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Comment routes
app.get('/api/posts/:id/comments', (req, res) => {
    db.all('SELECT * FROM comments WHERE postId = ? ORDER BY id ASC', [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

app.post('/api/posts/:id/comments', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
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

app.post('/api/users/:id/follow', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
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

app.get('/api/users/:id/followers', (req, res) => {
    db.all('SELECT u.id, u.displayName, u.username, u.avatar FROM follows f JOIN users u ON f.followerId = u.id WHERE f.followingId = ?',
        [req.params.id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows || []);
        });
});

app.get('/api/users/:id/following', (req, res) => {
    db.all('SELECT u.id, u.displayName, u.username, u.avatar FROM follows f JOIN users u ON f.followingId = u.id WHERE f.followerId = ?',
        [req.params.id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows || []);
        });
});

// Check if following a specific user
app.get('/api/follows/:targetId', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    db.get('SELECT * FROM follows WHERE followerId = ? AND followingId = ?',
        [req.user.id, req.params.targetId], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ following: !!row });
        });
});

// --- NOTIFICATION API ---
app.get('/api/notifications', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    db.all('SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC LIMIT 50',
        [req.user.id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows || []);
        });
});

app.post('/api/notifications/:id/read', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    db.run('UPDATE notifications SET isRead = 1 WHERE id = ? AND userId = ?',
        [req.params.id, req.user.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
});

app.post('/api/notifications/read-all', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    db.run('UPDATE notifications SET isRead = 1 WHERE userId = ? AND isRead = 0',
        [req.user.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
});

// Optimized Serving Logic
app.get('/:page', (req, res, next) => {
    let page = req.params.page;
    if (page.includes('.') && !page.endsWith('.html')) return next();
    if (page.endsWith('.html')) page = page.slice(0, -5);
    const filePath = path.join(__dirname, page + '.html');
    if (fs.existsSync(filePath)) res.sendFile(filePath);
    else next();
});

app.use((req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, '0.0.0.0', () => console.log(`Loppo running on http://localhost:${PORT} and http://192.168.1.12:${PORT}`));


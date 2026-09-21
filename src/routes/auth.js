const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const qrcode = require('qrcode');
const { db } = require('../db');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

let otplibModule = null;
let otplibLoadError = null;

(async () => {
    try {
        otplibModule = await import('otplib');
    } catch (e) {
        otplibLoadError = e.message;
        console.error('Failed to load otplib dynamically:', e);
    }
})();

router.post('/api/signup', (req, res) => {
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

router.post('/api/login', (req, res, next) => {
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

router.get('/api/user', isAuthenticated, (req, res) => {
    const u = req.user;
    res.json({
        id: u.id, username: u.username, displayName: u.displayName,
        email: u.email, avatar: u.avatar, bio: u.bio,
        coverPhoto: u.coverPhoto, karma: u.karma, isAdmin: u.isAdmin,
        isTwoFactorEnabled: u.isTwoFactorEnabled, googleId: u.googleId
    });
});

// --- 2FA ROUTES ---
router.get('/api/2fa/setup', isAuthenticated, (req, res) => {
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

router.post('/api/2fa/verify', isAuthenticated, async (req, res) => {
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

router.get('/auth/logout', (req, res) => {
    req.logout(() => res.redirect('/login.html'));
});

router.get('/logout', (req, res) => {
    req.logout(() => res.redirect('/login.html'));
});

// Google OAuth is registered in server.js, but we could handle the routes here.
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    router.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login.html' }),
        (req, res) => res.redirect('/')
    );
}

module.exports = router;

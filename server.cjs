const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const compression = require('compression');
const { db } = require('./src/db');
const { PORT, SESSION_SECRET, SITE_URL, DOMAIN, rateLimitConfig } = require('./src/config');

const app = express();

app.set('trust proxy', 1);
app.use(compression());

// Security Middleware
app.use(helmet({ contentSecurityPolicy: false }));

const limiter = rateLimit(rateLimitConfig);
app.use('/api/', limiter);

app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
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
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => done(err, user));
});

// Serve static files
app.use(express.static(path.join(__dirname, '.')));

// Routes
app.use(require('./src/routes/auth'));
app.use(require('./src/routes/posts'));
app.use(require('./src/routes/comments'));
app.use(require('./src/routes/users'));
app.use(require('./src/routes/messages'));
app.use(require('./src/routes/notifications'));
app.use(require('./src/routes/admin'));

// Known public pages
const publicPages = [
    'index', 'explore', 'popular', 'news', 'post', 'profile', 'friends',
    'chat', 'notifications', 'settings', 'setup-2fa', 'login', 'signup',
    'about', 'blog', 'help', 'rules', 'privacy', 'user-agreement',
    'accessibility', 'contact', 'admin', '404'
];

// Clean Page Routing
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/:page', (req, res, next) => {
    let page = req.params.page;
    if (page.endsWith('.html')) page = page.slice(0, -5);
    
    if (publicPages.includes(page)) {
        const filePath = path.join(__dirname, `${page}.html`);
        if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.sendFile(filePath);
        }
    }
    next();
});

app.use('/api', (req, res) => res.status(404).json({ error: 'API endpoint not found', status: 404 }));
app.use((req, res) => res.status(404).sendFile(path.join(__dirname, '404.html')));

app.listen(PORT, '0.0.0.0', () => console.log(`Loppo running on http://localhost:${PORT} (Domain: ${DOMAIN}, Canonical: ${SITE_URL})`));

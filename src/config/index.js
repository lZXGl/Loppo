const PORT = process.env.PORT || 8787;
const SESSION_SECRET = process.env.SESSION_SECRET || 'loppo_secret_key_2026';
const SITE_URL = process.env.SITE_URL || process.env.APP_URL || 'https://loppo.com';
const DOMAIN = process.env.DOMAIN || 'loppo.com';

const rateLimitConfig = {
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: "Too many requests, please try again later."
};

module.exports = {
    PORT,
    SESSION_SECRET,
    SITE_URL,
    DOMAIN,
    rateLimitConfig
};

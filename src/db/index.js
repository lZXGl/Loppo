const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

let db;
let supabase = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    console.log('Connected to Supabase.');
}

db = new sqlite3.Database(path.join(__dirname, '../../database.sqlite'), (err) => {
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

module.exports = {
    db,
    supabase
};

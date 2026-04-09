import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SESSION_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], sessions: [], history: [] }, null, 2));
}

const loadDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
const saveDB = (db) => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

const hashPassword = (password, salt) =>
  crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

const newSessionToken = () => crypto.randomBytes(32).toString('hex');

const sanitizeUser = (user) => ({
  id: user.id,
  username: user.username,
  createdAt: user.createdAt,
});

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid username or password format.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const db = loadDB();
  if (db.users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
    return res.status(409).json({ error: 'Username already exists.' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const user = {
    id: db.users.length ? Math.max(...db.users.map((item) => item.id)) + 1 : 1,
    username,
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  saveDB(db);

  const token = newSessionToken();
  db.sessions.push({
    token,
    userId: user.id,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_TTL).toISOString(),
  });
  saveDB(db);

  res.json({ token, user: sanitizeUser(user) });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const db = loadDB();
  const user = db.users.find((item) => item.username.toLowerCase() === username.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const passwordHash = hashPassword(password, user.salt);
  if (passwordHash !== user.passwordHash) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = newSessionToken();
  db.sessions.push({
    token,
    userId: user.id,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_TTL).toISOString(),
  });
  saveDB(db);

  res.json({ token, user: sanitizeUser(user) });
});

const getSession = (token) => {
  if (!token) return null;
  const db = loadDB();
  const session = db.sessions.find((item) => item.token === token);
  if (!session) return null;
  if (new Date(session.expiresAt) < new Date()) {
    return null;
  }
  const user = db.users.find((item) => item.id === session.userId);
  return user ? { session, user } : null;
};

const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token.' });
  }
  const token = auth.split(' ')[1];
  const context = getSession(token);
  if (!context) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
  req.user = context.user;
  req.session = context.session;
  next();
};

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

app.post('/api/auth/logout', authMiddleware, (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const db = loadDB();
  db.sessions = db.sessions.filter((session) => session.token !== token);
  saveDB(db);
  res.json({ success: true });
});

app.get('/api/history', authMiddleware, (req, res) => {
  const db = loadDB();
  const items = db.history
    .filter((item) => item.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ history: items });
});

app.post('/api/history', authMiddleware, (req, res) => {
  const { topic, summary } = req.body;
  if (!topic || !summary) {
    return res.status(400).json({ error: 'Topic and summary are required.' });
  }

  const db = loadDB();
  const historyItem = {
    id: db.history.length ? Math.max(...db.history.map((item) => item.id)) + 1 : 1,
    userId: req.user.id,
    topic,
    summary,
    createdAt: new Date().toISOString(),
  };

  db.history.push(historyItem);
  saveDB(db);

  res.json({ history: historyItem });
});

app.listen(PORT, () => {
  console.log(`Backend server listening at http://localhost:${PORT}`);
});

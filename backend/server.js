require('dotenv').config();

const express      = require('express');
const session      = require('express-session');
const csrf         = require('csurf');
const cors         = require('cors');
const cookieParser = require('cookie-parser');

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is not set. Copy .env.example to .env and fill it in.');
}

const app = express();

// Middleware order is load-bearing — do not reorder (see CLAUDE.md)
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' }
}));
app.use(csrf({ cookie: true }));

app.use('/api', require('./routes/contacts'));

// CSRF error handler — must be last
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN')
    return res.status(403).json({ error: 'Invalid or missing CSRF token' });
  next(err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on :${PORT}`));

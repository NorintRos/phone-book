const express = require('express');
const session = require('express-session');
const csrf    = require('csurf');
const cors    = require('cors');

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'lab-secret-key',
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

app.listen(5000, () => console.log('Server on :5000'));
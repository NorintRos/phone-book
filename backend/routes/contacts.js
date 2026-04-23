const { Router } = require('express');
const router = Router();

// Middleware: require an active session
function requireSession(req, res, next) {
  if (!req.session?.userId)
    return res.status(401).json({ error: 'Not authenticated' });
  next();
}

// GET /api/csrf-token  — called by frontend on load
router.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// POST /api/contacts  — protected by both session + CSRF
router.post('/contacts', requireSession, (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone)
    return res.status(400).json({ error: 'name and phone required' });

  // TODO: persist to DB; returning echo for lab scope
  res.status(201).json({ id: Date.now(), name, phone });
});

module.exports = router;
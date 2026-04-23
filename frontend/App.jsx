import React, { useState, useEffect } from 'react';
import { useCsrf } from './hooks/useCsrf';
import AddContactForm from './components/AddContactForm';
import ContactList from './components/ContactList';

export default function App() {
  const { csrfToken, api } = useCsrf();
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loginError, setLoginError] = useState(null);

  // Fetch contacts once logged in
  useEffect(() => {
    if (!loggedIn || !csrfToken) return;
    api.get('/contacts')
      .then((res) => setContacts(res.data))
      .catch((err) => console.error('Failed to load contacts', err));
  }, [loggedIn, csrfToken]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError(null);
    try {
      await api.post('/login', { username });
      setLoggedIn(true);
    } catch (err) {
      setLoginError(err.response?.data?.error || 'Login failed');
    }
  }

  async function handleLogout() {
    try {
      await api.post('/logout');
    } catch (_) {
      // best-effort
    }
    setLoggedIn(false);
    setContacts([]);
    setUsername('');
  }

  function handleContactAdded(contact) {
    setContacts((prev) => [...prev, contact]);
  }

  if (!loggedIn) {
    return (
      <main>
        <h1>Phone Book</h1>
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
          <button type="submit" disabled={!csrfToken}>
            {csrfToken ? 'Login' : 'Loading…'}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main>
      <h1>Phone Book</h1>
      <p>Logged in as <strong>{username}</strong> <button onClick={handleLogout}>Logout</button></p>
      <AddContactForm api={api} onContactAdded={handleContactAdded} />
      <h2>Contacts</h2>
      <ContactList contacts={contacts} />
    </main>
  );
}

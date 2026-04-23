import React, { useState } from 'react';

export default function AddContactForm({ api, onContactAdded }) {
  const [form, setForm] = useState({ name: '', phone: '' });
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/contacts', form);
      onContactAdded(res.data);
      setForm({ name: '', phone: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add contact');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Contact</h3>
      <div>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Phone
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Add</button>
    </form>
  );
}

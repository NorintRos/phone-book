import React from 'react';

export default function ContactList({ contacts }) {
  if (contacts.length === 0) {
    return <p>No contacts yet.</p>;
  }

  return (
    <ul>
      {contacts.map((c) => (
        <li key={c.id}>
          <strong>{c.name}</strong> — {c.phone}
        </li>
      ))}
    </ul>
  );
}

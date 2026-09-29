import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', isError: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage({ text: 'Sending...', isError: false });

    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: formData.name,
        email: formData.email,
        project: formData.project,
        message: formData.message
      });

      if (error) throw error;

      setStatusMessage({ text: 'Thanks — we’ll be in touch shortly.', isError: false });
      setFormData({ name: '', email: '', project: '', message: '' });
    } catch (err) {
      console.error('Contact form submission failed:', err);
      setStatusMessage({ text: 'Unable to send your message. Please try again.', isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="contact-form reveal" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          name="name"
          required
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>

      <label>
        Email
        <input
          type="email"
          name="email"
          required
          placeholder="you@company.com"
          value={formData.email}
          onChange={handleChange}
        />
      </label>

      <label>
        Project / Company
        <input
          name="project"
          placeholder="What are we building?"
          value={formData.project}
          onChange={handleChange}
        />
      </label>

      <label>
        Message
        <textarea
          name="message"
          required
          rows={3}
          placeholder="Tell us a little about the idea..."
          value={formData.message}
          onChange={handleChange}
        />
      </label>

      <button className="button button-lime" type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send message'} <span>↗</span>
      </button>

      {statusMessage.text && (
        <p className={`form-status ${statusMessage.isError ? 'error' : ''}`} role="status">
          {statusMessage.text}
        </p>
      )}
    </form>
  );
}

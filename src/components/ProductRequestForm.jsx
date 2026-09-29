import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ProductRequestForm({ defaultRequestType = 'Buy' }) {
  const [formData, setFormData] = useState({
    request_type: defaultRequestType,
    name: '',
    email: '',
    project: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', isError: false });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, request_type: defaultRequestType }));
  }, [defaultRequestType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage({ text: 'Sending...', isError: false });

    const requestType = formData.request_type;
    const project = formData.project || 'Smart Table Starter Kit';
    const phone = formData.phone;
    const message = formData.message || 'Smart Table request';

    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: formData.name,
        email: formData.email,
        project: `${requestType} - ${project}${phone ? ' - Phone: ' + phone : ''}`,
        message
      });

      if (error) throw error;

      setStatusMessage({ text: 'Request received. We will be in touch shortly.', isError: false });
      setFormData({
        request_type: defaultRequestType,
        name: '',
        email: '',
        project: '',
        phone: '',
        message: ''
      });
    } catch (err) {
      console.error('Smart Table request failed:', err);
      setStatusMessage({ text: 'Unable to send. Please check your details and try again.', isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <label>
        Request type
        <select name="request_type" value={formData.request_type} onChange={handleChange}>
          <option value="Demo">Book a demo</option>
          <option value="Buy">Buy starter kit</option>
        </select>
      </label>

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
        Restaurant / Company
        <input
          name="project"
          placeholder="Restaurant or company name"
          value={formData.project}
          onChange={handleChange}
        />
      </label>

      <label>
        Phone
        <input
          name="phone"
          placeholder="Phone number"
          value={formData.phone}
          onChange={handleChange}
        />
      </label>

      <label>
        Notes
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us what you need..."
          value={formData.message}
          onChange={handleChange}
        />
      </label>

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send request'} <span>↗</span>
      </button>

      {statusMessage.text && (
        <p className={`request-status ${statusMessage.isError ? 'error' : ''}`} role="status">
          {statusMessage.text}
        </p>
      )}
    </form>
  );
}

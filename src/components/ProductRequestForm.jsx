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
    <form
      className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl flex flex-col gap-5"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-col gap-2 text-xs font-bold text-slate-800">
        Request type
        <select
          name="request_type"
          value={formData.request_type}
          onChange={handleChange}
          className="w-full border border-slate-200 rounded-lg p-3 text-slate-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-normal"
        >
          <option value="Demo">Book a demo</option>
          <option value="Buy">Buy starter kit</option>
        </select>
      </label>

      <label className="flex flex-col gap-2 text-xs font-bold text-slate-800">
        Name
        <input
          name="name"
          required
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-slate-200 rounded-lg p-3 text-slate-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-normal"
        />
      </label>

      <label className="flex flex-col gap-2 text-xs font-bold text-slate-800">
        Email
        <input
          type="email"
          name="email"
          required
          placeholder="you@company.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-slate-200 rounded-lg p-3 text-slate-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-normal"
        />
      </label>

      <label className="flex flex-col gap-2 text-xs font-bold text-slate-800">
        Restaurant / Company
        <input
          name="project"
          placeholder="Restaurant or company name"
          value={formData.project}
          onChange={handleChange}
          className="w-full border border-slate-200 rounded-lg p-3 text-slate-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-normal"
        />
      </label>

      <label className="flex flex-col gap-2 text-xs font-bold text-slate-800">
        Phone
        <input
          name="phone"
          placeholder="Phone number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border border-slate-200 rounded-lg p-3 text-slate-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-normal"
        />
      </label>

      <label className="flex flex-col gap-2 text-xs font-bold text-slate-800">
        Notes
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us what you need..."
          value={formData.message}
          onChange={handleChange}
          className="w-full border border-slate-200 rounded-lg p-3 text-slate-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-normal resize-y"
        />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 inline-flex items-center justify-center px-6 py-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50"
      >
        {submitting ? 'Sending...' : 'Send request'} <span className="ml-2 text-violet-200">↗</span>
      </button>

      {statusMessage.text && (
        <p
          className={`font-mono text-xs mt-2 ${
            statusMessage.isError ? 'text-red-600' : 'text-emerald-600 font-semibold'
          }`}
          role="status"
        >
          {statusMessage.text}
        </p>
      )}
    </form>
  );
}

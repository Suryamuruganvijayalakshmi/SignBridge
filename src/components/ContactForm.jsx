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
    <form className="border-t border-slate-200 pt-6 flex flex-col gap-6" onSubmit={handleSubmit}>
      <label className="block text-slate-500 font-mono text-[10px] uppercase tracking-wider border-b border-slate-200 pb-4">
        Name
        <input
          name="name"
          required
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          className="block w-full bg-transparent border-0 text-slate-900 focus:outline-none pt-2 text-base font-sans"
        />
      </label>

      <label className="block text-slate-500 font-mono text-[10px] uppercase tracking-wider border-b border-slate-200 pb-4">
        Email
        <input
          type="email"
          name="email"
          required
          placeholder="you@company.com"
          value={formData.email}
          onChange={handleChange}
          className="block w-full bg-transparent border-0 text-slate-900 focus:outline-none pt-2 text-base font-sans"
        />
      </label>

      <label className="block text-slate-500 font-mono text-[10px] uppercase tracking-wider border-b border-slate-200 pb-4">
        Project / Company
        <input
          name="project"
          placeholder="What are we building?"
          value={formData.project}
          onChange={handleChange}
          className="block w-full bg-transparent border-0 text-slate-900 focus:outline-none pt-2 text-base font-sans"
        />
      </label>

      <label className="block text-slate-500 font-mono text-[10px] uppercase tracking-wider border-b border-slate-200 pb-4">
        Message
        <textarea
          name="message"
          required
          rows={3}
          placeholder="Tell us a little about the idea..."
          value={formData.message}
          onChange={handleChange}
          className="block w-full bg-transparent border-0 text-slate-900 focus:outline-none pt-2 text-base font-sans resize-y"
        />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 inline-flex items-center justify-center px-6 py-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50"
      >
        {submitting ? 'Sending...' : 'Send message'} <span className="ml-2 text-violet-200">↗</span>
      </button>

      {statusMessage.text && (
        <p
          className={`font-mono text-xs mt-2 ${
            statusMessage.isError ? 'text-red-600' : 'text-blue-600 font-semibold'
          }`}
          role="status"
        >
          {statusMessage.text}
        </p>
      )}
    </form>
  );
}

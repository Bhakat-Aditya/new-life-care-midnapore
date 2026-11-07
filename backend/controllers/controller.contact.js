import { Contact } from '../models/model.contact.js';

// ─── Submit Contact Form ──────────────────────────────────────────────────────
export const submitContact = async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Name, phone, and message are required' });
    }

    const contact = new Contact({ name, phone, email, subject, message });
    await contact.save();

    return res.status(201).json({ success: true, message: 'Your message has been received. We will get back to you soon!' });
  } catch (error) {
    console.error('[submitContact]', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


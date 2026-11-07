import { Notice } from '../models/model.notice.js';

const DEFAULT_NOTICES = [
  {
    title: 'Free Blood Sugar & BP Screening Camp',
    content: 'Join our free community health screening this Sunday from 8:00 AM to 1:00 PM at New Life Care Centre, Keranitola.',
    type: 'camp',
    isActive: true,
    priority: 3,
    link: '/contact',
  },
  {
    title: '24/7 Doorstep Sample Collection Active',
    content: 'Patients requiring morning fasting tests can book doorstep collection anytime across Midnapore town. Call 097335 25031.',
    type: 'info',
    isActive: true,
    priority: 2,
    link: '/book-collection',
  },
];

export const seedDefaultNotices = async () => {
  try {
    const count = await Notice.countDocuments();
    if (count === 0) {
      await Notice.insertMany(DEFAULT_NOTICES);
      console.log('📢 Seeded initial announcements into MongoDB.');
    }
  } catch (error) {
    console.warn('⚠️ Could not seed notices:', error.message);
  }
};

/**
 * Get active notices for public frontend banner
 */
export const getActiveNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ isActive: true })
      .sort({ priority: -1, createdAt: -1 })
      .lean();
    if (notices.length > 0) {
      return res.json({ success: true, data: notices });
    }
    return res.json({ success: true, data: DEFAULT_NOTICES });
  } catch (error) {
    console.error('[getActiveNotices]', error);
    return res.json({ success: true, data: DEFAULT_NOTICES });
  }
};

/**
 * Get all notices (Admin only)
 */
export const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data: notices });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving notices' });
  }
};

/**
 * Create Notice (Admin only)
 */
export const createNotice = async (req, res) => {
  try {
    const { title, content, type, isActive, priority, link, validUntil } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const notice = new Notice({
      title,
      content,
      type: type || 'info',
      isActive: isActive !== undefined ? isActive : true,
      priority: priority ? Number(priority) : 1,
      link: link || '',
      validUntil: validUntil || undefined,
    });

    await notice.save();

    return res.status(201).json({
      success: true,
      message: 'Notice published successfully',
      data: notice,
    });
  } catch (error) {
    console.error('[createNotice]', error);
    return res.status(500).json({ success: false, message: 'Error creating notice' });
  }
};

/**
 * Update Notice (Admin only)
 */
export const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, isActive, priority, link, validUntil } = req.body;

    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    if (title) notice.title = title;
    if (content) notice.content = content;
    if (type) notice.type = type;
    if (isActive !== undefined) notice.isActive = isActive;
    if (priority !== undefined) notice.priority = Number(priority);
    if (link !== undefined) notice.link = link;
    if (validUntil !== undefined) notice.validUntil = validUntil;

    await notice.save();

    return res.json({
      success: true,
      message: 'Notice updated successfully',
      data: notice,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating notice' });
  }
};

/**
 * Delete Notice (Admin only)
 */
export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await Notice.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting notice' });
  }
};


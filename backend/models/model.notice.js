import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['info', 'alert', 'camp', 'holiday', 'schedule'],
    default: 'info',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  priority: {
    type: Number,
    default: 1, // higher priority shows first
  },
  link: {
    type: String,
    default: '',
  },
  validUntil: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Notice = mongoose.model('Notice', noticeSchema);


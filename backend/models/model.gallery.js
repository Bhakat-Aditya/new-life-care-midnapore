import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  category: {
    type: String,
    enum: ['Facilities', 'Equipment', 'Doctors', 'Events & Camps', 'Diagnostics', 'General'],
    default: 'General',
  },
  imageUrl: {
    type: String,
    default: null,
  },
  cloudinaryPublicId: {
    type: String,
    default: null,
  },
  youtubeUrl: {
    type: String,
    default: null,
    trim: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Gallery = mongoose.model('Gallery', gallerySchema);


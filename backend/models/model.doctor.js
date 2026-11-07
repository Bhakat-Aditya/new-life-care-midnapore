import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  time: { type: String, required: true },
});

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  specialization: { type: String, required: true, trim: true },
  qualification: { type: String, required: true, trim: true },
  experience: { type: String, default: '10+ Years' },
  imageUrl: { type: String, default: null },
  cloudinaryPublicId: { type: String, default: null },
  schedule: [scheduleSchema],
  phone: { type: String, default: '' },
  about: { type: String, default: '' },
  available: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Doctor = mongoose.model('Doctor', doctorSchema);


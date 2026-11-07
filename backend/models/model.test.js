import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  testCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
  },
  turnaround: {
    type: String,
    default: 'Same Day',
  },
  sampleType: {
    type: String,
    default: 'Blood',
  },
  description: {
    type: String,
    default: '',
  },
  includes: [{ type: String }],
  isPackage: {
    type: Boolean,
    default: false,
  },
  source: {
    type: String,
    enum: ['lis', 'manual', 'mock'],
    default: 'mock',
  },
  lastSyncedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const TestItem = mongoose.model('TestItem', testSchema);


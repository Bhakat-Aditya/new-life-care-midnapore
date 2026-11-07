import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['consultation', 'sample_collection'],
    required: true,
  },
  patientName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  department: { type: String, trim: true }, // for consultation
  doctorName: { type: String, trim: true }, // for consultation
  preferredDate: { type: Date, required: true },
  preferredTimeSlot: { type: String },
  address: { type: String, trim: true }, // for home collection
  testsRequested: [{ type: String }], // for sample collection
  notes: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  // Reference ID returned by LIS after forwarding
  lisReferenceId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Booking = mongoose.model('Booking', bookingSchema);


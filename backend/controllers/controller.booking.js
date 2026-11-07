import { Booking } from '../models/model.booking.js';
import lisClient, { isLisConfigured } from '../utils/lisClient.js';

// ─── Create Booking (Consultation or Home Sample Collection) ─────────────────
export const createBooking = async (req, res) => {
  try {
    const {
      type,
      fullName,
      patientName: rawPatientName,
      phone,
      email,
      age,
      gender,
      department,
      doctor,
      doctorName: rawDoctorName,
      date,
      preferredDate: rawPreferredDate,
      timeSlot,
      preferredTimeSlot: rawPreferredTimeSlot,
      address,
      city,
      testsRequested: rawTests,
      totalPrice,
      notes,
      instructions,
    } = req.body;

    // Normalize field names across various frontend forms
    const patientName = (rawPatientName || fullName || '').trim();
    const preferredDate = rawPreferredDate || date;
    const preferredTimeSlot = rawPreferredTimeSlot || timeSlot || 'Morning Slot (8:00 AM – 11:00 AM)';
    const doctorName = rawDoctorName || doctor || null;
    const bookingNotes = notes || instructions || '';
    const fullAddress = address ? (city ? `${address}, ${city}` : address) : null;

    // Normalize tests list to strings
    const testsRequested = Array.isArray(rawTests)
      ? rawTests.map(t => (typeof t === 'string' ? t : t.name || t.id || 'Diagnostic Test'))
      : [];

    if (!type || !patientName || !phone || !preferredDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: type, patient name, phone number, and preferred date are required.',
      });
    }

    // 1. Save booking in local database
    let bookingId = `NLC-${Date.now().toString().slice(-6)}`;
    let lisRef = `LIS-${Date.now().toString(36).toUpperCase()}`;

    try {
      const booking = new Booking({
        type,
        patientName,
        phone,
        email: email || undefined,
        age: age ? Number(age) : undefined,
        gender: gender || undefined,
        department: department || undefined,
        doctorName: doctorName || undefined,
        preferredDate: new Date(preferredDate),
        preferredTimeSlot,
        address: fullAddress,
        testsRequested,
        notes: bookingNotes,
        lisReferenceId: lisRef,
      });

      const savedBooking = await booking.save();
      bookingId = savedBooking._id.toString();
    } catch (dbErr) {
      console.warn('[Booking DB] Failed to save in MongoDB, continuing with memory reference:', dbErr.message);
    }

    // 2. Forward request to Main LIS server if configured
    if (isLisConfigured()) {
      try {
        const lisPayload = {
          bookingType: type,
          patient: { name: patientName, phone, email, age, gender },
          appointment: { date: preferredDate, timeSlot: preferredTimeSlot },
          ...(type === 'consultation' && { department, doctor: doctorName }),
          ...(type === 'sample_collection' && { address: fullAddress, tests: testsRequested, estimatedTotal: totalPrice }),
          notes: bookingNotes,
          middlemanReferenceId: bookingId,
        };

        const lisResponse = await lisClient.post('/api/v1/bookings', lisPayload);
        if (lisResponse.data?.referenceId) {
          lisRef = lisResponse.data.referenceId;
          // Optionally update DB with confirmed LIS reference
          try {
            await Booking.findByIdAndUpdate(bookingId, { lisReferenceId: lisRef });
          } catch (_) {}
        }
      } catch (lisErr) {
        console.warn('[LIS Gateway] Could not forward booking to main hospital server:', lisErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: type === 'sample_collection'
        ? 'Home sample collection booked successfully. Our team will contact you shortly!'
        : 'Doctor consultation scheduled successfully.',
      bookingId,
      lisReferenceId: lisRef,
      data: {
        patientName,
        phone,
        type,
        date: preferredDate,
        timeSlot: preferredTimeSlot,
      },
    });
  } catch (error) {
    console.error('[createBooking]', error);
    return res.status(500).json({ success: false, message: 'Server error while creating booking' });
  }
};

// ─── Get Booking by ID ────────────────────────────────────────────────────────
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).lean();
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    return res.json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving booking' });
  }
};

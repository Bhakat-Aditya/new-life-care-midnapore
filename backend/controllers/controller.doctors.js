import { Doctor } from '../models/model.doctor.js';
import { uploadImageBuffer, deleteCloudinaryImage } from '../utils/cloudinary.js';

// Default static doctors (including poster specialists)
const DEFAULT_DOCTORS = [
  {
    name: 'Dr. D. A. Khan',
    specialization: 'Pediatrics & Child Health',
    qualification: 'MBBS, DCH (KOL), MD PEDIATRICS (PGIMER CHANDIGARH)',
    experience: '15+ Years',
    imageUrl: null,
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Renowned Child Specialist (Pediatrician) with postgraduate training from PGIMER Chandigarh and Kolkata, specializing in newborn care, child development, and pediatric illnesses.',
    order: 1,
  },
  {
    name: 'Dr. Saikat Maiti',
    specialization: 'Cosmetology, Trichology & Hair Transplant',
    qualification: 'MD, NM (Run), Cosmetologist & Trichologist, (PGDCC) E-Derm',
    experience: '10+ Years',
    imageUrl: null,
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Renowned Mentor Hair Transplant Specialist, Cosmetologist and Trichologist specializing in hair restoration, aesthetic dermatology, and skin rejuvenation.',
    order: 2,
  },
  {
    name: 'Dr. S. Mahapatra',
    specialization: 'Orthopedics & Joint Care',
    qualification: 'MBBS, D (Ortho)',
    experience: '12+ Years',
    imageUrl: null,
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Renowned Consultant Orthopedic Surgeon diagnosing and managing bone fractures, arthritis, joint replacements, and musculoskeletal injuries.',
    order: 3,
  },
  {
    name: 'Dr. Sudipto Sit',
    specialization: 'General Medicine & Pain Management',
    qualification: 'MBBS, DNB (General Medicine)',
    experience: '10+ Years',
    imageUrl: null,
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Renowned Medicine Specialist with expertise in chest disorders, thyroid dysfunction, diabetes management, chronic diseases, and comprehensive pain management.',
    order: 4,
  },
  {
    name: 'Dr. Alamgir Sekh',
    specialization: 'General Medicine & Diabetology',
    qualification: 'MBBS, DNB (General Medicine)',
    experience: '10+ Years',
    imageUrl: null,
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Renowned General Medicine Specialist with focused expertise in medicine, chest and respiratory health, thyroid diseases, and blood sugar control.',
    order: 5,
  },
  {
    name: 'Dr. Ujjwal Kumar Bera',
    specialization: 'General Physician & Internal Medicine',
    qualification: 'M.B.B.S., M.D. (PG: SSKM College & Hospital)',
    experience: '12+ Years',
    imageUrl: null,
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Renowned General Physician post-graduated from SSKM College & Hospital (IPGMER Kolkata), treating acute and chronic adult illnesses and preventive healthcare.',
    order: 6,
  },
  {
    name: 'Dr. Supriyo Bal',
    specialization: 'General & Laparoscopic Surgery',
    qualification: 'MBBS, DNB',
    experience: '10+ Years',
    imageUrl: null,
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Renowned General and Laparoscopic Surgeon offering advanced minimally invasive laparoscopic procedures, hernia repair, gallbladder, and general surgical interventions.',
    order: 7,
  },
  {
    name: 'Dr. Swapan Sinha',
    specialization: 'Neurology & Brain Care',
    qualification: 'MBBS (Cal), MD (Med) Bangalore University, DM (Neuro) Bangalore University (NIMHANS), DNB (Med & Neuro) New Delhi',
    experience: '20+ Years',
    imageUrl: null,
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Renowned Senior Consultant Neurologist trained at NIMHANS and New Delhi, specializing in stroke, epilepsy, migraines, neuropathies, and neuro-rehabilitation.',
    order: 8,
  },
  {
    name: 'Dr. Arya Mahapatra',
    specialization: 'Diabetes, Thyroid & Endocrinology',
    qualification: 'M.B.B.S. (NRSMCH), DNB (General Medicine)',
    experience: '10+ Years',
    imageUrl: null,
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Renowned Thyroid and Sugar Specialist from NRS Medical College and DNB board, dedicated to advanced glycemic management, thyroid disorders, and endocrine health.',
    order: 9,
  },
  {
    name: 'Dr. Nileswar Das',
    specialization: 'General Medicine & Critical Care',
    qualification: 'MBBS, MD',
    experience: '15+ Years',
    imageUrl: null,
    schedule: [
      { day: 'Monday', time: '10:00 AM – 1:00 PM' },
      { day: 'Wednesday', time: '10:00 AM – 1:00 PM' },
      { day: 'Friday', time: '5:00 PM – 8:00 PM' },
    ],
    about: 'Senior Consultant with over 15 years experience in internal medicine, critical intensive care, and diagnostic pathology.',
    order: 10,
  },
  {
    name: 'Dr. S K Das',
    specialization: 'Cardiology',
    qualification: 'MBBS, MD (Cardiology)',
    experience: '20+ Years',
    imageUrl: null,
    schedule: [
      { day: 'Tuesday', time: '11:00 AM – 2:00 PM' },
      { day: 'Thursday', time: '5:00 PM – 8:00 PM' },
      { day: 'Saturday', time: '10:00 AM – 1:00 PM' },
    ],
    about: 'Expert cardiologist specializing in non-invasive cardiac evaluation, ECG, Holter diagnostics, and preventive cardiology.',
    order: 11,
  },
  {
    name: 'Dr. Saubhik Dasukil',
    specialization: 'Orthopedics',
    qualification: 'MBBS, MS (Ortho)',
    experience: '12+ Years',
    imageUrl: null,
    schedule: [
      { day: 'Monday', time: '5:00 PM – 8:00 PM' },
      { day: 'Wednesday', time: '5:00 PM – 8:00 PM' },
      { day: 'Saturday', time: '11:00 AM – 2:00 PM' },
    ],
    about: 'Consultant Orthopedic Surgeon diagnosing bone and joint disorders, sports injuries, arthritis, and spine conditions.',
    order: 12,
  },
  {
    name: 'Dr. MD. Taquedis Nuri',
    specialization: 'Gynecology & Obstetrics',
    qualification: 'MBBS, MS (Gynae)',
    experience: '18+ Years',
    imageUrl: null,
    schedule: [
      { day: 'Tuesday', time: '10:00 AM – 1:00 PM' },
      { day: 'Friday', time: '10:00 AM – 1:00 PM' },
      { day: 'Sunday', time: '10:00 AM – 12:00 PM' },
    ],
    about: 'Experienced gynecologist and obstetrician providing comprehensive women health services, antenatal care, and fertility guidance.',
    order: 13,
  },
  {
    name: 'Dr. Soumen Das',
    specialization: 'Diabetes & Endocrinology',
    qualification: 'MBBS, MD (Medicine)',
    experience: '10+ Years',
    imageUrl: null,
    schedule: [
      { day: 'Monday', time: '3:00 PM – 6:00 PM' },
      { day: 'Thursday', time: '10:00 AM – 1:00 PM' },
      { day: 'Saturday', time: '3:00 PM – 6:00 PM' },
    ],
    about: 'Dedicated specialist in glycemic control, metabolic health, thyroid dysfunctions, and chronic lifestyle disease management.',
    order: 14,
  },
];

/**
 * Seed initial doctors in MongoDB if empty or missing.
 * Uses upsert with $setOnInsert so existing doctor records and uploaded photos are preserved.
 */
export const seedDefaultDoctors = async () => {
  try {
    let seededCount = 0;
    for (const doc of DEFAULT_DOCTORS) {
      const res = await Doctor.updateOne(
        { name: doc.name },
        { $setOnInsert: doc },
        { upsert: true }
      );
      if (res.upsertedCount > 0) seededCount++;
    }
    if (seededCount > 0) {
      console.log(`🩺 Seeded ${seededCount} missing doctors into MongoDB.`);
    } else {
      console.log('🩺 All default doctors verified in MongoDB.');
    }
  } catch (error) {
    console.warn('⚠️ Could not seed doctors into MongoDB:', error.message);
  }
};

/**
 * Get all doctors (sorted by order/name)
 */
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ order: 1, name: 1 }).lean();
    if (doctors.length > 0) {
      return res.json({ success: true, data: doctors });
    }
    return res.json({ success: true, data: DEFAULT_DOCTORS });
  } catch (error) {
    console.error('[getDoctors]', error);
    return res.json({ success: true, data: DEFAULT_DOCTORS });
  }
};

/**
 * Get doctor by ID
 */
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).lean();
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    return res.json({ success: true, data: doctor });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Create Doctor with Cloudinary image upload (Admin only)
 */
export const createDoctor = async (req, res) => {
  try {
    const { name, specialization, qualification, experience, schedule, phone, about, order } = req.body;

    if (!name || !specialization || !qualification) {
      return res.status(400).json({
        success: false,
        message: 'Doctor name, specialization, and qualification are required',
      });
    }

    let imageUrl = null;
    let cloudinaryPublicId = null;

    // Handle Cloudinary upload if an image was provided
    if (req.file) {
      const uploadRes = await uploadImageBuffer(
        req.file.buffer,
        'newlifecare/doctors',
        req.file.mimetype
      );
      imageUrl = uploadRes.url;
      cloudinaryPublicId = uploadRes.publicId;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    let parsedSchedule = [];
    if (schedule) {
      try {
        parsedSchedule = typeof schedule === 'string' ? JSON.parse(schedule) : schedule;
      } catch (_) {
        parsedSchedule = [{ day: 'Mon–Sat', time: schedule }];
      }
    }

    const doctor = new Doctor({
      name,
      specialization,
      qualification,
      experience: experience || '10+ Years',
      imageUrl,
      cloudinaryPublicId,
      schedule: parsedSchedule,
      phone: phone || '',
      about: about || '',
      order: order ? Number(order) : 0,
    });

    await doctor.save();

    return res.status(201).json({
      success: true,
      message: 'Doctor added successfully',
      data: doctor,
    });
  } catch (error) {
    console.error('[createDoctor]', error);
    return res.status(500).json({ success: false, message: 'Error adding doctor' });
  }
};

/**
 * Update Doctor with optional new Cloudinary image (Admin only)
 */
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const { name, specialization, qualification, experience, schedule, phone, about, available, order } = req.body;

    if (name) doctor.name = name;
    if (specialization) doctor.specialization = specialization;
    if (qualification) doctor.qualification = qualification;
    if (experience) doctor.experience = experience;
    if (phone !== undefined) doctor.phone = phone;
    if (about !== undefined) doctor.about = about;
    if (available !== undefined) doctor.available = available === 'true' || available === true;
    if (order !== undefined) doctor.order = Number(order);

    if (schedule) {
      try {
        doctor.schedule = typeof schedule === 'string' ? JSON.parse(schedule) : schedule;
      } catch (_) {
        doctor.schedule = [{ day: 'Mon–Sat', time: schedule }];
      }
    }

    // New image upload to Cloudinary
    if (req.file) {
      // Delete previous image from Cloudinary if existed
      if (doctor.cloudinaryPublicId) {
        await deleteCloudinaryImage(doctor.cloudinaryPublicId);
      }

      const uploadRes = await uploadImageBuffer(
        req.file.buffer,
        'newlifecare/doctors',
        req.file.mimetype
      );
      doctor.imageUrl = uploadRes.url;
      doctor.cloudinaryPublicId = uploadRes.publicId;
    } else if (req.body.imageUrl) {
      doctor.imageUrl = req.body.imageUrl;
    }

    await doctor.save();

    return res.json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: doctor,
    });
  } catch (error) {
    console.error('[updateDoctor]', error);
    return res.status(500).json({ success: false, message: 'Error updating doctor profile' });
  }
};

/**
 * Delete Doctor (Admin only)
 */
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    if (doctor.cloudinaryPublicId) {
      await deleteCloudinaryImage(doctor.cloudinaryPublicId);
    }

    await Doctor.findByIdAndDelete(req.params.id);

    return res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting doctor' });
  }
};

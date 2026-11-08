import { Doctor } from '../models/model.doctor.js';
import { uploadImageBuffer, deleteCloudinaryImage } from '../utils/cloudinary.js';

// Default static doctors (all verified specialists from official flyers and posters)
const DEFAULT_DOCTORS = [
  {
    name: 'Dr. S. K. Das',
    specialization: 'Orthopedics & Joint Surgery',
    qualification: 'MS (Ortho), (AIIMS) New Delhi',
    experience: '15+ Years',
    imageUrl: '/images/doctors/dr-sk-das.jpg',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Renowned Orthopedic Surgeon from AIIMS New Delhi specializing in arthroscopy, micro surgery, trauma, spine, and ligament replacement surgery.',
    order: 1,
  },
  {
    name: 'Dr. Niket Arora',
    specialization: 'Cardiothoracic & Vascular Surgery',
    qualification: 'MBBS, DNB (Cardio Thoracic Surgery)',
    experience: '12+ Years',
    imageUrl: '/images/doctors/dr-niket-arora.jpg',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Senior Consultant Cardiothoracic & Vascular Surgeon attached with Manipal Hospitals. WBMC Reg No: 82887. Member of European Association of Cardiothoracic Surgeons (EACTS) and IACTS.',
    order: 2,
  },
  {
    name: 'Dr. Panchanan Panigrahi',
    specialization: 'Surgical Gastroenterology & GI Surgery',
    qualification: 'MBBS, MS (Gen. Surgery), MCH Surgical Gastroenterology (BHU), FIAGES, EFIAGES, FAGIE',
    experience: '14+ Years',
    imageUrl: '/images/doctors/dr-panchanan-panigrahi.jpg',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Consultant Surgical Gastroenterologist & Advanced GI, Endo, Laser and Laparoscopic Surgeon from BHU & Hitech Medical College Bhubaneswar, specializing in stomach, liver, and biliary diseases.',
    order: 3,
  },
  {
    name: 'Dr. Ayesha Sultana',
    specialization: 'Gynecology & Obstetrics',
    qualification: 'MBBS (Kol), MS (G&O) (Kol), D.N.B. (G&O), MRCOG (London)',
    experience: '12+ Years',
    imageUrl: '/images/doctors/dr-ayesha-sultana.jpg',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Renowned Obstetrician & Gynecologist holding MRCOG London and DNB from National Board Delhi, providing expert care for menstrual disorders, pregnancy, and women’s health.',
    order: 4,
  },
  {
    name: 'Dr. Archisman Haldar',
    specialization: 'Neurology & Brain Care',
    qualification: 'MBBS (AIIMS–Bhubaneswar), MD–Medicine (AIIMS, Delhi), DM–Neuro (AIIMS–Bhubaneswar)',
    experience: '10+ Years',
    imageUrl: '/images/doctors/dr-archisman-haldar.jpg',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Distinguished Neurologist from AIIMS New Delhi and AIIMS Bhubaneswar, specializing in seizures, epilepsy, stroke, neuropathy, and neurological disorders.',
    order: 5,
  },
  {
    name: 'Dr. Samujjwal Das',
    specialization: 'Head & Neck Oncosurgery',
    qualification: 'MBBS, MDS (Oral and Maxillofacial Surgery)',
    experience: '10+ Years',
    imageUrl: '/images/doctors/dr-samujjwal-das.jpg',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Renowned Head and Neck Oncosurgeon attached with Desun Hospital Kolkata, diagnosing and treating oral, mouth, throat, and neck tumors and maxillofacial conditions.',
    order: 6,
  },
  {
    name: 'Dr. Biswajit Panda',
    specialization: 'General & Laparoscopic Surgery',
    qualification: 'MBBS, MS (General Laparoscopic Surgeon)',
    experience: '10+ Years',
    imageUrl: '/images/doctors/dr-biswajit-panda.jpg',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Renowned General and Laparoscopic Surgeon offering advanced minimally invasive laparoscopic procedures for hernia, gallbladder stones, and acute surgical conditions.',
    order: 7,
  },
  {
    name: 'Dr. Sudipto Sit',
    specialization: 'General Medicine & Pain Management',
    qualification: 'MBBS, DNB (General Medicine)',
    experience: '10+ Years',
    imageUrl: '/images/doctors/dr-sudipto-sit.jpg',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Renowned Medicine Specialist attached to Midnapore Medical College & Hospital, with focused expertise in chest diseases, thyroid disorders, diabetes management, and chronic pain management.',
    order: 8,
  },
  {
    name: 'Dr. Konika Das',
    specialization: 'Neuropsychiatry & Behavioral Health',
    qualification: 'MBBS, MD Psychiatry (SSKM), Regd no: 75006 of WBMC',
    experience: '10+ Years',
    imageUrl: '/images/doctors/dr-konika-das.jpg',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Consultant Neuropsychiatrist post-graduated from SSKM Hospital (WBMC Reg: 75006), specializing in clinical depression, anxiety, panic disorders, sleep issues, and psychiatric counseling.',
    order: 9,
  },
  {
    name: 'Dr. Arpita Maiti',
    specialization: 'Gynecology, Obstetrics & Infertility',
    qualification: 'MBBS (Cal), DGO (Cal)',
    experience: '15+ Years',
    imageUrl: '/images/doctors/dr-arpita-maiti.jpg',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Consultant Gynecologist, Obstetrician, and Infertility & Assisted Reproduction Specialist, formerly associated with Midnapore Medical College & Hospital.',
    order: 10,
  },
  {
    name: 'Dr. Sushovan Maiti',
    specialization: 'Gastroenterology & Hepatology',
    qualification: 'M.B.B.S. (Calcutta Univ), M.S. (SSKM Hospital), Formerly Asian Institute of Gastroenterology (Hyderabad)',
    experience: '18+ Years',
    imageUrl: '/images/doctors/dr-sushovan-maiti.jpg',
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Eminent Gastroenterologist post-graduated from SSKM Hospital and formerly with Asian Institute of Gastroenterology (AIG) Hyderabad, treating acid peptic disorders, liver conditions, and GI diseases.',
    order: 11,
  },
  {
    name: 'Dr. D. A. Khan',
    specialization: 'Pediatrics & Child Health',
    qualification: 'MBBS, DCH (KOL), MD PEDIATRICS (PGIMER CHANDIGARH)',
    experience: '15+ Years',
    imageUrl: null,
    schedule: [{ day: 'Monday – Saturday', time: 'Consultation by Appointment' }],
    phone: '+91 9733525031',
    about: 'Renowned Child Specialist (Pediatrician) with postgraduate training from PGIMER Chandigarh and Kolkata, specializing in newborn care, child development, and pediatric illnesses.',
    order: 12,
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
    order: 13,
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
    order: 14,
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
    order: 15,
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
    order: 16,
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
    order: 17,
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
    order: 18,
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
    order: 19,
  },
];

/**
 * Seed initial doctors in MongoDB if empty or missing.
 * Uses upsert with $setOnInsert so existing doctor records and uploaded photos are preserved.
 */
export const seedDefaultDoctors = async () => {
  try {
    // Clean up any deprecated placeholder/dummy doctors if present
    const DEPRECATED_DEFAULT_NAMES = [
      'Dr. Nileswar Das',
      'Dr. Saubhik Dasukil',
      'Dr. MD. Taquedis Nuri',
      'Dr. Soumen Das',
    ];
    await Doctor.deleteMany({ name: { $in: DEPRECATED_DEFAULT_NAMES } });

    let seededCount = 0;
    for (const doc of DEFAULT_DOCTORS) {
      const res = await Doctor.updateOne(
        { name: doc.name },
        { $set: doc },
        { upsert: true }
      );
      if (res.upsertedCount > 0) seededCount++;
    }
    if (seededCount > 0) {
      console.log(`🩺 Seeded/updated ${seededCount} official doctors into MongoDB.`);
    } else {
      console.log('🩺 All official doctors verified in MongoDB.');
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

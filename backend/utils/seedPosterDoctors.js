import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Doctor } from '../models/model.doctor.js';

dotenv.config();

export const POSTER_DOCTORS = [
  {
    name: 'Dr. D. A. Khan',
    specialization: 'Pediatrics & Child Health',
    qualification: 'MBBS, DCH (KOL), MD PEDIATRICS (PGIMER CHANDIGARH)',
    experience: '15+ Years',
    imageUrl: null,
    cloudinaryPublicId: null,
    schedule: [
      { day: 'Monday – Saturday', time: 'Consultation by Appointment' },
    ],
    phone: '+91 9733525031',
    about: 'Renowned Child Specialist (Pediatrician) with postgraduate training from PGIMER Chandigarh and Kolkata, specializing in newborn care, child development, and pediatric illnesses.',
    available: true,
    order: 1,
  },
  {
    name: 'Dr. Saikat Maiti',
    specialization: 'Cosmetology, Trichology & Hair Transplant',
    qualification: 'MD, NM (Run), Cosmetologist & Trichologist, (PGDCC) E-Derm',
    experience: '10+ Years',
    imageUrl: null,
    cloudinaryPublicId: null,
    schedule: [
      { day: 'Monday – Saturday', time: 'Consultation by Appointment' },
    ],
    phone: '+91 9733525031',
    about: 'Renowned Mentor Hair Transplant Specialist, Cosmetologist and Trichologist specializing in hair restoration, aesthetic dermatology, and skin rejuvenation.',
    available: true,
    order: 2,
  },
  {
    name: 'Dr. S. Mahapatra',
    specialization: 'Orthopedics & Joint Care',
    qualification: 'MBBS, D (Ortho)',
    experience: '12+ Years',
    imageUrl: null,
    cloudinaryPublicId: null,
    schedule: [
      { day: 'Monday – Saturday', time: 'Consultation by Appointment' },
    ],
    phone: '+91 9733525031',
    about: 'Renowned Consultant Orthopedic Surgeon diagnosing and managing bone fractures, arthritis, joint replacements, and musculoskeletal injuries.',
    available: true,
    order: 3,
  },
  {
    name: 'Dr. Sudipto Sit',
    specialization: 'General Medicine & Pain Management',
    qualification: 'MBBS, DNB (General Medicine)',
    experience: '10+ Years',
    imageUrl: null,
    cloudinaryPublicId: null,
    schedule: [
      { day: 'Monday – Saturday', time: 'Consultation by Appointment' },
    ],
    phone: '+91 9733525031',
    about: 'Renowned Medicine Specialist with expertise in chest disorders, thyroid dysfunction, diabetes management, chronic diseases, and comprehensive pain management.',
    available: true,
    order: 4,
  },
  {
    name: 'Dr. Alamgir Sekh',
    specialization: 'General Medicine & Diabetology',
    qualification: 'MBBS, DNB (General Medicine)',
    experience: '10+ Years',
    imageUrl: null,
    cloudinaryPublicId: null,
    schedule: [
      { day: 'Monday – Saturday', time: 'Consultation by Appointment' },
    ],
    phone: '+91 9733525031',
    about: 'Renowned General Medicine Specialist with focused expertise in medicine, chest and respiratory health, thyroid diseases, and blood sugar control.',
    available: true,
    order: 5,
  },
  {
    name: 'Dr. Ujjwal Kumar Bera',
    specialization: 'General Physician & Internal Medicine',
    qualification: 'M.B.B.S., M.D. (PG: SSKM College & Hospital)',
    experience: '12+ Years',
    imageUrl: null,
    cloudinaryPublicId: null,
    schedule: [
      { day: 'Monday – Saturday', time: 'Consultation by Appointment' },
    ],
    phone: '+91 9733525031',
    about: 'Renowned General Physician post-graduated from SSKM College & Hospital (IPGMER Kolkata), treating acute and chronic adult illnesses and preventive healthcare.',
    available: true,
    order: 6,
  },
  {
    name: 'Dr. Supriyo Bal',
    specialization: 'General & Laparoscopic Surgery',
    qualification: 'MBBS, DNB',
    experience: '10+ Years',
    imageUrl: null,
    cloudinaryPublicId: null,
    schedule: [
      { day: 'Monday – Saturday', time: 'Consultation by Appointment' },
    ],
    phone: '+91 9733525031',
    about: 'Renowned General and Laparoscopic Surgeon offering advanced minimally invasive laparoscopic procedures, hernia repair, gallbladder, and general surgical interventions.',
    available: true,
    order: 7,
  },
  {
    name: 'Dr. Swapan Sinha',
    specialization: 'Neurology & Brain Care',
    qualification: 'MBBS (Cal), MD (Med) Bangalore University, DM (Neuro) Bangalore University (NIMHANS), DNB (Med & Neuro) New Delhi',
    experience: '20+ Years',
    imageUrl: null,
    cloudinaryPublicId: null,
    schedule: [
      { day: 'Monday – Saturday', time: 'Consultation by Appointment' },
    ],
    phone: '+91 9733525031',
    about: 'Renowned Senior Consultant Neurologist trained at NIMHANS and New Delhi, specializing in stroke, epilepsy, migraines, neuropathies, and neuro-rehabilitation.',
    available: true,
    order: 8,
  },
  {
    name: 'Dr. Arya Mahapatra',
    specialization: 'Diabetes, Thyroid & Endocrinology',
    qualification: 'M.B.B.S. (NRSMCH), DNB (General Medicine)',
    experience: '10+ Years',
    imageUrl: null,
    cloudinaryPublicId: null,
    schedule: [
      { day: 'Monday – Saturday', time: 'Consultation by Appointment' },
    ],
    phone: '+91 9733525031',
    about: 'Renowned Thyroid and Sugar Specialist from NRS Medical College and DNB board, dedicated to advanced glycemic management, thyroid disorders, and endocrine health.',
    available: true,
    order: 9,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Upsert each poster doctor so we don't create duplicates
    for (const doc of POSTER_DOCTORS) {
      const updated = await Doctor.findOneAndUpdate(
        { name: doc.name },
        { $set: doc },
        { upsert: true, new: true }
      );
      console.log(`✅ Upserted Doctor: ${updated.name} (${updated.specialization})`);
    }

    const total = await Doctor.countDocuments();
    console.log(`🎉 Total Doctors in MongoDB: ${total}`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding doctors:', err);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1]?.endsWith('seedPosterDoctors.js')) {
  seed();
}




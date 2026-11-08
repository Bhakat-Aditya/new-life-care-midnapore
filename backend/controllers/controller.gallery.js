import { Gallery } from '../models/model.gallery.js';
import { uploadImageBuffer, deleteCloudinaryImage } from '../utils/cloudinary.js';

// Initial gallery items showcasing actual New Life Care facilities, equipment & doctors
const DEFAULT_GALLERY = [
  {
    title: 'NABL Accredited Pathology Laboratory Floor',
    description: 'Fully computerized pathology testing floor featuring automated chemistry analyzers, digital microscopes, and neuro-investigations setup.',
    category: 'Equipment',
    imageUrl: '/images/lab-interior-ncv-eeg.jpg',
    featured: true,
  },
  {
    title: 'Automated Biochemistry & Cell Counter Analyzers',
    description: 'High-throughput AutoQuant biochemistry analyzer and computerized 5-part hematology cell counter for precision blood diagnostics.',
    category: 'Equipment',
    imageUrl: '/images/lab-packages-equipment.jpg',
    featured: true,
  },
  {
    title: 'Diagnostic Testing Station & Oxygen Support',
    description: 'Dedicated diagnostic testing bay with computerized ECG, 24-hr Holter, PFT, EEG and emergency oxygen cylinder availability.',
    category: 'Facilities',
    imageUrl: '/images/lab-equipment-oxygen.jpg',
    featured: true,
  },
  {
    title: 'New Life Care Diagnostic Centre - Accredited Centre',
    description: 'NABL M(EL)T Accredited & ISO 9001:2015 Certified Diagnostic Centre located at Keranitola, Midnapore Town.',
    category: 'Facilities',
    imageUrl: '/images/banner-main.jpg',
    featured: true,
  },
  {
    title: 'Visiting Medical Specialists & Surgeon Panel',
    description: 'Official panel of 19 experienced specialist doctors across cardiology, neurology, gastroenterology, orthopedics, gynecology, and surgery.',
    category: 'Doctors',
    imageUrl: '/images/poster-visiting-doctors.jpg',
    featured: true,
  },
  {
    title: 'Orthopedic & Joint Surgery - Dr. S. K. Das',
    description: 'AIIMS New Delhi trained orthopedic surgeon for arthroscopy, trauma, joint reconstruction, and spine care.',
    category: 'Doctors',
    imageUrl: '/images/doctors/dr-sk-das.jpg',
    featured: false,
  },
  {
    title: 'Cardiothoracic Surgery - Dr. Niket Arora',
    description: 'Senior Consultant from Manipal Hospitals for advanced cardiovascular and thoracic surgical advisories.',
    category: 'Doctors',
    imageUrl: '/images/doctors/dr-niket-arora.jpg',
    featured: false,
  },
  {
    title: 'Surgical Gastroenterology - Dr. Panchanan Panigrahi',
    description: 'Specialized gastrointestinal, laparoscopic, and hepatology diagnostic consultations from BHU.',
    category: 'Doctors',
    imageUrl: '/images/doctors/dr-panchanan-panigrahi.jpg',
    featured: false,
  },
  {
    title: 'Gynecology & High-Risk Pregnancy - Dr. Ayesha Sultana',
    description: 'MRCOG London and DNB specialist providing women healthcare, antenatal consultation, and reproductive health advisory.',
    category: 'Doctors',
    imageUrl: '/images/doctors/dr-ayesha-sultana.jpg',
    featured: false,
  },
  {
    title: 'Neurology & Epilepsy Care - Dr. Archisman Haldar',
    description: 'AIIMS-trained neurology specialist providing diagnosis for epilepsy, neuropathies, and stroke care.',
    category: 'Doctors',
    imageUrl: '/images/doctors/dr-archisman-haldar.jpg',
    featured: false,
  },
  {
    title: 'Head & Neck Oncosurgery - Dr. Samujjwal Das',
    description: 'Specialist consultation from Desun Hospital for oral, facial, head and neck tumor evaluation.',
    category: 'Doctors',
    imageUrl: '/images/doctors/dr-samujjwal-das.jpg',
    featured: false,
  },
  {
    title: 'General & Laparoscopic OT Team - Dr. Biswajit Panda',
    description: 'State-of-the-art operating theater setup for minimally invasive laparoscopic hernia and gallstone procedures.',
    category: 'Doctors',
    imageUrl: '/images/doctors/dr-biswajit-panda.jpg',
    featured: false,
  },
  {
    title: 'Neuropsychiatry & Behavioral Health - Dr. Konika Das',
    description: 'SSKM-trained consultant neuropsychiatrist for anxiety, depression, sleep disorders, and psychiatric counseling.',
    category: 'Doctors',
    imageUrl: '/images/doctors/dr-konika-das.jpg',
    featured: false,
  },
  {
    title: 'Gynecology & Infertility - Dr. Arpita Maiti',
    description: 'Consultant Gynecologist, Obstetrician, and Infertility Specialist, Ex-Midnapore Medical College & Hospital.',
    category: 'Doctors',
    imageUrl: '/images/doctors/dr-arpita-maiti.jpg',
    featured: false,
  },
  {
    title: 'Gastroenterology & Hepatology - Dr. Sushovan Maiti',
    description: 'SSKM & Asian Institute of Gastroenterology (AIG) specialist treating acid peptic disorders and liver diseases.',
    category: 'Doctors',
    imageUrl: '/images/doctors/dr-sushovan-maiti.jpg',
    featured: false,
  },
];

/**
 * Seed initial gallery items in MongoDB if empty or refresh with real photos.
 */
export const seedDefaultGallery = async () => {
  try {
    // If only old placeholder items exist, refresh with real gallery
    const hasReal = await Gallery.findOne({ imageUrl: /^\/images\// });
    if (!hasReal) {
      await Gallery.deleteMany({});
      await Gallery.insertMany(DEFAULT_GALLERY);
      console.log('🖼️ Seeded real clinic & lab gallery items into MongoDB.');
    }
  } catch (error) {
    console.warn('⚠️ Could not seed gallery into MongoDB:', error.message);
  }
};

/**
 * Get all gallery items (public)
 */
export const getGalleryItems = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category.toLowerCase() !== 'all') {
      filter.category = category;
    }

    const items = await Gallery.find(filter).sort({ featured: -1, createdAt: -1 }).lean();
    if (items.length > 0) {
      return res.json({ success: true, data: items });
    }
    return res.json({ success: true, data: DEFAULT_GALLERY });
  } catch (error) {
    console.error('[getGalleryItems]', error);
    return res.json({ success: true, data: DEFAULT_GALLERY });
  }
};

/**
 * Add photo / video to Gallery with Cloudinary upload (Admin only)
 */
export const createGalleryItem = async (req, res) => {
  try {
    const { title, description, category, youtubeUrl, featured } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Gallery item title is required' });
    }

    let imageUrl = null;
    let cloudinaryPublicId = null;

    if (req.file) {
      const uploadRes = await uploadImageBuffer(
        req.file.buffer,
        'newlifecare/gallery',
        req.file.mimetype
      );
      imageUrl = uploadRes.url;
      cloudinaryPublicId = uploadRes.publicId;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    if (!imageUrl && !youtubeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either an image (file or URL) or a YouTube video link',
      });
    }

    const item = new Gallery({
      title,
      description: description || '',
      category: category || 'General',
      imageUrl,
      cloudinaryPublicId,
      youtubeUrl: youtubeUrl || null,
      featured: featured === 'true' || featured === true,
    });

    await item.save();

    return res.status(201).json({
      success: true,
      message: 'Gallery item added successfully',
      data: item,
    });
  } catch (error) {
    console.error('[createGalleryItem]', error);
    return res.status(500).json({ success: false, message: 'Error adding gallery item' });
  }
};

/**
 * Update gallery item (Admin only)
 */
export const updateGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    const { title, description, category, youtubeUrl, featured } = req.body;

    if (title) item.title = title;
    if (description !== undefined) item.description = description;
    if (category) item.category = category;
    if (youtubeUrl !== undefined) item.youtubeUrl = youtubeUrl;
    if (featured !== undefined) item.featured = featured === 'true' || featured === true;

    if (req.file) {
      if (item.cloudinaryPublicId) {
        await deleteCloudinaryImage(item.cloudinaryPublicId);
      }
      const uploadRes = await uploadImageBuffer(
        req.file.buffer,
        'newlifecare/gallery',
        req.file.mimetype
      );
      item.imageUrl = uploadRes.url;
      item.cloudinaryPublicId = uploadRes.publicId;
    } else if (req.body.imageUrl) {
      item.imageUrl = req.body.imageUrl;
    }

    await item.save();

    return res.json({
      success: true,
      message: 'Gallery item updated successfully',
      data: item,
    });
  } catch (error) {
    console.error('[updateGalleryItem]', error);
    return res.status(500).json({ success: false, message: 'Error updating gallery item' });
  }
};

/**
 * Delete gallery item (Admin only)
 */
export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    if (item.cloudinaryPublicId) {
      await deleteCloudinaryImage(item.cloudinaryPublicId);
    }

    await Gallery.findByIdAndDelete(req.params.id);

    return res.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting gallery item' });
  }
};


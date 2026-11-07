import { Gallery } from '../models/model.gallery.js';
import { uploadImageBuffer, deleteCloudinaryImage } from '../utils/cloudinary.js';

// Initial gallery items showcasing facilities & team
const DEFAULT_GALLERY = [
  {
    title: 'Advanced Pathology Laboratory',
    description: 'Fully automated biochemistry and hematology analyzers for rapid, high-precision results.',
    category: 'Equipment',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    title: 'Digital X-Ray Suite',
    description: 'Low-dose digital radiography unit providing crystal-clear imaging in seconds.',
    category: 'Equipment',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    title: 'Comfortable Patient Waiting Lounge',
    description: 'Clean, sanitized, and air-conditioned reception and waiting area for patients and families.',
    category: 'Facilities',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    title: 'Ultrasonography (USG) Room',
    description: 'High-definition 3D/4D ultrasound scanner with color Doppler capabilities.',
    category: 'Facilities',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    title: 'Community Free Health Camp',
    description: 'Routine blood sugar, pressure checkup, and health awareness camp organized by New Life Care.',
    category: 'Events & Camps',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    title: 'Doctor Consultation & Health Advisory',
    description: 'Video guide: Understanding early warning signs of cardiovascular and metabolic disorders.',
    category: 'Doctors',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    featured: true,
  },
];

/**
 * Seed initial gallery items in MongoDB if empty.
 */
export const seedDefaultGallery = async () => {
  try {
    const count = await Gallery.countDocuments();
    if (count === 0) {
      await Gallery.insertMany(DEFAULT_GALLERY);
      console.log('🖼️ Seeded initial gallery items into MongoDB.');
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


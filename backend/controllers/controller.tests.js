import lisClient, { isLisConfigured } from '../utils/lisClient.js';
import { TestItem } from '../models/model.test.js';
import { syncTestsFromLIS, getSyncStatus } from '../utils/scheduler.sync.js';

// ─── DUMMY DATA (used until LIS API is provided or seeded in DB) ───────────────
const DUMMY_TESTS = [
  { testCode: 'CBC', id: 'CBC', name: 'Complete Blood Count (CBC)', category: 'Pathology', price: 250, turnaround: '4-6 hours', sampleType: 'Blood' },
  { testCode: 'LFT', id: 'LFT', name: 'Liver Function Test (LFT)', category: 'Pathology', price: 450, turnaround: '6-8 hours', sampleType: 'Blood' },
  { testCode: 'KFT', id: 'KFT', name: 'Kidney Function Test (KFT)', category: 'Pathology', price: 500, turnaround: '6-8 hours', sampleType: 'Blood' },
  { testCode: 'LIPID', id: 'LIPID', name: 'Lipid Profile', category: 'Pathology', price: 350, turnaround: '6-8 hours', sampleType: 'Blood' },
  { testCode: 'THYROID', id: 'THYROID', name: 'Thyroid Function (T3, T4, TSH)', category: 'Pathology', price: 600, turnaround: '8-12 hours', sampleType: 'Blood' },
  { testCode: 'SUGAR_F', id: 'SUGAR_F', name: 'Blood Sugar (Fasting)', category: 'Pathology', price: 80, turnaround: '1-2 hours', sampleType: 'Blood' },
  { testCode: 'SUGAR_PP', id: 'SUGAR_PP', name: 'Blood Sugar (Post-Prandial)', category: 'Pathology', price: 80, turnaround: '1-2 hours', sampleType: 'Blood' },
  { testCode: 'HBA1C', id: 'HBA1C', name: 'HbA1c (Glycated Haemoglobin)', category: 'Pathology', price: 400, turnaround: '4-6 hours', sampleType: 'Blood' },
  { testCode: 'URINE_R', id: 'URINE_R', name: 'Urine Routine & Microscopy', category: 'Pathology', price: 120, turnaround: '2-4 hours', sampleType: 'Urine' },
  { testCode: 'WIDAL', id: 'WIDAL', name: 'Widal Test', category: 'Pathology', price: 150, turnaround: '4-6 hours', sampleType: 'Blood' },
  { testCode: 'DENGUE_NS1', id: 'DENGUE_NS1', name: 'Dengue NS1 Antigen', category: 'Pathology', price: 500, turnaround: '4-6 hours', sampleType: 'Blood' },
  { testCode: 'MALARIA', id: 'MALARIA', name: 'Malaria Antigen Test', category: 'Pathology', price: 200, turnaround: '1-2 hours', sampleType: 'Blood' },
  { testCode: 'USG_ABDOMEN', id: 'USG_ABDOMEN', name: 'USG Abdomen & Pelvis', category: 'USG', price: 800, turnaround: 'Immediate', sampleType: 'Non-invasive' },
  { testCode: 'USG_WHOLE', id: 'USG_WHOLE', name: 'USG Whole Abdomen', category: 'USG', price: 1000, turnaround: 'Immediate', sampleType: 'Non-invasive' },
  { testCode: 'ECHO', id: 'ECHO', name: 'Echocardiography', category: 'Cardiology', price: 1200, turnaround: 'Immediate', sampleType: 'Non-invasive' },
  { testCode: 'ECG_12', id: 'ECG_12', name: 'ECG (12 Lead)', category: 'Cardiology', price: 150, turnaround: 'Immediate', sampleType: 'Non-invasive' },
  { testCode: 'HOLTER', id: 'HOLTER', name: 'Holter Monitoring (24hr)', category: 'Cardiology', price: 2500, turnaround: '24 hours', sampleType: 'Wearable' },
  { testCode: 'XRAY_CHEST', id: 'XRAY_CHEST', name: 'X-Ray Chest (Digital)', category: 'Radiology', price: 300, turnaround: 'Immediate', sampleType: 'Digital X-Ray' },
  { testCode: 'XRAY_LS', id: 'XRAY_LS', name: 'X-Ray Lumbo-Sacral Spine', category: 'Radiology', price: 400, turnaround: 'Immediate', sampleType: 'Digital X-Ray' },
  { testCode: 'PFT', id: 'PFT', name: 'Pulmonary Function Test (PFT)', category: 'Pulmonology', price: 500, turnaround: 'Immediate', sampleType: 'Spirometry' },
];

const DUMMY_PACKAGES = [
  {
    id: 'PKG_BASIC',
    testCode: 'PKG_BASIC',
    name: 'Basic Health Checkup',
    category: 'Packages',
    price: 999,
    originalPrice: 1500,
    tests: ['CBC', 'Blood Sugar (Fasting)', 'Urine Routine', 'LFT', 'KFT'],
    description: 'Essential health screening for routine health monitoring.',
    popular: false,
    isPackage: true,
  },
  {
    id: 'PKG_COMP',
    testCode: 'PKG_COMP',
    name: 'Comprehensive Health Checkup',
    category: 'Packages',
    price: 2499,
    originalPrice: 3800,
    tests: ['CBC', 'LFT', 'KFT', 'Lipid Profile', 'Thyroid Profile', 'Blood Sugar', 'HbA1c', 'Urine Routine', 'ECG', 'X-Ray Chest'],
    description: 'Full-body health assessment covering all vital organ parameters.',
    popular: true,
    isPackage: true,
  },
  {
    id: 'PKG_CARDIAC',
    testCode: 'PKG_CARDIAC',
    name: 'Cardiac Health Package',
    category: 'Packages',
    price: 1799,
    originalPrice: 2600,
    tests: ['ECG', 'Lipid Profile', 'Blood Sugar', 'CBC', 'CRP', 'Echocardiography'],
    description: 'Comprehensive cardiac risk assessment and heart rhythm analysis.',
    popular: false,
    isPackage: true,
  },
  {
    id: 'PKG_DIABETES',
    testCode: 'PKG_DIABETES',
    name: 'Diabetes Care Package',
    category: 'Packages',
    price: 899,
    originalPrice: 1400,
    tests: ['Blood Sugar (Fasting)', 'Blood Sugar (PP)', 'HbA1c', 'KFT', 'Urine Routine', 'Lipid Profile'],
    description: 'Complete glycemic evaluation and metabolic health profile.',
    popular: false,
    isPackage: true,
  },
];

/**
 * Seed initial test catalogue into MongoDB if empty
 */
export const seedDefaultTests = async () => {
  try {
    const count = await TestItem.countDocuments();
    if (count === 0) {
      const itemsToInsert = [
        ...DUMMY_TESTS.map(t => ({ ...t, isPackage: false, source: 'mock' })),
        ...DUMMY_PACKAGES.map(p => ({
          testCode: p.id,
          name: p.name,
          category: 'Packages',
          price: p.price,
          originalPrice: p.originalPrice,
          description: p.description,
          includes: p.tests,
          isPackage: true,
          source: 'mock',
        })),
      ];
      await TestItem.insertMany(itemsToInsert);
      console.log('🧪 Seeded initial tests & packages into MongoDB.');
    }
  } catch (error) {
    console.warn('⚠️ Could not seed tests into MongoDB:', error.message);
  }
};

// ─── Get Test Catalog ─────────────────────────────────────────────────────────
export const getTestCatalog = async (req, res) => {
  try {
    const { category } = req.query;

    // 1. If Main LIS server is configured, try proxying request
    if (isLisConfigured()) {
      try {
        const lisResponse = await lisClient.get('/api/v1/tests/catalog', { params: { category } });
        if (lisResponse.data?.data) {
          return res.json({ success: true, data: lisResponse.data.data, source: 'lis' });
        }
      } catch (lisError) {
        console.warn('[LIS Gateway] LIS catalog unreachable, falling back to local database:', lisError.message);
      }
    }

    // 2. Query from local MongoDB
    try {
      const filter = { isPackage: false };
      if (category && category.toLowerCase() !== 'all') {
        filter.category = new RegExp(`^${category}$`, 'i');
      }
      const dbTests = await TestItem.find(filter).lean();
      if (dbTests.length > 0) {
        return res.json({
          success: true,
          data: dbTests.map(t => ({ ...t, id: t.testCode || t._id })),
          source: 'database',
        });
      }
    } catch (_) {}

    // 3. Fallback to mock catalog
    let tests = DUMMY_TESTS;
    if (category && category.toLowerCase() !== 'all') {
      tests = tests.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }

    return res.json({ success: true, data: tests, source: 'mock' });
  } catch (error) {
    console.error('[getTestCatalog]', error);
    return res.status(500).json({ success: false, message: 'Error fetching test catalog' });
  }
};

// ─── Get Health Packages ──────────────────────────────────────────────────────
export const getHealthPackages = async (req, res) => {
  try {
    if (isLisConfigured()) {
      try {
        const lisResponse = await lisClient.get('/api/v1/packages');
        if (lisResponse.data?.data) {
          return res.json({ success: true, data: lisResponse.data.data, source: 'lis' });
        }
      } catch (lisError) {
        console.warn('[LIS Gateway] LIS packages unreachable, falling back to database:', lisError.message);
      }
    }

    // Query from local DB
    try {
      const dbPkgs = await TestItem.find({ isPackage: true }).lean();
      if (dbPkgs.length > 0) {
        return res.json({
          success: true,
          data: dbPkgs.map(p => ({
            id: p.testCode || p._id,
            name: p.name,
            price: p.price,
            originalPrice: p.originalPrice,
            description: p.description,
            tests: p.includes || [],
          })),
          source: 'database',
        });
      }
    } catch (_) {}

    return res.json({ success: true, data: DUMMY_PACKAGES, source: 'mock' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching packages' });
  }
};

// ─── Manual LIS Sync Trigger (Admin only) ──────────────────────────────────────
export const triggerManualSync = async (req, res) => {
  try {
    const result = await syncTestsFromLIS();
    return res.json({
      success: true,
      message: result.message,
      data: result,
      status: getSyncStatus(),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Sync Status (Admin only) ─────────────────────────────────────────────
export const getSyncInfo = (req, res) => {
  return res.json({ success: true, data: getSyncStatus() });
};

// ─── Create Test / Package (Admin only) ────────────────────────────────────────
export const createTestItem = async (req, res) => {
  try {
    const { name, category, price, originalPrice, turnaround, sampleType, description, includes, isPackage } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name, category, and price are required' });
    }

    const testCode = req.body.testCode || `TST_${Date.now().toString(36).toUpperCase()}`;

    const item = new TestItem({
      testCode,
      name,
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      turnaround: turnaround || 'Same Day',
      sampleType: sampleType || 'Blood',
      description: description || '',
      includes: Array.isArray(includes) ? includes : (includes ? [includes] : []),
      isPackage: Boolean(isPackage),
      source: 'manual',
    });

    await item.save();

    return res.status(201).json({ success: true, message: 'Test item created successfully', data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Test / Package (Admin only) ────────────────────────────────────────
export const updateTestItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, source: 'manual', lastSyncedAt: new Date() };

    const item = await TestItem.findByIdAndUpdate(id, updateData, { new: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Test item not found' });
    }

    return res.json({ success: true, message: 'Test item updated successfully', data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Delete Test / Package (Admin only) ────────────────────────────────────────
export const deleteTestItem = async (req, res) => {
  try {
    await TestItem.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Test item deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

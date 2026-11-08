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
  { testCode: 'ECG_12', id: 'ECG_12', name: 'Computerized ECG (12 Lead)', category: 'Cardiology', price: 150, turnaround: 'Immediate', sampleType: 'Non-invasive' },
  { testCode: 'HOLTER', id: 'HOLTER', name: '24-Hour Holter Monitoring', category: 'Cardiology', price: 2500, turnaround: '24 hours', sampleType: 'Wearable' },
  { testCode: 'XRAY_CHEST', id: 'XRAY_CHEST', name: 'Digital X-Ray Chest', category: 'Radiology', price: 300, turnaround: 'Immediate', sampleType: 'Digital X-Ray' },
  { testCode: 'XRAY_LS', id: 'XRAY_LS', name: 'Digital X-Ray Lumbo-Sacral Spine', category: 'Radiology', price: 400, turnaround: 'Immediate', sampleType: 'Digital X-Ray' },
  { testCode: 'PFT', id: 'PFT', name: 'Pulmonary Function Test (PFT)', category: 'Pulmonology', price: 500, turnaround: 'Immediate', sampleType: 'Spirometry' },
  { testCode: 'EEG', id: 'EEG', name: 'Electroencephalogram (EEG)', category: 'Neurology', price: 1500, turnaround: 'Same day', sampleType: 'Digital Recording' },
  { testCode: 'NCV', id: 'NCV', name: 'Nerve Conduction Velocity (NCV)', category: 'Neurology', price: 2000, turnaround: 'Same day', sampleType: 'Electrophysiology' },
  { testCode: 'ENDOSCOPY', id: 'ENDOSCOPY', name: 'Upper GI Video Endoscopy', category: 'Gastroenterology', price: 2200, turnaround: 'Immediate', sampleType: 'Endoscopic' },
  { testCode: 'SEMEN_ANALYSIS', id: 'SEMEN_ANALYSIS', name: 'Semen Analysis & Examination', category: 'Pathology', price: 300, turnaround: 'Same day', sampleType: 'Semen' },
  { testCode: 'STOOL_RE', id: 'STOOL_RE', name: 'Stool Routine & Occult Blood', category: 'Pathology', price: 150, turnaround: '4-6 hours', sampleType: 'Stool' },
  { testCode: 'SPUTUM_AFB', id: 'SPUTUM_AFB', name: 'Sputum for AFB (TB Screening)', category: 'Pathology', price: 200, turnaround: 'Same day', sampleType: 'Sputum' },
];

const DUMMY_PACKAGES = [
  {
    id: 'PKG_HEALTH_47',
    testCode: 'PKG_HEALTH_47',
    name: 'Health Checkup (47 Tests)',
    category: 'Packages',
    price: 1350,
    originalPrice: 2200,
    tests: ['CBC (Complete Blood Count)', 'Liver Function (LFT)', 'Kidney Function (KFT)', 'Lipid Profile', 'Fasting Blood Sugar', 'Urine Routine & Microscopy', 'ESR', 'Serum Electrolytes'],
    description: 'Comprehensive health screening covering 47 key diagnostic parameters for routine wellness.',
    popular: true,
    isPackage: true,
  },
  {
    id: 'PKG_HEALTH_ADV_12',
    testCode: 'PKG_HEALTH_ADV_12',
    name: 'Advanced Health Checkup (12 Tests)',
    category: 'Packages',
    price: 1999,
    originalPrice: 3200,
    tests: ['CBC', 'Liver Function', 'Kidney Function', 'Lipid Profile', 'Thyroid Profile (TSH)', 'HbA1c', 'ECG', 'Digital Chest X-Ray', 'Urine Routine', 'Serum Calcium', 'Blood Sugar'],
    description: 'Detailed clinical evaluation for chronic disease prevention and vital organ assessments.',
    popular: false,
    isPackage: true,
  },
  {
    id: 'PKG_DIABETIC_59',
    testCode: 'PKG_DIABETIC_59',
    name: 'Diabetic Profile (59 Tests)',
    category: 'Packages',
    price: 2999,
    originalPrice: 4500,
    tests: ['Fasting Glucose', 'PP Glucose', 'HbA1c Glycated Hemoglobin', 'Average Blood Glucose', 'Complete Renal Function', 'Lipid Screen', 'Microalbuminuria', 'CBC', 'Serum Electrolytes'],
    description: 'Specialized 59-test diabetic and cardiovascular wellness profile for comprehensive glycemic control.',
    popular: true,
    isPackage: true,
  },
  {
    id: 'PKG_CANCER_7',
    testCode: 'PKG_CANCER_7',
    name: 'Cancer Marker Profile (7 Tests)',
    category: 'Packages',
    price: 2999,
    originalPrice: 5000,
    tests: ['CEA (Carcinoembryonic Antigen)', 'AFP (Alpha Fetoprotein)', 'CA 125', 'PSA (Total)', 'CA 19-9', 'Beta HCG', 'CBC with Peripheral Smear'],
    description: 'Targeted multi-organ cancer biomarker profile screening for early detection and oncological review.',
    popular: false,
    isPackage: true,
  },
];

/**
 * Seed initial test catalogue into MongoDB if empty or sync updated packages
 */
export const seedDefaultTests = async () => {
  try {
    for (const t of DUMMY_TESTS) {
      await TestItem.updateOne(
        { testCode: t.testCode },
        { $set: { ...t, isPackage: false, source: 'mock' } },
        { upsert: true }
      );
    }
    for (const p of DUMMY_PACKAGES) {
      await TestItem.updateOne(
        { testCode: p.id },
        {
          $set: {
            testCode: p.id,
            name: p.name,
            category: 'Packages',
            price: p.price,
            originalPrice: p.originalPrice,
            description: p.description,
            includes: p.tests,
            isPackage: true,
            popular: p.popular,
            source: 'mock',
          },
        },
        { upsert: true }
      );
    }
    console.log('🧪 Seeded/synced official tests & packages into MongoDB.');
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

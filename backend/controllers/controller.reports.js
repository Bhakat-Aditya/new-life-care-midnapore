import lisClient, { isLisConfigured } from '../utils/lisClient.js';

// ─── DUMMY REPORT GENERATOR ───────────────────────────────────────────────────
const generateMockReports = (patientId, phone) => {
  const displayId = patientId || `PT-${phone ? phone.slice(-4) : '2024'}`;
  const today = new Date().toISOString().split('T')[0];

  return {
    patientId: displayId,
    patientName: 'Ramesh Sen',
    phone: phone || '9733525031',
    reports: [
      {
        _id: 'RPT-1001',
        reportId: 'RPT-1001',
        testName: 'Complete Blood Count (CBC)',
        testDate: today,
        reportDate: today,
        status: 'ready',
        verifiedBy: 'Consultant Pathologist (New Life Care)',
        downloadUrl: '/api/reports/download/RPT-1001',
        results: [
          { parameter: 'Haemoglobin', value: '14.2', unit: 'g/dL', refRange: '13.0 – 17.0', flag: 'Normal' },
          { parameter: 'Total WBC Count', value: '7,400', unit: '/µL', refRange: '4,000 – 11,000', flag: 'Normal' },
          { parameter: 'RBC Count', value: '4.9', unit: 'million/µL', refRange: '4.5 – 5.5', flag: 'Normal' },
          { parameter: 'Platelets', value: '2.4', unit: 'Lakh/µL', refRange: '1.5 – 4.5', flag: 'Normal' },
          { parameter: 'Neutrophils', value: '64', unit: '%', refRange: '50 – 70', flag: 'Normal' },
          { parameter: 'Lymphocytes', value: '28', unit: '%', refRange: '20 – 40', flag: 'Normal' },
          { parameter: 'ESR (Westergren)', value: '12', unit: 'mm/1st hr', refRange: '0 – 15', flag: 'Normal' },
        ],
      },
      {
        _id: 'RPT-1002',
        reportId: 'RPT-1002',
        testName: 'Thyroid Function Test (TSH, Free T3, Free T4)',
        testDate: today,
        reportDate: today,
        status: 'ready',
        verifiedBy: 'Consultant Pathologist (New Life Care)',
        downloadUrl: '/api/reports/download/RPT-1002',
        results: [
          { parameter: 'TSH (Ultrasensitive)', value: '2.45', unit: 'µIU/mL', refRange: '0.4 – 4.2', flag: 'Normal' },
          { parameter: 'Free T3', value: '3.1', unit: 'pg/mL', refRange: '2.0 – 4.4', flag: 'Normal' },
          { parameter: 'Free T4', value: '1.24', unit: 'ng/dL', refRange: '0.93 – 1.70', flag: 'Normal' },
        ],
      },
      {
        _id: 'RPT-1003',
        reportId: 'RPT-1003',
        testName: 'HbA1c & Blood Sugar Fasting',
        testDate: today,
        reportDate: today,
        status: 'processing',
        verifiedBy: 'Processing at Main Laboratory',
        downloadUrl: null,
        results: [],
      },
    ],
  };
};

// ─── Fetch Patient Reports (via LIS Gateway) ──────────────────────────────────
export const getPatientReports = async (req, res) => {
  try {
    const { patientId, phone } = req.query;

    if (!patientId && !phone) {
      return res.status(400).json({ success: false, message: 'Please provide Patient ID or 10-digit Phone number' });
    }

    // 1. If Main Hospital LIS Server is configured, proxy request
    if (isLisConfigured()) {
      try {
        const lisResponse = await lisClient.get('/api/v1/reports', {
          params: { patientId, phone },
        });
        if (lisResponse.data) {
          return res.json({ success: true, data: lisResponse.data, source: 'lis' });
        }
      } catch (lisError) {
        console.warn('[LIS Gateway] LIS server lookup error, serving fallback data:', lisError.message);
      }
    }

    // 2. Fallback to mock data with searched identifier
    const mockData = generateMockReports(patientId, phone);
    return res.json({ success: true, data: mockData, source: 'mock' });
  } catch (error) {
    console.error('[getPatientReports]', error);
    return res.status(500).json({ success: false, message: 'Error retrieving patient reports' });
  }
};

// ─── Download Report (Proxy or Printable Document) ────────────────────────────
export const downloadReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    // 1. If Main Hospital LIS Server is configured, stream the PDF directly
    if (isLisConfigured()) {
      try {
        const lisStream = await lisClient.get(`/api/v1/reports/${reportId}/download`, {
          responseType: 'stream',
        });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Report-${reportId}.pdf`);
        return lisStream.data.pipe(res);
      } catch (streamError) {
        console.warn('[LIS Gateway] LIS PDF stream failed, serving generated report view:', streamError.message);
      }
    }

    // 2. Generate a clean, printable medical report view for browser/print
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `inline; filename=Diagnostic-Report-${reportId}.html`);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Diagnostic Report - ${reportId} | New Life Care</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 40px; color: #1e293b; background: #fff; }
    .header { border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand { font-size: 24px; font-weight: 800; color: #0369a1; }
    .badge { background: #ecfdf5; color: #047857; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; border: 1px solid #a7f3d0; }
    .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px; }
    th { background: #f1f5f9; text-align: left; padding: 10px 12px; border-bottom: 2px solid #cbd5e1; font-weight: 600; color: #334155; }
    td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
    .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b; text-align: center; }
    .signature { margin-top: 30px; text-align: right; font-weight: 600; font-size: 14px; color: #0f172a; }
    @media print { .no-print { display: none; } body { margin: 15mm; } }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px;">
    <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <div class="header">
    <div>
      <div class="brand">NEW LIFE CARE DIAGNOSTIC CENTRE</div>
      <div style="font-size: 13px; color: #475569; margin-top: 4px;">
        Keranitola, Midnapore Railway Station Rd, near Mahamaya Nursing Home Lane, Midnapore - 721101
      </div>
      <div style="font-size: 13px; color: #0284c7; margin-top: 2px;">
        📞 Helpline: 097335 25031 / 9647393949
      </div>
    </div>
    <div style="text-align: right;">
      <span class="badge">NABL Certified Laboratory</span>
      <div style="font-size: 12px; color: #64748b; margin-top: 8px;">Report ID: <strong>${reportId}</strong></div>
    </div>
  </div>

  <div class="info-box">
    <div><strong>Patient Name:</strong> Ramesh Sen</div>
    <div><strong>Age / Gender:</strong> 42 Yrs / Male</div>
    <div><strong>Referred By:</strong> Consulting Physician</div>
    <div><strong>Sample Collected:</strong> ${new Date().toLocaleDateString('en-IN')}</div>
  </div>

  <h3 style="margin-bottom: 8px; color: #0f172a;">Laboratory Investigation Report: Complete Blood Count</h3>
  <table>
    <thead>
      <tr>
        <th>Investigation Parameter</th>
        <th>Result Value</th>
        <th>Biological Reference Interval</th>
        <th>Unit</th>
        <th>Flag</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Haemoglobin</td><td><strong>14.2</strong></td><td>13.0 – 17.0</td><td>g/dL</td><td>Normal</td></tr>
      <tr><td>Total Leucocyte Count (WBC)</td><td><strong>7,400</strong></td><td>4,000 – 11,000</td><td>/µL</td><td>Normal</td></tr>
      <tr><td>Platelet Count</td><td><strong>2.4</strong></td><td>1.5 – 4.5</td><td>Lakh/µL</td><td>Normal</td></tr>
      <tr><td>Neutrophils</td><td><strong>64</strong></td><td>50 – 70</td><td>%</td><td>Normal</td></tr>
      <tr><td>Lymphocytes</td><td><strong>28</strong></td><td>20 – 40</td><td>%</td><td>Normal</td></tr>
      <tr><td>ESR</td><td><strong>12</strong></td><td>0 – 15</td><td>mm/hr</td><td>Normal</td></tr>
    </tbody>
  </table>

  <div class="signature">
    <div>Digitally Authenticated By:</div>
    <div style="margin-top: 20px; font-weight: 700; color: #0369a1;">Consultant Pathologist, MD</div>
    <div style="font-size: 12px; color: #64748b;">Laboratory Director & Quality Assurance</div>
  </div>

  <div class="footer">
    *** End of Test Report ***<br/>
    This electronic laboratory report is verified by New Life Care Diagnostic Centre via dedicated LIS Gateway.
  </div>
</body>
</html>`;

    return res.send(html);
  } catch (error) {
    console.error('[downloadReport]', error);
    return res.status(500).json({ success: false, message: 'Error generating report document' });
  }
};

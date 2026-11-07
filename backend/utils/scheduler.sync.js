import cron from 'node-cron';
import lisClient, { isLisConfigured } from './lisClient.js';
import { TestItem } from '../models/model.test.js';

let syncState = {
  lastSyncTime: null,
  status: 'idle',
  totalItems: 0,
  lastMessage: 'Sync job initialized. Running every 24 hours.',
};

export const getSyncStatus = () => ({
  ...syncState,
  isLisConfigured: isLisConfigured(),
});

/**
 * Execute sync of Test List & Packages from Main LIS Server into local MongoDB.
 */
export const syncTestsFromLIS = async () => {
  syncState.status = 'syncing';
  console.log('[24h Sync Scheduler] Checking for test list updates from Main LIS Server...');

  try {
    if (isLisConfigured()) {
      // 1. Fetch latest test catalogue from Main Hospital LIS Server
      const [testsRes, pkgsRes] = await Promise.allSettled([
        lisClient.get('/api/v1/tests/catalog'),
        lisClient.get('/api/v1/packages'),
      ]);

      let count = 0;

      if (testsRes.status === 'fulfilled' && Array.isArray(testsRes.value.data?.data)) {
        for (const item of testsRes.value.data.data) {
          await TestItem.findOneAndUpdate(
            { testCode: item.id || item.testCode },
            {
              name: item.name,
              category: item.category,
              price: item.price,
              originalPrice: item.originalPrice,
              turnaround: item.turnaround,
              sampleType: item.sampleType,
              source: 'lis',
              lastSyncedAt: new Date(),
            },
            { upsert: true, new: true }
          );
          count++;
        }
      }

      if (pkgsRes.status === 'fulfilled' && Array.isArray(pkgsRes.value.data?.data)) {
        for (const pkg of pkgsRes.value.data.data) {
          await TestItem.findOneAndUpdate(
            { testCode: pkg.id || pkg.testCode },
            {
              name: pkg.name,
              category: 'Packages',
              price: pkg.price,
              originalPrice: pkg.originalPrice,
              description: pkg.description,
              includes: pkg.tests || [],
              isPackage: true,
              source: 'lis',
              lastSyncedAt: new Date(),
            },
            { upsert: true, new: true }
          );
          count++;
        }
      }

      syncState.lastSyncTime = new Date();
      syncState.status = 'success';
      syncState.totalItems = count;
      syncState.lastMessage = `Successfully synced ${count} test(s) & packages from Main LIS Server.`;
      console.log(`[24h Sync Scheduler] ✅ Synced ${count} items from Main LIS Server.`);
      return { success: true, count, message: syncState.lastMessage };
    } else {
      // LIS Server endpoint is not configured yet - ensure mock tests are present in DB
      const dbCount = await TestItem.countDocuments().catch(() => 0);
      syncState.lastSyncTime = new Date();
      syncState.status = 'mock_ready';
      syncState.totalItems = dbCount;
      syncState.lastMessage = 'Main LIS API endpoint is blank. Running with local database & mock test catalogue.';
      console.log('[24h Sync Scheduler] LIS is blank. Database active with local catalog.');
      return { success: true, count: dbCount, message: syncState.lastMessage };
    }
  } catch (error) {
    syncState.status = 'error';
    syncState.lastMessage = `Sync failed: ${error.message}`;
    console.error('[24h Sync Scheduler] ❌ Sync error:', error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Initialize 24-hour recurring cron schedule (Runs every midnight at 00:00).
 */
export const startSyncScheduler = () => {
  // '0 0 * * *' = every day at midnight (every 24 hours)
  cron.schedule('0 0 * * *', async () => {
    console.log('[24h Sync Scheduler] Triggering automatic 24-hour test list refresh...');
    await syncTestsFromLIS();
  });

  // Run initial sync check 5 seconds after server boots up
  setTimeout(async () => {
    await syncTestsFromLIS();
  }, 5000);

  console.log('⏰ 24-Hour Test Sync Scheduler registered (Runs every 24h)');
};


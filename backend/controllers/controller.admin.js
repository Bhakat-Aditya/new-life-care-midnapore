import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Admin } from '../models/model.admin.js';
import { Doctor } from '../models/model.doctor.js';
import { Gallery } from '../models/model.gallery.js';
import { Notice } from '../models/model.notice.js';
import { Booking } from '../models/model.booking.js';
import { getSyncStatus } from '../utils/scheduler.sync.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'newlifecare_jwt_secret_key_2024_secure_midnapore';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@nlc2024';

/**
 * Ensures a single Admin account exists in the database.
 * If not present, creates one with the configured ADMIN_PASSWORD.
 */
export const ensureAdminAccount = async () => {
  try {
    const existing = await Admin.findOne({ username: 'admin' });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);
      const newAdmin = new Admin({
        username: 'admin',
        password: hashedPassword,
        role: 'superadmin',
      });
      await newAdmin.save();
      console.log('🛡️ Default admin account seeded in database (Username: admin)');
    }
  } catch (error) {
    console.warn('⚠️ Could not seed admin account in database:', error.message);
  }
};

/**
 * Admin Login with single password.
 */
export const loginAdmin = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    let isValid = false;
    let adminRecord = null;

    try {
      adminRecord = await Admin.findOne({ username: 'admin' });
      if (adminRecord) {
        // Compare with hashed password in database
        isValid = await bcrypt.compare(password, adminRecord.password);
        // Also allow direct match with env if someone changed .env ADMIN_PASSWORD directly
        if (!isValid && process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
          isValid = true;
          // Re-hash and update DB
          const salt = await bcrypt.genSalt(10);
          adminRecord.password = await bcrypt.hash(password, salt);
          await adminRecord.save();
        }
      }
    } catch (dbErr) {
      console.warn('[Admin Login] Database query failed, checking env password fallback:', dbErr.message);
    }

    // Fallback if DB was unavailable or no record yet
    if (!adminRecord) {
      isValid = (password === DEFAULT_PASSWORD);
    }

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Incorrect Admin password. Please try again.' });
    }

    // Update lastLogin if record exists
    if (adminRecord) {
      adminRecord.lastLogin = new Date();
      await adminRecord.save().catch(() => {});
    }

    // Generate JWT token (expires in 7 days)
    const token = jwt.sign(
      { username: 'admin', role: 'superadmin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Admin authentication successful',
      token,
      admin: {
        username: 'admin',
        role: 'superadmin',
        lastLogin: new Date(),
      },
    });
  } catch (error) {
    console.error('[loginAdmin]', error);
    return res.status(500).json({ success: false, message: 'Server error during admin login' });
  }
};

/**
 * Get current admin session info
 */
export const getAdminMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      admin: req.admin,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Change Admin Password
 */
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    const admin = await Admin.findOne({ username: 'admin' });
    if (admin && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch && currentPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(400).json({ success: false, message: 'Current password does not match' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (admin) {
      admin.password = hashedPassword;
      await admin.save();
    } else {
      const newAdmin = new Admin({
        username: 'admin',
        password: hashedPassword,
        role: 'superadmin',
      });
      await newAdmin.save();
    }

    return res.json({ success: true, message: 'Admin password updated successfully!' });
  } catch (error) {
    console.error('[changeAdminPassword]', error);
    return res.status(500).json({ success: false, message: 'Server error updating password' });
  }
};

/**
 * Dashboard stats overview
 */
export const getAdminStats = async (req, res) => {
  try {
    const [doctorsCount, galleryCount, noticeCount, bookingsCount] = await Promise.all([
      Doctor.countDocuments().catch(() => 5),
      Gallery.countDocuments().catch(() => 0),
      Notice.countDocuments().catch(() => 0),
      Booking.countDocuments().catch(() => 0),
    ]);

    const syncStatus = getSyncStatus();

    return res.json({
      success: true,
      stats: {
        doctors: doctorsCount,
        gallery: galleryCount,
        notices: noticeCount,
        bookings: bookingsCount,
        syncStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving stats' });
  }
};


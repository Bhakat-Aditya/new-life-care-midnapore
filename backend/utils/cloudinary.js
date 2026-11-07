import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

export const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Upload an image buffer to Cloudinary, or fallback to Base64 data URI if credentials are not set.
 * @param {Buffer} buffer - File buffer from Multer
 * @param {string} folder - Target folder in Cloudinary
 * @param {string} mimeType - e.g. 'image/jpeg', 'image/png'
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export const uploadImageBuffer = (buffer, folder = 'newlifecare', mimeType = 'image/jpeg') => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      // Fallback: create base64 data URI so user can still upload images without Cloudinary keys
      const base64Data = buffer.toString('base64');
      const dataUri = `data:${mimeType};base64,${base64Data}`;
      return resolve({
        url: dataUri,
        publicId: `local-${Date.now()}`,
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Error]', error);
          // Graceful fallback to data URI on Cloudinary API failure
          const base64Data = buffer.toString('base64');
          return resolve({
            url: `data:${mimeType};base64,${base64Data}`,
            publicId: `local-fallback-${Date.now()}`,
          });
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Delete an image by publicId from Cloudinary.
 */
export const deleteCloudinaryImage = async (publicId) => {
  if (!isCloudinaryConfigured() || !publicId || publicId.startsWith('local-')) {
    return true;
  }
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.warn('[Cloudinary Delete Error]', error.message);
    return false;
  }
};

export default cloudinary;


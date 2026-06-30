const cloudinary = require('cloudinary').v2;
const ApiError = require('../utils/ApiError');

const uploadSingle = async (req, res, next) => {
  try {
    if (!req.file) throw ApiError.badRequest('No file uploaded');

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'laspero/products',
      transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
    });

    res.json({
      success: true,
      data: { url: result.secure_url, publicId: result.public_id },
    });
  } catch (error) {
    next(error);
  }
};

const uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw ApiError.badRequest('No files uploaded');
    }

    const uploads = await Promise.all(
      req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: 'laspero/products',
          transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
        })
      )
    );

    res.json({
      success: true,
      data: uploads.map((u) => ({ url: u.secure_url, publicId: u.public_id })),
    });
  } catch (error) {
    next(error);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.params;
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadSingle, uploadMultiple, deleteImage };

const { Router } = require('express');
const multer = require('multer');
const { uploadSingle, uploadMultiple, deleteImage } = require('../controllers/upload.controller');
const { protect, admin } = require('../middleware/auth');

const upload = multer({ dest: '/tmp/uploads', limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

router.post('/', protect, admin, upload.single('image'), uploadSingle);
router.post('/multiple', protect, admin, upload.array('images', 10), uploadMultiple);
router.delete('/:publicId', protect, admin, deleteImage);

module.exports = router;

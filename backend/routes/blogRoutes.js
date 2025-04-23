const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createBlog, getBlogs, getBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { verifyToken } = require('../middleware/authMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.post('/', verifyToken, upload.single('image'), createBlog);
router.get('/', getBlogs);
router.get('/:id', getBlog);
router.put('/:id', verifyToken, updateBlog);
router.delete('/:id', verifyToken, deleteBlog);

module.exports = router;
// This code defines the routes for blog management in an Express application.
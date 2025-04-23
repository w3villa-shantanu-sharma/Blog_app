const express = require('express');
const router = express.Router();
const { toggleLike, likeBlog, unlikeBlog } = require('../controllers/likeController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/like', verifyToken, likeBlog);
router.post('/unlike', verifyToken, unlikeBlog);
router.post('/toggle', verifyToken, toggleLike);

module.exports = router;

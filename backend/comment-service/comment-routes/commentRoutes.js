const express = require('express');
const router = express.Router();
const { addComment, updateComment, deleteComment } = require('../comment-controllers/commentControllers.js');

// const { addComment } = require('../controllers/commentController');
const { verifyToken } = require('../commentmiddleware/commentMiddleware.js');

router.post('/', verifyToken, addComment);
router.put('/:id', verifyToken, updateComment);   // 👈 Update comment
router.delete('/:id', verifyToken, deleteComment);

module.exports = router;

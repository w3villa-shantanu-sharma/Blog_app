const db = require('../db/conn.js');

// Like Blog
exports.likeBlog = async (req, res) => {
  try {
    const { blogId, userId } = req.body;

    await db.query(
      'INSERT IGNORE INTO likes (blog_id, user_id) VALUES (?, ?)',
      [blogId, userId]
    );

    res.json({ message: 'Blog liked!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Unlike Blog
exports.unlikeBlog = async (req, res) => {
  try {
    const { blogId, userId } = req.body;

    await db.query(
      'DELETE FROM likes WHERE blog_id = ? AND user_id = ?',
      [blogId, userId]
    );

    res.json({ message: 'Blog unliked!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle Like Blog
exports.toggleLike = async (req, res) => {
  try {
    const { blogId } = req.body;
    const userId = req.user.id; // Extract userId from the token (via middleware)

    // Check if the user has already liked the blog
    const [existingLike] = await db.query(
      'SELECT * FROM likes WHERE blog_id = ? AND user_id = ?',
      [blogId, userId]
    );

    if (existingLike.length > 0) {
      // If the like exists, remove it (unlike)
      await db.query(
        'DELETE FROM likes WHERE blog_id = ? AND user_id = ?',
        [blogId, userId]
      );
      return res.json({ message: 'Blog unliked!', liked: false });
    } else {
      // If the like does not exist, add it
      await db.query(
        'INSERT INTO likes (blog_id, user_id) VALUES (?, ?)',
        [blogId, userId]
      );
      return res.json({ message: 'Blog liked!', liked: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

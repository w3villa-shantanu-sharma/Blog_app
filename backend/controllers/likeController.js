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
  }exports.toggleLike = async (req, res) => {
    try {
      const { blogId } = req.body;
      const userId = req.user.id;
  
      const [blog] = await db.query('SELECT id FROM blogs WHERE id = ?', [blogId]);
      if (blog.length === 0) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      const [existingLike] = await db.query(
        'SELECT id FROM likes WHERE blog_id = ? AND user_id = ?',
        [blogId, userId]
      );
  
      if (existingLike.length > 0) {
        await db.query('DELETE FROM likes WHERE blog_id = ? AND user_id = ?', [blogId, userId]);
      } else {
        await db.query('INSERT INTO likes (blog_id, user_id) VALUES (?, ?)', [blogId, userId]);
      }
  
      const [likesCount] = await db.query(
        'SELECT COUNT(*) AS count FROM likes WHERE blog_id = ?',
        [blogId]
      );
  
      res.json({ 
        message: existingLike.length ? 'Blog unliked!' : 'Blog liked!', 
        liked: existingLike.length === 0, 
        likesCount: likesCount[0].count 
      });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
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
    const userId = req.user.id;

    const [blog] = await db.query('SELECT id FROM blogs WHERE id = ?', [blogId]);
    if (blog.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const [existingLike] = await db.query(
      'SELECT id FROM likes WHERE blog_id = ? AND user_id = ?',
      [blogId, userId]
    );

    if (existingLike.length > 0) {
      await db.query('DELETE FROM likes WHERE blog_id = ? AND user_id = ?', [blogId, userId]);
    } else {
      await db.query('INSERT INTO likes (blog_id, user_id) VALUES (?, ?)', [blogId, userId]);
    }

    const [likesCount] = await db.query(
      'SELECT COUNT(*) AS count FROM likes WHERE blog_id = ?',
      [blogId]
    );

    res.json({ 
      message: existingLike.length ? 'Blog unliked!' : 'Blog liked!', 
      liked: existingLike.length === 0, 
      likesCount: likesCount[0].count 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


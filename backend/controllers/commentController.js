const db = require('../db/conn.js');

// Add Comment

exports.addComment = async (req, res) => {
  try {
    const { blogId, content } = req.body;
    const userId = req.user.id; // Extract userId from the token (via middleware)

    await db.query(
      'INSERT INTO comments (content, blog_id, user_id) VALUES (?, ?, ?)',
      [content, blogId, userId]
    );

    res.json({ message: 'Comment added!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Comment
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id; // Extract userId from the token

    // Verify ownership
    const [comment] = await db.query('SELECT * FROM comments WHERE id = ? AND user_id = ?', [id, userId]);
    if (comment.length === 0) {
      return res.status(403).json({ message: 'You are not authorized to update this comment' });
    }

    await db.query(
      'UPDATE comments SET content = ? WHERE id = ?',
      [content, id]
    );

    res.json({ message: 'Comment updated!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Extract userId from the token

    // Verify ownership
    const [comment] = await db.query('SELECT * FROM comments WHERE id = ? AND user_id = ?', [id, userId]);
    if (comment.length === 0) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment' });
    }

    await db.query(
      'DELETE FROM comments WHERE id = ?',
      [id]
    );

    res.json({ message: 'Comment deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const db = require('../db/conn.js'); // your correct db file

// Create a Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, post, category } = req.body;
    const userId = req.user.id; // Extract userId from the token
    const image = req.file ? req.file.path : null; // Get the uploaded file path

    console.log(title, post, category, image, userId);

    await db.query(
      'INSERT INTO blogs (title, description, image, categories, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, post, image, category, userId]
    );
    res.json({ message: 'Blog created!' });
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all Blogs
exports.getBlogs = async (req, res) => {
  try {
    const [blogs] = await db.query(`
      SELECT blogs.id, blogs.title, blogs.description, blogs.image, blogs.created_at AS createdon,
        (SELECT COUNT(*) FROM likes WHERE likes.blog_id = blogs.id) AS likesCount,
        (SELECT COUNT(*) FROM comments WHERE comments.blog_id = blogs.id) AS commentsCount
      FROM blogs
    `);
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Blog
exports.getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const [blogs] = await db.query(`
      SELECT blogs.*, users.username, 
        (SELECT COUNT(*) FROM likes WHERE likes.blog_id = blogs.id) AS likesCount
      FROM blogs 
      JOIN users ON blogs.user_id = users.id 
      WHERE blogs.id = ?
    `, [id]);

    const [comments] = await db.query(
      'SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.blog_id = ?',
      [id]
    );

    res.json({ ...blogs[0], comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, categories } = req.body;

    await db.query(
      'UPDATE blogs SET title = ?, description = ?, image = ?, categories = ? WHERE id = ?',
      [title, description, image, categories, id]
    );
    res.json({ message: 'Blog updated!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM blogs WHERE id = ?', [id]);
    res.json({ message: 'Blog deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

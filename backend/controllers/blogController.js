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
      SELECT 
        blogs.id, 
        blogs.title, 
        blogs.description, 
        blogs.image, 
        blogs.created_at AS createdon,
        COUNT(DISTINCT likes.id) AS likesCount,
        COUNT(DISTINCT comments.id) AS commentsCount
      FROM blogs
      LEFT JOIN likes ON likes.blog_id = blogs.id
      LEFT JOIN comments ON comments.blog_id = blogs.id
      GROUP BY blogs.id
      ORDER BY blogs.created_at DESC
    `);
      // (SELECT COUNT(*) FROM likes 
      // WHERE likes.blog_id = blogs.id) AS likesCount,
      // (SELECT COUNT(*) FROM comments WHERE comments.blog_id = blogs.id) AS commentsCount
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
        COUNT(DISTINCT likes.id) AS likesCount
      FROM blogs 
      JOIN users ON blogs.user_id = users.id 
      LEFT JOIN likes ON likes.blog_id = blogs.id
      WHERE blogs.id = ?
      GROUP BY blogs.id
    `, [id]);
    

    if(!blogs.length){
      return res.status(404).json({message : 'Blog not found!'});
    }

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
    const userId = req.user.id; // Extract userId from the token

    const [blog]  = await db.query('SELECT * FROM blogs WHERE id = ?', [id]);

    if(blog.length === 0){
      return res.status(404).json({message:'Blog not found!'});
    }

    if(blog[0].user_id !== userId){
      return res.status(403).json({message:'You are not allowed to update this blog!'});
    }

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
  const connection = await db.getConnection();
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [blog] = await db.query('SELECT * FROM blogs WHERE id = ?', [id]);

    if(blog.length === 0){
      return res.status(404).json({message : 'Blog not found!'});
    }

    if(blog[0].user_id  !== userId){
      return res.status(403).json({message:'You are not allowed to delete this blog!'});
    }

    (await connection).beginTransaction();

    await db.query('DELETE FROM comments WHERE blog_id = ?', [id]);
    await db.query('DELETE FROM likes WHERE blog_id = ?', [id]);

    // Delete the blog
    await db.query('DELETE FROM blogs WHERE id = ?', [id]);

    await connection.commit();
    res.json({ message: 'Blog deleted!' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  }
  finally {
    if (connection) {
      connection.release();
    }
  }
};

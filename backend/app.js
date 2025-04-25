//create a basic server
const express = require('express');
const cors  = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const client = require('./db/conn.js');
const path = require('path');

const app = express();

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Import Routes

const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./comment-service/comment-routes/commentRoutes.js');
const likeRoutes = require('./routes/likeRoutes');

const PORT  = process.env.PORT || 5000;

//only server
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);

app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);

// app.get('/', (req, res) => {
//     res.send('Hello World!')
//   })
  
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })


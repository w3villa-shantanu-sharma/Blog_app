const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const commentRoutes = require('./comment-routes/commentRoutes.js');
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Comment service running on port ${PORT}`);
});

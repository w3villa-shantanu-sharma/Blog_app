const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'villa');
    req.user = decoded; // Attach user info to the request
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
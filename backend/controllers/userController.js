const db = require('../db/conn.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup (or Register)
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user and get inserted ID
        const [result] = await db.query(
          'INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
          [username, email, hashedPassword]
        );
        const userId = result.insertId;

        res.status(201).json({ message: 'User created successfully!', userId, username, email });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};


// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user[0].id },
            process.env.JWT_SECRET || 'villa',  // Use secret from environment
            { expiresIn: '1d' }  // Token expires in 1 day
        );

        res.status(200).json({ message: 'Login successful!', token, userId: user[0].id, username: user[0].username });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

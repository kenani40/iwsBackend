const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');


async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  try {
    const snapshot = await db.ref(`users/${username}`).once('value');
    const user = snapshot.val();

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({ token, expiresIn: '2h' });
  } catch (error) {
    console.error('Login failed:', error.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
}

module.exports = { login };
const jwt = require('jsonwebtoken');

function jwtAuth(req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Missing or malformed Authorization header. Expected: Bearer <token>.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token. Please log in again.' });
  }
}

module.exports = jwtAuth;
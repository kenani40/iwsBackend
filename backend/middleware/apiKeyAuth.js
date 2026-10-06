
function apiKeyAuth(req, res, next) {
  
  const providedKey = req.header('x-api-key');

  if (!providedKey) {
    return res.status(401).json({
      error: 'Missing API key. Include it in the x-api-key header.',
    });
  }
  if (providedKey !== process.env.DEVICE_API_KEY) {
    return res.status(403).json({
      error: 'Invalid API key.',
    });
  }

  next();
}

module.exports = apiKeyAuth;
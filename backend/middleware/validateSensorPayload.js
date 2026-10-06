

function validateSensorPayload(req, res, next) {
  const { deviceId, moisture, temperature, humidity, gas } = req.body;

  const errors = [];

  if (!deviceId || typeof deviceId !== 'string') {
    errors.push('deviceId is required and must be a string.');
  }

  if (typeof moisture !== 'number' || moisture < 0 || moisture > 100) {
    errors.push('moisture is required and must be a number between 0 and 100.');
  }

  if (typeof temperature !== 'number') {
    errors.push('temperature is required and must be a number.');
  }
  if (humidity !== undefined && (typeof humidity !== 'number' || humidity < 0 || humidity > 100)) {
    errors.push('humidity, if provided, must be a number between 0 and 100.');
  }

  if (typeof gas !== 'boolean') {
    errors.push('gas is required and must be true or false (digital sensor reading).');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Invalid sensor payload.',
      details: errors,
    });
  }

  next();
}

module.exports = validateSensorPayload;
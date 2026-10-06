const { db } = require('../config/firebase');

async function recordReading(req, res) {
  const { deviceId, moisture, temperature, gas } = req.body;

  try {

    const readingRef = db.ref(`readings/${deviceId}`).push();
    const reading = {
      moisture,
      temperature,
      gas, 
      timestamp: new Date().toISOString(),
    };

    await readingRef.set(reading);

    res.status(201).json({
      message: 'Reading recorded.',
      id: readingRef.key,
    });
  } catch (error) {

    console.error('Failed to write sensor reading:', error.message);
    res.status(500).json({
      error: 'Could not save reading. Please try again.',
    });
  }
}


async function listDevices(req, res) {
  try {
    const snapshot = await db.ref('readings').once('value');
    const data = snapshot.val();

    if (!data) {
      return res.status(200).json({ devices: [] });
    }

    const devices = Object.keys(data);
    res.status(200).json({ devices });
  } catch (error) {
    console.error('Failed to list devices:', error.message);
    res.status(500).json({ error: 'Could not retrieve device list.' });
  }
}

async function getLatestReading(req, res) {
  const { deviceId } = req.params;
  try {
    const snapshot = await db
      .ref(`readings/${deviceId}`)
      .orderByKey()
      .limitToLast(1)
      .once('value');

    const data = snapshot.val();

    if (!data) {
      return res.status(404).json({ error: `No readings found for device "${deviceId}".` });
    }

    const [readingId] = Object.keys(data);
    res.status(200).json({ id: readingId, ...data[readingId] });
  } catch (error) {
    console.error('Failed to fetch latest reading:', error.message);
    res.status(500).json({ error: 'Could not retrieve latest reading.' });
  }
}

async function getHistory(req, res) {
  const { deviceId } = req.params;
  const requestedLimit = parseInt(req.query.limit, 10);
  const limit = Number.isNaN(requestedLimit)
    ? 50
    : Math.min(Math.max(requestedLimit, 1), 500);

  try {
    const snapshot = await db
      .ref(`readings/${deviceId}`)
      .orderByKey()
      .limitToLast(limit)
      .once('value');

    const data = snapshot.val();

    if (!data) {
      return res.status(404).json({ error: `No readings found for device "${deviceId}".` });
    }

    const readings = Object.entries(data).map(([id, value]) => ({ id, ...value }));
    res.status(200).json({ deviceId, count: readings.length, readings });
  } catch (error) {
    console.error('Failed to fetch history:', error.message);
    res.status(500).json({ error: 'Could not retrieve reading history.' });
  }
}

module.exports = { recordReading, listDevices, getLatestReading, getHistory };
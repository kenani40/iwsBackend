const express = require('express');
const router = express.Router();
const apiKeyAuth = require('../middleware/apiKeyAuth');
const jwtAuth = require('../middleware/jwtAuth');
const validateSensorPayload = require('../middleware/validateSensorPayload');
const {
  recordReading,
  listDevices,
  getLatestReading,
  getHistory,
} = require('../controllers/sensorController');

router.post('/sensor-data', apiKeyAuth, validateSensorPayload, recordReading);
router.get('/devices', jwtAuth, listDevices);
router.get('/sensor-data/:deviceId/latest', jwtAuth, getLatestReading);
router.get('/sensor-data/:deviceId/history', jwtAuth, getHistory);

module.exports = router;
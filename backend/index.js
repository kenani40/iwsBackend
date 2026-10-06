require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');
const sensorRoutes = require('./routes/sensorRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(express.json());
app.use('/api/v1', sensorRoutes);
app.use('/api/v1', authRoutes);
app.get('/', (req, res) => {
  res.json({ status: 'IoT backend is running.' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
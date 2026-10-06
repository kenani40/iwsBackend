
const { initializeApp, cert } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
const path = require('path');
require('dotenv').config();

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else {
  const serviceAccountPath = path.resolve(
    __dirname,
    '..',
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './config/serviceAccountKey.json'
  );
  serviceAccount = require(serviceAccountPath);
}

const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = getDatabase(app);

module.exports = { db };
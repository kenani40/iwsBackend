// ============================================
// ONE-OFF CONNECTION TEST
// Run this once to confirm Firebase Admin SDK connects correctly
// before building the real server on top of it.
// Delete or ignore this file once confirmed — it's not part of
// the actual application.
// ============================================

const { db } = require('./config/firebase');

async function testConnection() {
  try {
    const testRef = db.ref('connection-test');
    await testRef.set({
      message: 'Connection successful',
      timestamp: new Date().toISOString(),
    });
    console.log('✅ Successfully wrote to Firebase Realtime Database.');

    const snapshot = await testRef.once('value');
    console.log('✅ Successfully read back:', snapshot.val());

    process.exit(0);
  } catch (error) {
    console.error('❌ Firebase connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
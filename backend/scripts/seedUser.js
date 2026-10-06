
const bcrypt = require('bcryptjs');
const { db } = require('../config/firebase');

async function seedUser() {
  const [, , username, password] = process.argv;
  if (!username || !password) {
    console.error('Usage: node scripts/seedUser.js <username> <password>');
    process.exit(1);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.ref(`users/${username}`).set({
    username,
    password: hashedPassword,
  });
  console.log(` User "${username}" created.`);
  process.exit(0);
}
seedUser().catch((error) => {
  console.error(' Failed to seed user:', error.message);
  process.exit(1);
});
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Parse .env.local manually
let uri = '';
try {
  const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
  const match = envContent.match(/MONGODB_URI\s*=\s*(["']?)(.*?)\1(\s|$)/);
  if (match) {
    uri = match[2];
  }
} catch (e) {
  console.error('Failed to read .env.local', e);
}

if (!uri) {
  console.error('MONGODB_URI is not set in .env.local');
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const reviews = await db.collection('reviews').find({}).toArray();
    console.log(JSON.stringify(reviews, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();

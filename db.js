// db.js
const { MongoClient } = require('mongodb');

async function connectToDatabase() {
  const client = new MongoClient(process.env.MONGOOSE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db('sampleAPI');
}

module.exports = { connectToDatabase };
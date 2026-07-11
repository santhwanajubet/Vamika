const connectDB = require('./config/db');
const env = require('./config/env');
const mongoose = require('mongoose');

const migrate = async () => {
  await connectDB();

  const result = await mongoose.connection.db.collection('products').updateMany(
    { comparePrice: { $exists: true } },
    { $rename: { comparePrice: 'offerPrice' } }
  );

  console.log(`✓ Migrated ${result.modifiedCount} products: comparePrice → offerPrice`);
  process.exit(0);
};

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

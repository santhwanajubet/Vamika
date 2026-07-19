const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');
const User = require('./src/models/User');

const bootstrapAdmin = async () => {
  const adminEmail = 'support.vamika26@gmail.com';
  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      existing.isVerified = true;
      await existing.save({ validateBeforeSave: false });
      console.log(`✓ Promoted ${adminEmail} to admin`);
    }
  } else {
    await User.create({
      name: 'Vamika Admin',
      email: adminEmail,
      password: 'V2Mamika@26',
      role: 'admin',
      isVerified: true,
    });
    console.log(`✓ Admin user created (${adminEmail})`);
  }
};

const start = async () => {
  await connectDB();
  await bootstrapAdmin();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} (${env.NODE_ENV})`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

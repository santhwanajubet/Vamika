const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');
const User = require('./src/models/User');

const bootstrapAdmin = async () => {
  const adminEmails = ['support.vamika26@gmail.com', 'supportvamika26@gmail.com'];
  for (const email of adminEmails) {
    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        existing.isVerified = true;
        await existing.save({ validateBeforeSave: false });
        console.log(`✓ Promoted ${email} to admin`);
      } else {
        console.log(`→ ${email} is already admin`);
      }
      return;
    }
  }
  await User.create({
    name: 'Vamika Admin',
    email: 'support.vamika26@gmail.com',
    password: 'V2Mamika@26',
    role: 'admin',
    isVerified: true,
  });
  console.log(`✓ Admin user created (support.vamika26@gmail.com)`);
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

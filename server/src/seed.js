const connectDB = require('./config/db');
const env = require('./config/env');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const seed = async () => {
  await connectDB();

  // ─── Admin user ────────────────────────────────
  const admin = await User.findOne({ email: 'admin@vamika.com' });
  if (!admin) {
    await User.create({
      name: 'Admin',
      email: 'admin@vamika.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
    });
    console.log('✓ Admin user created (admin@vamika.com / admin123)');
  } else {
    console.log('→ Admin user already exists');
  }

  // ─── Categories (Saree types) ──────────────────
  const categoryData = [
    { name: 'Silk Sarees', order: 1 },
    { name: 'Cotton Sarees', order: 2 },
    { name: 'Banarasi Sarees', order: 3 },
    { name: 'Kanchipuram Sarees', order: 4 },
    { name: 'Georgette Sarees', order: 5 },
    { name: 'Chiffon Sarees', order: 6 },
    { name: 'Designer Sarees', order: 7 },
    { name: 'Lehengas', order: 8 },
  ];

  const categories = {};
  for (const c of categoryData) {
    let cat = await Category.findOne({ name: c.name });
    if (!cat) {
      cat = await Category.create(c);
    }
    categories[c.name] = cat;
  }
  console.log('✓ Categories ready');

  // ─── Sample Saree Products ─────────────────────
  const img = (id) => `https://picsum.photos/seed/saree${id}/600/800`;
  const colors = ['Red', 'Green', 'Blue', 'Gold', 'White', 'Maroon', 'Pink', 'Purple'];

  const products = [
    {
      name: 'Mysore Silk Saree',
      category: 'Silk Sarees',
      price: 4500, offerPrice: 5999,
      material: 'silk', workType: 'zari work', occasion: 'wedding', length: '6.0m',
      tags: ['traditional', 'festive', 'bridal'],
      featured: true, isNew: true,
      variants: [
        { size: 'Free', color: 'Gold', colorCode: '#FFD700', sku: 'MYS-SLK-GD', stock: 10 },
        { size: 'Free', color: 'Maroon', colorCode: '#800020', sku: 'MYS-SLK-MR', stock: 8 },
        { size: 'Free', color: 'Green', colorCode: '#006400', sku: 'MYS-SLK-GN', stock: 12 },
      ],
      images: [img(1), img(2), img(3)],
    },
    {
      name: 'Banarasi Brocade Saree',
      category: 'Banarasi Sarees',
      price: 8500, offerPrice: 12000,
      material: 'silk', workType: 'embroidered', occasion: 'wedding', length: '6.5m',
      tags: ['luxury', 'bridal', 'handwoven'],
      featured: true, isNew: false,
      variants: [
        { size: 'Free', color: 'Gold', colorCode: '#FFD700', sku: 'BAN-BRC-GD', stock: 5 },
        { size: 'Free', color: 'Red', colorCode: '#FF0000', sku: 'BAN-BRC-RD', stock: 7 },
      ],
      images: [img(4), img(5), img(6)],
    },
    {
      name: 'Kanchipuram Temple Border',
      category: 'Kanchipuram Sarees',
      price: 6500, offerPrice: 8000,
      material: 'silk', workType: 'zari work', occasion: 'temple', length: '6.0m',
      tags: ['traditional', 'south-indian', 'festive'],
      featured: false, isNew: true,
      variants: [
        { size: 'Free', color: 'Red', colorCode: '#FF0000', sku: 'KAN-TMP-RD', stock: 6 },
        { size: 'Free', color: 'Purple', colorCode: '#800080', sku: 'KAN-TMP-PL', stock: 4 },
        { size: 'Free', color: 'Green', colorCode: '#006400', sku: 'KAN-TMP-GN', stock: 9 },
      ],
      images: [img(7), img(8), img(9)],
    },
    {
      name: 'Cotton Printed Saree',
      category: 'Cotton Sarees',
      price: 1200, offerPrice: 1800,
      material: 'cotton', workType: 'block print', occasion: 'daily wear', length: '5.5m',
      tags: ['comfort', 'casual', 'summer'],
      featured: false, isNew: true,
      variants: [
        { size: 'Free', color: 'White', colorCode: '#FFFFFF', sku: 'COT-PRN-WH', stock: 20 },
        { size: 'Free', color: 'Blue', colorCode: '#0000FF', sku: 'COT-PRN-BL', stock: 15 },
        { size: 'Free', color: 'Pink', colorCode: '#FFC0CB', sku: 'COT-PRN-PK', stock: 18 },
      ],
      images: [img(10), img(11)],
    },
    {
      name: 'Cotton Handloom Saree',
      category: 'Cotton Sarees',
      price: 1800, offerPrice: 2500,
      material: 'cotton', workType: 'handwoven', occasion: 'casual', length: '5.5m',
      tags: ['handloom', 'eco-friendly', 'traditional'],
      featured: true, isNew: false,
      variants: [
        { size: 'Free', color: 'Green', colorCode: '#006400', sku: 'COT-HND-GN', stock: 14 },
        { size: 'Free', color: 'Maroon', colorCode: '#800020', sku: 'COT-HND-MR', stock: 11 },
      ],
      images: [img(12), img(13), img(14)],
    },
    {
      name: 'Georgette Embroidered Saree',
      category: 'Georgette Sarees',
      price: 3200, offerPrice: 4500,
      material: 'georgette', workType: 'embroidered', occasion: 'party', length: '6.0m',
      tags: ['party-wear', 'lightweight', 'designer'],
      featured: false, isNew: true,
      variants: [
        { size: 'Free', color: 'Pink', colorCode: '#FFC0CB', sku: 'GEO-EMB-PK', stock: 8 },
        { size: 'Free', color: 'Purple', colorCode: '#800080', sku: 'GEO-EMB-PL', stock: 6 },
      ],
      images: [img(15), img(16)],
    },
    {
      name: 'Chiffon Floral Saree',
      category: 'Chiffon Sarees',
      price: 2500, offerPrice: 3500,
      material: 'chiffon', workType: 'printed', occasion: 'casual', length: '6.0m',
      tags: ['lightweight', 'daily-wear', 'floral'],
      featured: false, isNew: false,
      variants: [
        { size: 'Free', color: 'Blue', colorCode: '#0000FF', sku: 'CHF-FLR-BL', stock: 10 },
        { size: 'Free', color: 'White', colorCode: '#FFFFFF', sku: 'CHF-FLR-WH', stock: 12 },
      ],
      images: [img(17), img(18)],
    },
    {
      name: 'Designer Sequin Saree',
      category: 'Designer Sarees',
      price: 5500, offerPrice: 7500,
      material: 'net', workType: 'stone work', occasion: 'party', length: '6.0m',
      tags: ['designer', 'party-wear', 'festive'],
      featured: true, isNew: true,
      variants: [
        { size: 'Free', color: 'Gold', colorCode: '#FFD700', sku: 'DSN-SQN-GD', stock: 4 },
        { size: 'Free', color: 'Maroon', colorCode: '#800020', sku: 'DSN-SQN-MR', stock: 6 },
      ],
      images: [img(19), img(20), img(21)],
    },
    {
      name: 'Kanjivaram Silk Saree',
      category: 'Kanchipuram Sarees',
      price: 9500, offerPrice: 13000,
      material: 'silk', workType: 'zari work', occasion: 'wedding', length: '6.5m',
      tags: ['bridal', 'traditional', 'luxury'],
      featured: false, isNew: false,
      variants: [
        { size: 'Free', color: 'Red', colorCode: '#FF0000', sku: 'KJV-SLK-RD', stock: 5 },
        { size: 'Free', color: 'Gold', colorCode: '#FFD700', sku: 'KJV-SLK-GD', stock: 3 },
      ],
      images: [img(22), img(23)],
    },
    {
      name: 'Georgette Party Wear Saree',
      category: 'Georgette Sarees',
      price: 2800, offerPrice: 4000,
      material: 'georgette', workType: 'stone work', occasion: 'party', length: '6.0m',
      tags: ['party-wear', 'designer', 'lightweight'],
      featured: false, isNew: false,
      variants: [
        { size: 'Free', color: 'Pink', colorCode: '#FFC0CB', sku: 'GEO-STN-PK', stock: 7 },
        { size: 'Free', color: 'Purple', colorCode: '#800080', sku: 'GEO-STN-PL', stock: 5 },
        { size: 'Free', color: 'Gold', colorCode: '#FFD700', sku: 'GEO-STN-GD', stock: 6 },
      ],
      images: [img(24), img(25)],
    },
    {
      name: 'Chiffon Evening Saree',
      category: 'Chiffon Sarees',
      price: 2200, offerPrice: 3000,
      material: 'chiffon', workType: 'embroidered', occasion: 'party', length: '6.0m',
      tags: ['evening-wear', 'lightweight', 'elegant'],
      featured: true, isNew: false,
      variants: [
        { size: 'Free', color: 'Blue', colorCode: '#0000FF', sku: 'CHF-EVE-BL', stock: 9 },
        { size: 'Free', color: 'Maroon', colorCode: '#800020', sku: 'CHF-EVE-MR', stock: 7 },
      ],
      images: [img(26), img(27), img(28)],
    },
    {
      name: 'Designer Lehenga',
      category: 'Lehengas',
      price: 12000, offerPrice: 16000,
      material: 'silk', workType: 'embroidered', occasion: 'wedding', length: '6.0m',
      tags: ['bridal', 'designer', 'festive'],
      featured: true, isNew: true,
      variants: [
        { size: 'M', color: 'Red', colorCode: '#FF0000', sku: 'LHN-EMB-RD', stock: 3 },
        { size: 'L', color: 'Red', colorCode: '#FF0000', sku: 'LHN-EMB-RL', stock: 4 },
        { size: 'M', color: 'Gold', colorCode: '#FFD700', sku: 'LHN-EMB-GD', stock: 2 },
        { size: 'L', color: 'Gold', colorCode: '#FFD700', sku: 'LHN-EMB-GL', stock: 3 },
      ],
      images: [img(29), img(30), img(31)],
    },
    {
      name: 'Silk Festive Saree',
      category: 'Silk Sarees',
      price: 3800, offerPrice: 5000,
      material: 'silk', workType: 'zari work', occasion: 'festive', length: '6.0m',
      tags: ['festive', 'traditional', 'elegant'],
      featured: false, isNew: false,
      variants: [
        { size: 'Free', color: 'Green', colorCode: '#006400', sku: 'SLK-FST-GN', stock: 11 },
        { size: 'Free', color: 'Gold', colorCode: '#FFD700', sku: 'SLK-FST-GD', stock: 8 },
      ],
      images: [img(32), img(33)],
    },
    {
      name: 'Banarasi Silk Saree',
      category: 'Banarasi Sarees',
      price: 7500, offerPrice: 10000,
      material: 'silk', workType: 'embroidered', occasion: 'festive', length: '6.5m',
      tags: ['traditional', 'festive', 'handwoven'],
      featured: false, isNew: false,
      variants: [
        { size: 'Free', color: 'Red', colorCode: '#FF0000', sku: 'BAN-SLK-RD', stock: 6 },
        { size: 'Free', color: 'Purple', colorCode: '#800080', sku: 'BAN-SLK-PL', stock: 4 },
      ],
      images: [img(34), img(35)],
    },
    {
      name: 'Cotton Summer Saree',
      category: 'Cotton Sarees',
      price: 999, offerPrice: 1499,
      material: 'cotton', workType: 'printed', occasion: 'daily wear', length: '5.5m',
      tags: ['summer', 'comfort', 'budget'],
      featured: false, isNew: true,
      variants: [
        { size: 'Free', color: 'White', colorCode: '#FFFFFF', sku: 'COT-SUM-WH', stock: 25 },
        { size: 'Free', color: 'Blue', colorCode: '#0000FF', sku: 'COT-SUM-BL', stock: 20 },
        { size: 'Free', color: 'Pink', colorCode: '#FFC0CB', sku: 'COT-SUM-PK', stock: 22 },
      ],
      images: [img(36), img(37)],
    },
  ];

  let productCount = 0;
  for (const data of products) {
    const categoryId = categories[data.category]?._id;
    if (!categoryId) {
      console.log(`  ✗ Skipping "${data.name}" — category "${data.category}" not found`);
      continue;
    }

    const exists = await Product.findOne({ name: data.name });
    if (exists) {
      console.log(`  → Already exists: ${data.name}`);
      continue;
    }

    await Product.create({ ...data, category: categoryId });
    console.log(`  ✓ ${data.name} — ₹${data.price}`);
    productCount++;
  }

  console.log(`\n── Seed complete ──`);
  console.log(`  ${productCount} products created`);
  console.log(`  Admin login: admin@vamika.com / admin123`);
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

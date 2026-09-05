/**
 * Database Seed Script
 * Run with: npx tsx lib/seed.ts
 *
 * Seeds the MongoDB database with:
 *  - 2 demo users (client + owner) with hashed passwords
 *  - 10 mock luxury properties from Erode district
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

// --- Inline schemas (avoid Next.js module resolution issues) ---

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['client', 'owner'], default: 'client' },
  },
  { timestamps: true }
);

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ['Villa', 'Penthouse', 'Estate', 'Apartment', 'Chalet'] },
    status: { type: String, required: true, enum: ['For Sale', 'For Rent'] },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    location: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    areaSqft: { type: Number, required: true },
    description: { type: String, default: '' },
    images: [{ type: String }],
    amenities: [{ type: String }],
    featured: { type: Boolean, default: false },
    yearBuilt: { type: Number },
    ownerId: { type: String },
    ownerEmail: { type: String },
  },
  { timestamps: true }
);

// --- Data ---

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

const users = [
  {
    name: 'Demo Client',
    email: 'demo@rajaconstruction.com',
    password: 'password123',
    role: 'client',
  },
  {
    name: 'Raja Property Owner',
    email: 'owner@rajaconstruction.com',
    password: 'ownerpassword123',
    role: 'owner',
  },
];

const properties = [
  {
    title: 'Thindal Hill Crest Villa',
    type: 'Villa',
    status: 'For Sale',
    price: 4850000,
    currency: 'USD',
    location: 'Thindal',
    city: 'Erode',
    bedrooms: 6,
    bathrooms: 7,
    areaSqft: 8200,
    description: 'A luxury hillside sanctuary located near the famous Thindal Murugan Temple in Erode. Features landscaped gardens, infinity pool, and panoramic sunset views of Erode city.',
    images: [img('photo-1613977257363-707ba9348227'), img('photo-1600596542815-ffad4c1539a9'), img('photo-1613490493576-7fde63acd811')],
    amenities: ['Infinity Pool', 'Private Garden', 'Temple Views', 'Home Cinema', 'Staff Quarters', 'Smart Home System'],
    featured: true,
    yearBuilt: 2016,
  },
  {
    title: 'Perundurai Royal Penthouse',
    type: 'Penthouse',
    status: 'For Sale',
    price: 6200000,
    currency: 'USD',
    location: 'Perundurai Road',
    city: 'Erode',
    bedrooms: 4,
    bathrooms: 5,
    areaSqft: 5400,
    description: 'Exclusive penthouse located on main Perundurai Road, Erode. Offers uninterrupted skyline views, a private lift lobby, and a rooftop garden overlooking the educational hub.',
    images: [img('photo-1600607687939-ce8a6c25118c'), img('photo-1600585154340-be6161a56a0c'), img('photo-1600566753086-00f18fb6b3ea')],
    amenities: ['Private Lift Lobby', 'Rooftop Garden', 'Concierge', 'Sky Pool Access', 'Wine Room', 'Home Automation'],
    featured: true,
    yearBuilt: 2021,
  },
  {
    title: 'Gobichettipalayam Heritage Estate',
    type: 'Estate',
    status: 'For Sale',
    price: 8900000,
    currency: 'USD',
    location: 'Gobichettipalayam',
    city: 'Erode',
    bedrooms: 8,
    bathrooms: 9,
    areaSqft: 12500,
    description: 'A twelve-acre heritage estate amidst coconut groves and emerald paddy fields in Gobi, famous for picturesque cinema shooting locations. Includes organic orchards and guest pavilion.',
    images: [img('photo-1613490493576-7fde63acd811'), img('photo-1600047509807-ba8f99d2cdde'), img('photo-1600210492486-724fe5c67fb0')],
    amenities: ['Coconut Plantation', 'Private Vineyard', 'Guest Pavilion', 'Tennis Court', 'Organic Farm', 'Solar Power'],
    featured: true,
    yearBuilt: 2012,
  },
  {
    title: 'Sathyamangalam Forest Reserve Chalet',
    type: 'Chalet',
    status: 'For Rent',
    price: 42000,
    currency: 'USD',
    location: 'Sathyamangalam',
    city: 'Erode',
    bedrooms: 5,
    bathrooms: 6,
    areaSqft: 6100,
    description: 'Nestled near the Sathyamangalam Tiger Reserve at the foothills of Western Ghats. Built from teak timber with indoor-outdoor spa and 9-metre glass walls facing mountain mist.',
    images: [img('photo-1449844908441-8829872d2607'), img('photo-1518780664697-55e3ad937233'), img('photo-1502005229762-cf1b2da7c5d6')],
    amenities: ['Mountain Views', 'Private Spa', 'Sauna', 'Teak Interiors', 'Fireplace Lounge', 'Private Safari Guide'],
    featured: false,
    yearBuilt: 2018,
  },
  {
    title: 'Bhavani Riverfront Residence',
    type: 'Apartment',
    status: 'For Sale',
    price: 3150000,
    currency: 'USD',
    location: 'Bhavani',
    city: 'Erode',
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 2900,
    description: 'A serene luxury residence along the sacred Bhavani river near Kooduthurai. Retains traditional Chettinad carved doors with fully automated climate and lighting systems.',
    images: [img('photo-1600585154526-990dced4db0d'), img('photo-1600607687920-4e2a09cf159d'), img('photo-1600566753190-17f0baa2a6c3')],
    amenities: ['River Access', 'Concierge', 'Private Lawn', 'Home Automation', 'Chettinad Detailing'],
    featured: false,
    yearBuilt: 1902,
  },
  {
    title: 'Chennimalai Hillside Villa',
    type: 'Villa',
    status: 'For Sale',
    price: 5450000,
    currency: 'USD',
    location: 'Chennimalai',
    city: 'Erode',
    bedrooms: 5,
    bathrooms: 6,
    areaSqft: 7300,
    description: 'Perched on the serene slopes of Chennimalai, known for its weaver heritage and sacred hill temple. Features open-air courtyard layout, infinity pool, and handloom silk lounges.',
    images: [img('photo-1571003123894-1f0594d2b5d9'), img('photo-1580587771525-78b9dba3b914'), img('photo-1512917774080-9991f1c4c750')],
    amenities: ['Infinity Pool', 'Hill Views', 'Open Courtyard', 'Staff Quarters', 'Yoga Deck'],
    featured: true,
    yearBuilt: 2019,
  },
  {
    title: 'Modakurichi Green Meadows',
    type: 'Penthouse',
    status: 'For Rent',
    price: 28000,
    currency: 'USD',
    location: 'Modakurichi',
    city: 'Erode',
    bedrooms: 3,
    bathrooms: 4,
    areaSqft: 3600,
    description: 'A high-ceilinged modern residence in Modakurichi, Erode district, featuring a private wraparound terrace overlooking endless green agricultural meadows.',
    images: [img('photo-1512917774080-9991f1c4c750'), img('photo-1600566752355-35792bedcfea'), img('photo-1600607688969-a5bfcd646154')],
    amenities: ['Meadow Views', 'Private Terrace', 'Concierge', 'Fitness Suite', 'Solar Power'],
    featured: false,
    yearBuilt: 2015,
  },
  {
    title: 'Kodumudi Kaveri View Estate',
    type: 'Estate',
    status: 'For Sale',
    price: 3980000,
    currency: 'USD',
    location: 'Kodumudi',
    city: 'Erode',
    bedrooms: 7,
    bathrooms: 8,
    areaSqft: 9800,
    description: 'A sprawling waterfront estate set around three interior courtyards in Kodumudi, facing the majestic Kaveri River with traditional tilework and private riverside temple gazebo.',
    images: [img('photo-1600566753086-00f18fb6b3ea'), img('photo-1600585154340-be6161a56a0c'), img('photo-1600607687939-ce8a6c25118c')],
    amenities: ['Kaveri River Front', 'Courtyard Gardens', 'Temple Gazebo', 'Guest Villa', 'Stables'],
    featured: false,
    yearBuilt: 1897,
  },
  {
    title: 'Bhavanisagar Reservoir Villa',
    type: 'Villa',
    status: 'For Sale',
    price: 7250000,
    currency: 'USD',
    location: 'Bhavanisagar',
    city: 'Erode',
    bedrooms: 6,
    bathrooms: 7,
    areaSqft: 8700,
    description: 'A modern stone and glass villa facing the vast Bhavanisagar dam waters, with private boat jetty, subterranean wellness spa, and steel fireplace for cool mountain evenings.',
    images: [img('photo-1518780664697-55e3ad937233'), img('photo-1449844908441-8829872d2607'), img('photo-1502005229762-cf1b2da7c5d6')],
    amenities: ['Reservoir Views', 'Boat Jetty', 'Private Spa', 'Home Cinema', 'Helipad Access'],
    featured: true,
    yearBuilt: 2020,
  },
  {
    title: 'Kavindapadi Green Valley Residence',
    type: 'Villa',
    status: 'For Rent',
    price: 31000,
    currency: 'USD',
    location: 'Kavindapadi',
    city: 'Erode',
    bedrooms: 4,
    bathrooms: 5,
    areaSqft: 5200,
    description: 'Terraced gardens descend from this villa toward lush sugarcane and turmeric fields in Kavindapadi, with an outdoor dining pavilion surrounded by organic gardens.',
    images: [img('photo-1580587771525-78b9dba3b914'), img('photo-1571003123894-1f0594d2b5d9'), img('photo-1600047509807-ba8f99d2cdde')],
    amenities: ['Valley Terraces', 'Turmeric Gardens', 'Outdoor Dining Pavilion', 'Private Pool', 'Housekeeping'],
    featured: false,
    yearBuilt: 2005,
  },
];

// --- Main ---

async function seed() {
  console.log('🌱 Connecting to MongoDB…');
  await mongoose.connect(MONGODB_URI!);
  console.log('✅ Connected.\n');

  const User = mongoose.models.User || mongoose.model('User', UserSchema);
  const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

  // Clear existing data
  await User.deleteMany({});
  await Property.deleteMany({});
  console.log('🗑️  Cleared existing users and properties.\n');

  // Seed users with hashed passwords
  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({ ...u, password: hashed });
    console.log(`👤 Created user: ${u.email} (${u.role})`);
  }

  // Seed properties
  const inserted = await Property.insertMany(properties);
  console.log(`\n🏡 Inserted ${inserted.length} properties.\n`);

  console.log('✅ Seeding complete!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

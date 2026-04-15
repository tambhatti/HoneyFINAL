'use strict';
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const H = (pw) => bcrypt.hashSync(pw, 10); // cost 10 for seeding speed

async function main() {
  console.log('🌱 Seeding database...');

  // ── Platform settings (singleton) ────────────────────────────────────────
  await prisma.platformSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton', updatedAt: new Date() },
  });

  // ── Loyalty config (singleton) ────────────────────────────────────────────
  await prisma.loyaltyConfig.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton', baseAmount: 100, pointsPerBase: 1, pointValue: 0.1, updatedAt: new Date() },
  });

  // ── Referral config (singleton) ───────────────────────────────────────────
  await prisma.referralConfig.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton', referrerBonus: 200, refereeBonus: 100, minBookingAmount: 1000, updatedAt: new Date() },
  });

  // ── Commission config (singleton) ─────────────────────────────────────────
  await prisma.commissionConfig.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton', defaultRate: 10, premiumRate: 7, standardRate: 8.5, updatedAt: new Date() },
  });

  // ── Subscription Plans ────────────────────────────────────────────────────
  for (const plan of [
    { name: 'Basic',    commissionDiscount: 10, priceMonthly: 20,  priceYearly: 200 },
    { name: 'Standard', commissionDiscount: 15, priceMonthly: 40,  priceYearly: 400, profileFeaturing: true, bannerPromotion: 'platform' },
    { name: 'Premium',  commissionDiscount: 20, priceMonthly: 80,  priceYearly: 800, profileFeaturing: true, bannerPromotion: 'both' },
  ]) {
    await prisma.subscriptionPlan.upsert({
      where: { name: plan.name }, update: plan,
      create: { ...plan, updatedAt: new Date() }
    });
  }

  // ── Categories ────────────────────────────────────────────────────────────
  const cats = [
    { name: 'Venue',       icon: '🏛', description: 'Wedding venues and halls' },
    { name: 'Photography', icon: '📸', description: 'Professional photography and videography' },
    { name: 'Catering',    icon: '🍽', description: 'Food and beverage services' },
    { name: 'Beauty',      icon: '💄', description: 'Makeup and beauty services' },
    { name: 'Decoration',  icon: '🌸', description: 'Floral and decoration services' },
    { name: 'Music',       icon: '🎵', description: 'Live music and entertainment' },
    { name: 'Transport',   icon: '🚗', description: 'Wedding transport services', status: 'Inactive' },
    { name: 'Invitations', icon: '✉️', description: 'Wedding invitation design' },
  ];
  for (const cat of cats) {
    await prisma.category.upsert({ where: { name: cat.name }, update: cat, create: { ...cat, updatedAt: new Date() } });
  }

  // ── Home Content ──────────────────────────────────────────────────────────
  const content = [
    { id: 'hero',         section: 'Hero_Banner',  title: 'Luxury Emirati Weddings',   subtitle: 'Intelligently Curated — Powered By AI', isActive: true },
    { id: 'features',     section: 'Features',     title: 'Core Features',             subtitle: 'Everything for your perfect wedding',     isActive: true },
    { id: 'categories',   section: 'Categories',   title: 'Vendor Categories',         subtitle: 'Find your perfect vendor',                isActive: true },
    { id: 'testimonials', section: 'Testimonials', title: 'What Our Clients Say',      subtitle: '',                                        isActive: true },
    { id: 'cta',          section: 'CTA_Banner',   title: 'Start Planning Today',      subtitle: 'Join thousands of happy couples',         isActive: false },
  ];
  for (const c of content) {
    await prisma.homeContent.upsert({ where: { id: c.id }, update: c, create: { ...c, updatedAt: new Date() } });
  }

  // ── Super Admin ───────────────────────────────────────────────────────────
  await prisma.admin.upsert({
    where: { email: 'admin@honeymoon.ae' },
    update: {},
    create: {
      firstName: 'Super', lastName: 'Admin',
      email: 'admin@honeymoon.ae',
      password: H('Admin@123'),
      phone: '+97141234567',
      role: 'super_admin',
    }
  });

  // ── Sample Vendors ────────────────────────────────────────────────────────
  const vendors = [
    { firstName:'Ronan',  lastName:'Blackwood',  email:'vendor1@example.com', companyName:'Timeless Charm Chateau', category:'Venue',       location:'Dubai' },
    { firstName:'Sarah',  lastName:'Parker',     email:'vendor2@example.com', companyName:'Hearts Aligned',        category:'Photography', location:'Abu Dhabi' },
    { firstName:'Ahmed',  lastName:'Al-Mansoori',email:'vendor3@example.com', companyName:'Royal Gardens',         category:'Catering',    location:'Sharjah' },
    { firstName:'Maria',  lastName:'Garcia',     email:'vendor4@example.com', companyName:'Pearl Promise',         category:'Beauty',      location:'Dubai' },
    { firstName:'James',  lastName:'Wilson',     email:'vendor5@example.com', companyName:'Velvet Vows',           category:'Decoration',  location:'Dubai' },
  ];
  for (const v of vendors) {
    await prisma.vendor.upsert({
      where: { email: v.email },
      update: {},
      create: { ...v, password: H('Vendor@123'), status: 'Active', isVerified: true, commissionRate: 10, rating: 4.5, reviewCount: 50 }
    });
  }

  // ── Sample Users ──────────────────────────────────────────────────────────
  const users = [
    { firstName:'Sarah',    lastName:'Johnson',   email:'user1@example.com', phone:'+971501234567', referralCode:'REF1001' },
    { firstName:'Mohammed', lastName:'Al-Rashid', email:'user2@example.com', phone:'+971502345678', referralCode:'REF1002' },
    { firstName:'Priya',    lastName:'Sharma',    email:'user3@example.com', phone:'+971503456789', referralCode:'REF1003' },
  ];
  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, password: H('User@123'), status: 'Active', loyaltyPoints: 500 }
    });
  }

  console.log('✅ Seed complete!');
  console.log('   Admin:  admin@honeymoon.ae / Admin@123');
  console.log('   Vendor: vendor1@example.com / Vendor@123');
  console.log('   User:   user1@example.com / User@123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

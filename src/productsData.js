/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const PRODUCTS = [
  {
    id: 'prod-01',
    name: 'Aero Wireless Headphones',
    description: 'Acoustic-precision over-ear headphones with custom active hybrid noise cancellation, studio-grade 40mm beryllium drivers, and high-fidelity smart spatial audio.',
    price: 21999.00,
    originalPrice: 25999.00,
    category: 'Gear',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 142,
    countInStock: 8,
    tags: ['Best Seller', 'Wireless', 'Audio'],
    featured: true,
    colors: [
      { name: 'Matte Obsidian', hex: '#1E1E1E' },
      { name: 'Pure Platinum', hex: '#E2E8F0' },
      { name: 'Royal Emerald', hex: '#064E3B' }
    ]
  },
  {
    id: 'prod-02',
    name: 'Kyoto Mechanical Keyboard',
    description: 'Ultra-tactile, compact 75% layout keyboard featuring premium hot-swappable tactile switches, double-shot PBT keycaps, and a gorgeous hand-finished solid walnut frame.',
    price: 13499.00,
    category: 'Desk Setup',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 88,
    countInStock: 5,
    tags: ['Custom', 'Mechanical'],
    featured: true,
    colors: [
      { name: 'Walnut Dark', hex: '#451A03' },
      { name: 'Oak Light', hex: '#CA8A04' }
    ]
  },
  {
    id: 'prod-03',
    name: 'Chronos Minimalist Watch',
    description: 'Sleek luxury timepiece featuring a sandblasted matte black titanium case, scratch-resistant sapphire crystal dome, and a vegetable-tanned Italian leather band.',
    price: 15999.00,
    originalPrice: 18999.00,
    category: 'Style',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 61,
    countInStock: 12,
    tags: ['Minimalist', 'Waterproof'],
    featured: false,
    colors: [
      { name: 'Onyx Leather', hex: '#121212' },
      { name: 'Saddle Tan', hex: '#B45309' },
      { name: 'Forest Jade', hex: '#14532D' }
    ]
  },
  {
    id: 'prod-04',
    name: 'Vertex Precision Mouse',
    description: 'Advanced ergonomic upright vertical mouse built with custom thumb rests, high-precision 8000 DPI adjustable optical sensors, and zero-latency multi-device wireless pairing.',
    price: 7499.00,
    category: 'Desk Setup',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=600&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 110,
    countInStock: 15,
    tags: ['Ergonomic', 'Wireless'],
    featured: false,
    colors: [
      { name: 'Chalk White', hex: '#FAFAFA' },
      { name: 'Basalt Charcoal', hex: '#27272A' }
    ]
  },
  {
    id: 'prod-05',
    name: 'Nomad Leather Backpack',
    description: 'Rugged yet elegant everyday carry pack designed with water-protective full-grain leather, a padded 16-inch laptop pocket, and secure magnetic Fidlock buckle straps.',
    price: 17999.00,
    originalPrice: 19999.00,
    category: 'Style',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 95,
    countInStock: 4,
    tags: ['Limited Run', 'Premium Leather'],
    featured: true,
    colors: [
      { name: 'Cognac Brown', hex: '#78350F' },
      { name: 'Midnight Jet', hex: '#09090B' }
    ]
  },
  {
    id: 'prod-06',
    name: 'Lumina Smart Desk Lamp',
    description: 'Smart ambient monitor-top and clamp-arm desk lamp. Calibrates auto-brightness based on ambient light, tuneable spectrum 2700K-6500K, and physical fluid control dial.',
    price: 6499.00,
    category: 'Desk Setup',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop&q=80',
    rating: 4.5,
    reviewsCount: 43,
    countInStock: 25,
    tags: ['Smart Automation', 'LED'],
    featured: false,
    colors: [
      { name: 'Anodized Silver', hex: '#94A3B8' },
      { name: 'Carbon Black', hex: '#18181B' }
    ]
  },
  {
    id: 'prod-07',
    name: 'Horizon Stoneware Mug',
    description: 'Artisanal double-walled insulating ceramic mug. Independently hand-spun and glazed in slow kiln cycles, keeping drinks hot while outer surface remains perfectly cool.',
    price: 2250.00,
    category: 'Home & Office',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 167,
    countInStock: 30,
    tags: ['Handmade', 'Eco-friendly'],
    featured: false,
    colors: [
      { name: 'Glacial Blue', hex: '#A5F3FC' },
      { name: 'Terracotta Clay', hex: '#F97316' },
      { name: 'Desert Sand', hex: '#FEF08A' }
    ]
  },
  {
    id: 'prod-09',
    name: 'Scribe Walnut Notebook & Pen Set',
    description: 'Includes a heavy brass executive ballpoint pen and a hand-punched, refillable A5 journal constructed with solid raw walnut bark cover sheets and linen paper.',
    price: 3499.00,
    category: 'Home & Office',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 74,
    countInStock: 0,
    tags: ['Out of Stock', 'Gift Set'],
    featured: false,
    colors: [
      { name: 'Walnut Bark', hex: '#2F1B0C' }
    ]
  },
  {
    id: 'prod-10',
    name: 'AirFlow Merino Desk Mat',
    description: 'Extra-large protective workspace runner hand-sheared from prime renewable merino wool. Naturally moisture-repellent, anti-static, and builds acoustic desks.',
    price: 3999.00,
    category: 'Desk Setup',
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&h=600&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 39,
    countInStock: 14,
    tags: ['Wool Felt', 'Comfort Glide'],
    featured: false,
    colors: [
      { name: 'Merino Anthracite', hex: '#1C1917' },
      { name: 'Merino Oatmeal', hex: '#E7E5E4' },
      { name: 'Merino Moss', hex: '#2C3E20' }
    ]
  }
];

export const CATEGORIES = ['All', 'Gear', 'Desk Setup', 'Style', 'Home & Office'];

export const COUPONS = [
  {
    code: 'WELCOME10',
    discountPercent: 10,
    minPurchase: 0,
    description: '10% Off on your absolute first purchase (No minimum order value!)'
  },
  {
    code: 'STARTUP20',
    discountPercent: 20,
    minPurchase: 9999,
    description: 'Save 20% on premium orders of ₹9,999 or more!'
  },
  {
    code: 'FREESHIP',
    discountPercent: 100,
    minPurchase: 4999,
    description: 'Free Courier Delivery for orders over ₹4,999'
  }
];

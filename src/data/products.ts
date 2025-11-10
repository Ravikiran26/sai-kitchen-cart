import { Product } from '@/types/product';

export const products: Product[] = [
  // Pickles
  {
    id: 'pkl-001',
    name: 'Traditional Mango Pickle',
    slug: 'traditional-mango-pickle',
    category: 'pickles',
    description: 'Authentic South Indian mango pickle made with raw mangoes, aromatic spices, and premium sesame oil. A family recipe passed down through generations.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '250g', weightGrams: 250, price: 149, mrp: 199, stock: 50 },
      { label: '500g', weightGrams: 500, price: 279, mrp: 349, stock: 30 },
      { label: '1kg', weightGrams: 1000, price: 499, mrp: 649, stock: 20 },
    ],
    tags: ['Traditional', 'Authentic', 'Homemade'],
    spiceLevel: 'medium',
    ingredients: ['Raw Mango', 'Sesame Oil', 'Red Chili', 'Fenugreek', 'Mustard Seeds', 'Salt'],
    isBestseller: true,
  },
  {
    id: 'pkl-002',
    name: 'Spicy Lime Pickle',
    slug: 'spicy-lime-pickle',
    category: 'pickles',
    description: 'Tangy and spicy lime pickle that adds a burst of flavor to any meal. Made with sun-dried limes and traditional spices.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '250g', weightGrams: 250, price: 129, mrp: 179, stock: 45 },
      { label: '500g', weightGrams: 500, price: 239, mrp: 299, stock: 25 },
    ],
    tags: ['Tangy', 'Spicy'],
    spiceLevel: 'hot',
    ingredients: ['Lime', 'Red Chili Powder', 'Turmeric', 'Salt', 'Mustard Oil'],
    isBestseller: true,
  },
  {
    id: 'pkl-003',
    name: 'Mixed Vegetable Pickle',
    slug: 'mixed-vegetable-pickle',
    category: 'pickles',
    description: 'A colorful medley of carrots, cauliflower, and green chilies pickled in aromatic spices.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '250g', weightGrams: 250, price: 139, mrp: 189, stock: 40 },
      { label: '500g', weightGrams: 500, price: 259, mrp: 329, stock: 22 },
    ],
    tags: ['Healthy', 'Mixed Vegetables'],
    spiceLevel: 'medium',
  },
  {
    id: 'pkl-004',
    name: 'Gongura Pickle',
    slug: 'gongura-pickle',
    category: 'pickles',
    description: 'Traditional Andhra-style gongura pickle with a unique tangy taste. Perfect with rice and ghee.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '250g', weightGrams: 250, price: 159, mrp: 209, stock: 35 },
      { label: '500g', weightGrams: 500, price: 299, mrp: 379, stock: 18 },
    ],
    tags: ['Andhra Style', 'Tangy'],
    spiceLevel: 'hot',
  },
  {
    id: 'pkl-005',
    name: 'Tomato Pickle',
    slug: 'tomato-pickle',
    category: 'pickles',
    description: 'Sweet and tangy tomato pickle made with ripe tomatoes and a hint of jaggery.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '250g', weightGrams: 250, price: 119, mrp: 159, stock: 50 },
      { label: '500g', weightGrams: 500, price: 219, mrp: 279, stock: 28 },
    ],
    tags: ['Sweet & Tangy'],
    spiceLevel: 'mild',
  },

  // Podulu
  {
    id: 'pod-001',
    name: 'Kandi Podi (Dal Powder)',
    slug: 'kandi-podi',
    category: 'podulu',
    description: 'Classic Andhra-style roasted dal powder with red chilies and garlic. Perfect with hot rice and ghee.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '250g', weightGrams: 250, price: 179, mrp: 229, stock: 40 },
      { label: '500g', weightGrams: 500, price: 329, mrp: 399, stock: 25 },
    ],
    tags: ['Traditional', 'Protein Rich'],
    spiceLevel: 'hot',
    isBestseller: true,
  },
  {
    id: 'pod-002',
    name: 'Nuvvula Podi (Sesame Powder)',
    slug: 'nuvvula-podi',
    category: 'podulu',
    description: 'Nutritious sesame seed powder with aromatic spices. Rich in calcium and healthy fats.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '250g', weightGrams: 250, price: 199, mrp: 249, stock: 35 },
      { label: '500g', weightGrams: 500, price: 369, mrp: 449, stock: 20 },
    ],
    tags: ['Healthy', 'Calcium Rich'],
    spiceLevel: 'medium',
  },
  {
    id: 'pod-003',
    name: 'Karivepaku Podi (Curry Leaf Powder)',
    slug: 'karivepaku-podi',
    category: 'podulu',
    description: 'Aromatic curry leaf powder with a unique flavor. Great for digestion and health.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '250g', weightGrams: 250, price: 189, mrp: 239, stock: 30 },
      { label: '500g', weightGrams: 500, price: 349, mrp: 429, stock: 18 },
    ],
    tags: ['Aromatic', 'Digestive'],
    spiceLevel: 'mild',
    isBestseller: true,
  },
  {
    id: 'pod-004',
    name: 'Allam Podi (Ginger Powder)',
    slug: 'allam-podi',
    category: 'podulu',
    description: 'Spicy ginger powder with warming properties. Perfect for cold weather.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '250g', weightGrams: 250, price: 169, mrp: 219, stock: 32 },
    ],
    tags: ['Warming', 'Immunity Boost'],
    spiceLevel: 'hot',
  },
  {
    id: 'pod-005',
    name: 'Palli Podi (Peanut Powder)',
    slug: 'palli-podi',
    category: 'podulu',
    description: 'Protein-rich peanut powder with roasted spices. A favorite breakfast companion.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '250g', weightGrams: 250, price: 159, mrp: 199, stock: 45 },
      { label: '500g', weightGrams: 500, price: 289, mrp: 349, stock: 24 },
    ],
    tags: ['Protein Rich', 'Breakfast'],
    spiceLevel: 'medium',
  },

  // Snacks
  {
    id: 'snk-001',
    name: 'Butter Murukku',
    slug: 'butter-murukku',
    category: 'snacks',
    description: 'Crispy, spiral-shaped traditional snack made with rice flour and butter. A festive favorite.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '250g', weightGrams: 250, price: 129, mrp: 169, stock: 50 },
      { label: '500g', weightGrams: 500, price: 239, mrp: 299, stock: 30 },
    ],
    tags: ['Crispy', 'Festive'],
    isBestseller: true,
  },
  {
    id: 'snk-002',
    name: 'Ribbon Pakoda',
    slug: 'ribbon-pakoda',
    category: 'snacks',
    description: 'Delicate ribbon-shaped snack with a perfect balance of savory and spicy flavors.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '250g', weightGrams: 250, price: 119, mrp: 159, stock: 45 },
      { label: '500g', weightGrams: 500, price: 219, mrp: 279, stock: 28 },
    ],
    tags: ['Savory', 'Tea Time'],
  },
  {
    id: 'snk-003',
    name: 'Mixture',
    slug: 'mixture',
    category: 'snacks',
    description: 'Classic South Indian mixture with peanuts, cashews, curry leaves, and sev. Perfect for any occasion.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '250g', weightGrams: 250, price: 139, mrp: 179, stock: 40 },
      { label: '500g', weightGrams: 500, price: 259, mrp: 329, stock: 25 },
    ],
    tags: ['Classic', 'Crunchy'],
    isBestseller: true,
  },
  {
    id: 'snk-004',
    name: 'Kaara Sev',
    slug: 'kaara-sev',
    category: 'snacks',
    description: 'Spicy chickpea flour noodles, crispy and addictive. A must-have for snack lovers.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '250g', weightGrams: 250, price: 109, mrp: 149, stock: 48 },
      { label: '500g', weightGrams: 500, price: 199, mrp: 259, stock: 32 },
    ],
    tags: ['Spicy', 'Crispy'],
  },
  {
    id: 'snk-005',
    name: 'Ariselu',
    slug: 'ariselu',
    category: 'snacks',
    description: 'Sweet rice flour patties with jaggery and sesame seeds. A traditional festival treat.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '250g', weightGrams: 250, price: 149, mrp: 199, stock: 35 },
    ],
    tags: ['Sweet', 'Festival Special'],
  },

  // Organic Pulses
  {
    id: 'pls-001',
    name: 'Organic Toor Dal',
    slug: 'organic-toor-dal',
    category: 'pulses',
    description: 'Premium quality organic pigeon peas, perfect for dal and sambar. Rich in protein and fiber.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '500g', weightGrams: 500, price: 189, mrp: 229, stock: 40 },
      { label: '1kg', weightGrams: 1000, price: 359, mrp: 429, stock: 25 },
    ],
    tags: ['Organic', 'Protein Rich'],
    isBestseller: true,
  },
  {
    id: 'pls-002',
    name: 'Organic Moong Dal',
    slug: 'organic-moong-dal',
    category: 'pulses',
    description: 'Split green gram, easy to digest and nutritious. Perfect for khichdi and dal preparations.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '500g', weightGrams: 500, price: 169, mrp: 209, stock: 45 },
      { label: '1kg', weightGrams: 1000, price: 319, mrp: 389, stock: 28 },
    ],
    tags: ['Organic', 'Easy Digest'],
  },
  {
    id: 'pls-003',
    name: 'Organic Urad Dal',
    slug: 'organic-urad-dal',
    category: 'pulses',
    description: 'Black gram dal, essential for idli, dosa, and vada. High in protein and minerals.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '500g', weightGrams: 500, price: 179, mrp: 219, stock: 38 },
      { label: '1kg', weightGrams: 1000, price: 339, mrp: 409, stock: 22 },
    ],
    tags: ['Organic', 'Traditional'],
    isBestseller: true,
  },
  {
    id: 'pls-004',
    name: 'Organic Chana Dal',
    slug: 'organic-chana-dal',
    category: 'pulses',
    description: 'Split chickpeas with a sweet, nutty taste. Great for dal and snacks.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '500g', weightGrams: 500, price: 159, mrp: 199, stock: 42 },
      { label: '1kg', weightGrams: 1000, price: 299, mrp: 369, stock: 26 },
    ],
    tags: ['Organic', 'Nutty Flavor'],
  },
  {
    id: 'pls-005',
    name: 'Organic Masoor Dal',
    slug: 'organic-masoor-dal',
    category: 'pulses',
    description: 'Red lentils that cook quickly. Rich in iron and perfect for quick meals.',
    images: ['/placeholder.svg'],
    variants: [
      { label: '500g', weightGrams: 500, price: 149, mrp: 189, stock: 50 },
      { label: '1kg', weightGrams: 1000, price: 279, mrp: 349, stock: 30 },
    ],
    tags: ['Organic', 'Iron Rich'],
  },
];

export const getProductsByCategory = (category: string) => {
  return products.filter(p => p.category === category);
};

export const getBestsellers = () => {
  return products.filter(p => p.isBestseller);
};

export const getProductBySlug = (slug: string) => {
  return products.find(p => p.slug === slug);
};

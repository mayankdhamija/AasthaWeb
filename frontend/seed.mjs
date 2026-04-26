import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const standardSizes = ["XS", "S", "M", "L", "XL"];

const products = [
  {
    name: "Midnight Velvet Gown",
    description: "Luxurious evening gown",
    price: 4500.0,
    imageUrls: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680fe0a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
    ],
    availableSizes: standardSizes,
    stock: { XS: 3, S: 5, M: 4, L: 2, XL: 1 },
    category: "Evening",
  },
  {
    name: "Urban Denim Jacket",
    description: "Distressed blue denim",
    price: 2200.0,
    imageUrls: [
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80",
    ],
    availableSizes: standardSizes,
    stock: { XS: 0, S: 6, M: 8, L: 5, XL: 3 },
    category: "Streetwear",
  },
  {
    name: "Floral Summer Dress",
    description: "Breathable cotton dress",
    price: 1800.0,
    imageUrls: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80",
    ],
    availableSizes: standardSizes,
    stock: { XS: 4, S: 7, M: 6, L: 4, XL: 2 },
    category: "Casual",
  },
  {
    name: "Tailored Boss Blazer",
    description: "Sharp charcoal blazer",
    price: 3200.0,
    imageUrls: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80",
    ],
    availableSizes: standardSizes,
    stock: { XS: 2, S: 4, M: 5, L: 3, XL: 0 },
    category: "Workwear",
  },
  {
    name: "Satin Slip Skirt",
    description: "Champagne satin midi",
    price: 1500.0,
    imageUrls: [
      "https://images.unsplash.com/photo-1609505848912-b7c3b8b494b7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80",
    ],
    availableSizes: standardSizes,
    stock: { XS: 0, S: 0, M: 0, L: 0, XL: 0 },  // fully out of stock example
    category: "Casual",
  },
  {
    name: "Leather Trousers",
    description: "Sleek black faux leather",
    price: 2800.0,
    imageUrls: [
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551107643-406b3a01662c?w=800&auto=format&fit=crop&q=80",
    ],
    availableSizes: standardSizes,
    stock: { XS: 1, S: 3, M: 4, L: 2, XL: 1 },
    category: "Evening",
  },
];

async function seed() {
  console.log('Deleting existing products...');
  const snapshot = await getDocs(collection(db, 'products'));
  for (const doc of snapshot.docs) {
    await deleteDoc(doc.ref);
  }
  console.log('Seeding products with stock data...');
  for (const product of products) {
    await addDoc(collection(db, 'products'), product);
    console.log(`✅ Added: ${product.name}`);
  }
  console.log('🎉 All products seeded with stock!');
  process.exit(0);
}

seed().catch(console.error);

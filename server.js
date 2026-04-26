import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PRODUCTS = [
  { id: 1, name: "Beige Silk Blouse", price: 120, oldPrice: 150, category: "Tops", color: "Beige", size: ["S", "M", "L"], image: "/images/product_1.png", isNew: true },
  { id: 2, name: "Navy Blue Tailored Blazer", price: 250, oldPrice: null, category: "Outerwear", color: "Blue", size: ["S", "M", "L", "XL"], image: "/images/product_2.png", isNew: false },
  { id: 3, name: "Sleek Black Midi Dress", price: 180, oldPrice: null, category: "Dresses", color: "Black", size: ["XS", "S", "M"], image: "/images/product_3.png", isNew: true },
  { id: 4, name: "Wide Leg White Linen Trousers", price: 110, oldPrice: 140, category: "Bottoms", color: "White", size: ["M", "L", "XL"], image: "/images/product_4.png", isNew: false },
  { id: 5, name: "Cashmere Turtleneck Sweater", price: 210, oldPrice: null, category: "Tops", color: "Beige", size: ["S", "M", "L"], image: "/images/product_1.png", isNew: false },
  { id: 6, name: "Pleated Midi Skirt", price: 95, oldPrice: null, category: "Bottoms", color: "Black", size: ["S", "M"], image: "/images/product_6.png", isNew: true },
  { id: 7, name: "Leather Ankle Boots", price: 150, oldPrice: null, category: "Shoes", color: "Black", size: ["7", "8", "9"], image: "/images/product_shoe.png", isNew: true },
  { id: 8, name: "Gold Plated Hoop Earrings", price: 45, oldPrice: 60, category: "Accessories", color: "Beige", size: ["OS"], image: "/images/product_3.png", isNew: false },
  { id: 9, name: "Classic White Sneakers", price: 85, oldPrice: null, category: "Shoes", color: "White", size: ["6", "7", "8", "9"], image: "/images/product_shoe.png", isNew: false },
  { id: 10, name: "Oversized Sunglasses", price: 120, oldPrice: 160, category: "Accessories", color: "Black", size: ["OS"], image: "/images/product_2.png", isNew: true },
  { id: 11, name: "Suede Pointed Heels", price: 135, oldPrice: null, category: "Shoes", color: "Beige", size: ["6", "7", "8"], image: "/images/product_shoe.png", isNew: true },
  { id: 12, name: "Leather Crossbody Bag", price: 190, oldPrice: 220, category: "Accessories", color: "Black", size: ["OS"], image: "/images/product_4.png", isNew: true },
  { id: 13, name: "Silk Slip Dress", price: 165, oldPrice: null, category: "Dresses", color: "Blue", size: ["S", "M", "L"], image: "/images/product_6.png", isNew: false },
  { id: 14, name: "Denim Jacket", price: 130, oldPrice: null, category: "Outerwear", color: "Blue", size: ["S", "M", "L", "XL"], image: "/images/product_2.png", isNew: true },
  { id: 15, name: "Minimalist Leather Belt", price: 55, oldPrice: null, category: "Accessories", color: "Black", size: ["S", "M", "L"], image: "/images/product_1.png", isNew: false },
  { id: 16, name: "Chunky Loafers", price: 145, oldPrice: 180, category: "Shoes", color: "Black", size: ["7", "8", "9", "10"], image: "/images/product_shoe.png", isNew: false },
];

let orders = [];
let users = [];

app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  const newUser = { id: Date.now().toString(), name, email, password };
  users.push(newUser);
  console.log('New user signed up:', newUser.email);
  res.status(201).json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
});

app.get('/api/health', (req, res) => {
  res.json({ status: "ok" });
});

app.get('/api/products', (req, res) => {
  res.json(PRODUCTS);
});

app.post('/api/checkout', (req, res) => {
  const { items, shipping, payment, total } = req.body;
  const newOrder = {
    id: 'ORD-' + Math.floor(Math.random() * 1000000),
    items,
    shipping,
    total,
    date: new Date().toISOString()
  };
  orders.push(newOrder);
  console.log('New order received:', newOrder);
  res.status(201).json({ success: true, orderId: newOrder.id });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});

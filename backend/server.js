import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config(); // load .env

// Import routes

console.log("Starting server...");
console.log("MONGO_URI =", process.env.MONGO_URI);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes

// Connect to MongoDB (updated for Mongoose 9+)
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not defined! Check your .env file.");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Example route to test MongoDB
app.get('/test', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({ collections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
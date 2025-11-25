const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const app = express();

// CORS configuration - allow your Vercel frontend
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://personalfinance-henna.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

let collection;

// Connect to MongoDB with connection reuse for serverless
async function connectDB() {
  try {
    if (!collection) {
      await client.connect();
      const db = client.db("MyExpenseDB");
      collection = db.collection("MyExpenseCollection");
      console.log("Successfully connected to MongoDB!");
    }
    return collection;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}

// Health check endpoint
app.get('/api', async (req, res) => {
  res.json({ 
    message: 'MyFinance API is running',
    timestamp: new Date().toISOString()
  });
});

// Get all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    await connectDB();
    const expenses = await collection.find({}).toArray();
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Add a new expense
app.post('/api/expenses', async (req, res) => {
  try {
    await connectDB();
    const expense = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await collection.insertOne(expense);
    res.status(201).json({
      ...expense,
      _id: result.insertedId
    });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Update an expense
app.put('/api/expenses/:id', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    
    // Check if id is a valid ObjectId or custom id
    let query;
    if (ObjectId.isValid(id) && id.length === 24) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id: id };
    }
    
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const result = await collection.findOneAndUpdate(
      query,
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "Expense not found" });
    }
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete an expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    
    // Check if id is a valid ObjectId or custom id
    let query;
    if (ObjectId.isValid(id) && id.length === 24) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id: id };
    }
    
    const result = await collection.deleteOne(query);
    
    if (result.deletedCount > 0) {
      res.json({ success: true, message: 'Expense deleted' });
    } else {
      res.status(404).json({ error: "Expense not found" });
    }
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// For Vercel serverless - must export the app
module.exports = app;


const express = require('express');
const cors = require('cors');
const { MongoClient } = require("mongodb");
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const app = express();
app.use(cors());
app.use(express.json());

let collection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("MyExpenseDB");
    collection = db.collection("My Expense Collection");
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit the process with an error code
  }
}
connectDB().catch(console.error);

// Get all expenses
app.get('/api/expenses', async (req, res) => {
  const expenses = await collection.find({}).toArray();
  res.json(expenses);
});

// Add a new expense
app.post('/api/expenses', async (req, res) => {
  const expense = req.body;
  await collection.insertOne(expense);
  res.json(expense);
});

// Update an expense
app.put('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;
  const updated = await collection.findOneAndUpdate(
    { id },
    { $set: req.body },
    { returnDocument: 'after' }
  );
  if (updated.value) {
    res.json(updated.value);
  } else {
    res.status(404).json({ error: "Expense not found" });
  }
});

// Delete an expense
app.delete('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;
  await collection.deleteOne({ id });
  res.json({ success: true });
});

module.exports = app;

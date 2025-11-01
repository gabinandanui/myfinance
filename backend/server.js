const express = require('express');
const cors = require('cors');
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://gabinandan_db_user:zQzJ21JWcwJrqP14@myexpensemanager.jtnwery.mongodb.net/?retryWrites=true&w=majority&appName=MyExpenseManager";
const client = new MongoClient(uri);

const app = express();
app.use(cors());
app.use(express.json());

let collection;

async function connectDB() {
  await client.connect();
  const db = client.db("MyExpenseDB");
  collection = db.collection("My Expense Collection");
}
connectDB();

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

app.listen(4000, () => console.log('Server running on port 4000'));

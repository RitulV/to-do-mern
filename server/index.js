const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: [""],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("Failed to connect to MongoDB", err);
});

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const Todo = mongoose.model("Todo", todoSchema);

// Routes

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find(); // Fetch all todos from MongoDB
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching todos" });
  }
});

// Get a todo by ID
app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id); // Fetch a single todo by its ID
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ message: "Error fetching todo" });
  }
});

// Add a new todo
app.post("/todos", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = new Todo({ title, description }); // Create a new todo document
    await newTodo.save(); // Save the todo in MongoDB
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: "Error creating todo" });
  }
});

// Update a todo by ID
app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true } // Return the updated document
    );
    if (!updatedTodo)
      return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: "Error updating todo" });
  }
});

// Delete a todo by ID
app.delete("/todos/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id); // Delete the todo
    if (!deletedTodo)
      return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(deletedTodo);
  } catch (err) {
    res.status(500).json({ message: "Error deleting todo" });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("Todo API with MongoDB");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;

import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

let todos = [];
let currentId = 1;

// Get all todos
app.get("/todos", (req, res) => {
  res.json({ success: true, data: todos });
});

// Get single todo
app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ success: false, message: "Not found" });
  }

  res.json({ success: true, data: todo });
});

// Create a new todo
app.post("/todos", (req, res) => {
  const { title, description, priority } = req.body;

  const newTodo = {
    id: currentId++,
    title,
    description: description || "",
    priority: priority || "low",
    completed: false,
    createdAt: new Date(),
  };

  todos.push(newTodo);

  res.status(201).json({ success: true, data: newTodo });
});

// Update todo
app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Not found" });
  }

  todos[index] = {
    ...todos[index],
    ...req.body,
  };

  res.json({ success: true, data: todos[index] });
});

// Delete todo
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Not found" });
  }

  const deleted = todos.splice(index, 1);

  res.json({ success: true, data: deleted[0] });
});

// Toggle complete
app.patch("/todos/:id/toggle", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ success: false, message: "Not found" });
  }

  todo.completed = !todo.completed;

  res.json({ success: true, data: todo });
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API running (NO DB)",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} (NO DB)`)
);

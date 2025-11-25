import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Local Storage Setup
const STORAGE_FILE = path.join(__dirname, "todos.json");

// Initialize storage file if it doesn't exist
const initializeStorage = async () => {
  try {
    await fs.access(STORAGE_FILE);
    console.log("Storage file exists ");
  } catch (error) {
    console.log("Creating new storage file ");
    await fs.writeFile(STORAGE_FILE, JSON.stringify([]));
  }
};

// Helper functions for local storage
const readTodos = async () => {
  try {
    const data = await fs.readFile(STORAGE_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading todos:", error);
    return [];
  }
};

const writeTodos = async (todos) => {
  try {
    await fs.writeFile(STORAGE_FILE, JSON.stringify(todos, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing todos:", error);
    return false;
  }
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Validate todo data
const validateTodo = (todo) => {
  const validPriorities = ["low", "medium", "high"];

  if (!todo.title || todo.title.trim() === "") {
    return { valid: false, message: "Title is required" };
  }

  if (todo.priority && !validPriorities.includes(todo.priority)) {
    return { valid: false, message: "Invalid priority level" };
  }

  return { valid: true };
};

// Routes

// GET all todos
app.get("/api/todos", async (req, res) => {
  try {
    const { status, priority, sortBy } = req.query;
    let todos = await readTodos();

    // Filter by status
    if (status) {
      todos = todos.filter((todo) =>
        status === "completed" ? todo.completed : !todo.completed
      );
    }

    // Filter by priority
    if (priority) {
      todos = todos.filter((todo) => todo.priority === priority);
    }

    // Sort todos
    if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      todos.sort(
        (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
      );
    } else {
      // Default: sort by creation date (newest first)
      todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
      message: "Todos fetched successfully ",
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching todos",
      error: error.message,
    });
  }
});

// GET single todo by ID
app.get("/api/todos/:id", async (req, res) => {
  try {
    const todos = await readTodos();
    const todo = todos.find((t) => t.id === req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
      message: "Todo fetched successfully ",
    });
  } catch (error) {
    console.error("Error fetching todo:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching todo",
      error: error.message,
    });
  }
});

// POST create new todo
app.post("/api/todos", async (req, res) => {
  try {
    const { title, description = "", priority = "low" } = req.body;

    // Validate input
    const validation = validateTodo({ title, priority });
    if (!validation.valid) {
      return res
        .status(400)
        .json({ success: false, message: validation.message });
    }

    // Create todo object
    const newTodo = {
      id: generateId(),
      title: title.trim(),
      description: description ? description.trim() : "",
      priority: priority || "low",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Read, add and persist
    const todos = await readTodos();
    todos.unshift(newTodo);
    const writeSuccess = await writeTodos(todos);
    if (!writeSuccess) {
      throw new Error("Failed to create todo");
    }

    res.status(201).json({
      success: true,
      data: newTodo,
      message: "Todo created successfully",
    });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating todo",
      error: error.message,
    });
  }
});

// PUT update todo
app.put("/api/todos/:id", async (req, res) => {
  try {
    const { title, description, completed, priority } = req.body;
    const todos = await readTodos();
    const todoIndex = todos.findIndex((t) => t.id === req.params.id);

    if (todoIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }

    // Validate if title provided
    if (
      title !== undefined &&
      (title === null || title.toString().trim() === "")
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    // Validate priority if provided
    const validPriorities = ["low", "medium", "high"];
    if (priority !== undefined && !validPriorities.includes(priority)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid priority level" });
    }

    // Update fields that are provided
    const todo = todos[todoIndex];
    if (title !== undefined) todo.title = title.toString().trim();
    if (description !== undefined)
      todo.description =
        description === null ? "" : description.toString().trim();
    if (completed !== undefined) todo.completed = Boolean(completed);
    if (priority !== undefined) todo.priority = priority;
    todo.updatedAt = new Date().toISOString();

    const writeSuccess = await writeTodos(todos);
    if (!writeSuccess) {
      throw new Error("Failed to update todo");
    }

    res.status(200).json({
      success: true,
      data: todo,
      message: "Todo updated successfully",
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating todo",
      error: error.message,
    });
  }
});
// TODO: Add search functionality - GET /api/todos/search?q=searchterm.
// TODO: optional auth with jwt/localstorage.

// DELETE todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const todos = await readTodos();
    const todoIndex = todos.findIndex((t) => t.id === req.params.id);

    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];

    const writeSuccess = await writeTodos(todos);
    if (!writeSuccess) {
      throw new Error("Failed to delete todo");
    }

    res.status(200).json({
      success: true,
      data: deletedTodo,
      message: "Todo deleted successfully ",
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting todo",
      error: error.message,
    });
  }
});

// Toggle todo completion status
app.patch("/api/todos/:id/toggle", async (req, res) => {
  try {
    const todos = await readTodos();
    const todoIndex = todos.findIndex((t) => t.id === req.params.id);

    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    todos[todoIndex].completed = !todos[todoIndex].completed;
    todos[todoIndex].updatedAt = new Date().toISOString();

    const writeSuccess = await writeTodos(todos);
    if (!writeSuccess) {
      throw new Error("Failed to toggle todo");
    }

    res.status(200).json({
      success: true,
      data: todos[todoIndex],
      message: `Todo marked as ${
        todos[todoIndex].completed ? "completed" : "incomplete"
      } `,
    });
  } catch (error) {
    console.error("Error toggling todo:", error);
    res.status(500).json({
      success: false,
      message: "Server error while toggling todo",
      error: error.message,
    });
  }
});

// Statistics and Analytics
app.get("/api/todos/stats", async (req, res) => {
  try {
    const todos = await readTodos();

    const stats = {
      total: todos.length,
      completed: todos.filter((todo) => todo.completed).length,
      pending: todos.filter((todo) => !todo.completed).length,
      byPriority: {
        high: todos.filter((todo) => todo.priority === "high").length,
        medium: todos.filter((todo) => todo.priority === "medium").length,
        low: todos.filter((todo) => todo.priority === "low").length,
      },
      completionRate:
        todos.length > 0
          ? Math.round(
              (todos.filter((todo) => todo.completed).length / todos.length) *
                100
            )
          : 0,
    };

    // Daily summary (today's todos)
    const today = new Date().toISOString().split("T")[0];
    const todaysTodos = todos.filter(
      (todo) => todo.createdAt.split("T")[0] === today
    );

    // Weekly summary (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyTodos = todos.filter(
      (todo) => new Date(todo.createdAt) >= weekAgo
    );

    // Monthly summary (last 30 days)
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthlyTodos = todos.filter(
      (todo) => new Date(todo.createdAt) >= monthAgo
    );

    stats.productivity = {
      today: {
        created: todaysTodos.length,
        completed: todaysTodos.filter((todo) => todo.completed).length,
      },
      thisWeek: {
        created: weeklyTodos.length,
        completed: weeklyTodos.filter((todo) => todo.completed).length,
      },
      thisMonth: {
        created: monthlyTodos.length,
        completed: monthlyTodos.filter((todo) => todo.completed).length,
      },
    };

    res.status(200).json({
      success: true,
      data: stats,
      message: "Statistics fetched successfully ",
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching statistics",
      error: error.message,
    });
  }
});

// Get completion history
app.get("/api/todos/history", async (req, res) => {
  try {
    const todos = await readTodos();
    const completedTodos = todos.filter((todo) => todo.completed);

    // Group by completion date
    const history = {};
    completedTodos.forEach((todo) => {
      const date = todo.updatedAt.split("T")[0];
      if (!history[date]) {
        history[date] = [];
      }
      history[date].push({
        id: todo.id,
        title: todo.title,
        priority: todo.priority,
        completedAt: todo.updatedAt,
      });
    });

    // Sort dates in descending order
    const sortedHistory = Object.keys(history)
      .sort((a, b) => new Date(b) - new Date(a))
      .reduce((obj, key) => {
        obj[key] = history[key];
        return obj;
      }, {});

    res.status(200).json({
      success: true,
      data: sortedHistory,
      message: "Completion history fetched successfully ",
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching history",
      error: error.message,
    });
  }
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const todos = await readTodos();
    res.status(200).json({
      success: true,
      message: "Server is running successfully ",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      storage: {
        type: "Local JSON File",
        file: "todos.json",
        totalTodos: todos.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Health check failed",
      error: error.message,
    });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Todo List API - MERN Stack",
    version: "1.0.0",
    storage: "Local JSON File Storage",
    endpoints: {
      todos: "/api/todos",
      health: "/api/health",
      singleTodo: "/api/todos/:id",
      toggleTodo: "/api/todos/:id/toggle",
      statistics: "/api/todos/stats",
      history: "/api/todos/history",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initializeStorage();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        `📋 Todo API endpoints available at http://localhost:${PORT}/api/todos`
      );
      console.log(`💡 Health check: http://localhost:${PORT}/api/health`);
      console.log(`💾 Using local JSON file storage: ${STORAGE_FILE}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;

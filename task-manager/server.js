// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let tasks = [];
let currentId = 1;

// Get all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Get a task by ID
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (task) {
    res.json(task);
  } else {
    res.status(404).send("Task not found");
  }
});

// Create a new task
app.post("/tasks", (req, res) => {
  const newTask = {
    id: currentId++,
    title: req.body.title,
    description: req.body.description,
    due_date: req.body.due_date,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update a task by ID
app.put("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (task) {
    task.title = req.body.title;
    task.description = req.body.description;
    task.due_date = req.body.due_date;
    res.json(task);
  } else {
    res.status(404).send("Task not found");
  }
});

// Delete a task by ID
app.delete("/tasks/:id", (req, res) => {
  tasks = tasks.filter((t) => t.id !== parseInt(req.params.id));
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

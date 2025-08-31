import express, { Application } from 'express';
import { v4 as uuidv4 } from 'uuid';
const app: Application = express();

app.use(express.json());

type TaskType = {
  taskDes: string;
  id: string;
};

// Store tasks in app.locals for easier reset during tests
app.locals.tasks = [] as TaskType[];

app.get("/Task", (req, res) => {
  res.status(200).json({ task: app.locals.tasks });
});

app.post("/Task", (req, res) => {
  const { taskDes } = req.body;
  if (!taskDes) return res.status(400).json({ message: "taskDes required" });

  const newTask: TaskType = { taskDes, id: uuidv4() };
  app.locals.tasks.push(newTask);
  res.status(201).json(newTask);
});

app.delete("/Task/:id", (req, res) => {
  const { id } = req.params;
  app.locals.tasks = app.locals.tasks.filter((task: TaskType) => task.id !== id);
  res.json({ message: "success" });
});

export default app;

import request from 'supertest';
import app from '../app';

describe("Task API", () => {
  // Before each test, reset the tasks array
  beforeEach(() => {
    // @ts-ignore
    app.locals.tasks = [];
  });

  it("GET /Task - should return empty array initially", async () => {
    const res = await request(app).get("/Task");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("task");
    expect(Array.isArray(res.body.task)).toBe(true);
    expect(res.body.task.length).toBe(0);
  });

  it("POST /Task - should create a new task", async () => {
    const res = await request(app)
      .post("/Task")
      .send({ taskDes: "My first task" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("taskDes", "My first task");
    expect(res.body).toHaveProperty("id");
  });

  it("GET /Task - should return tasks after creating one", async () => {
    await request(app).post("/Task").send({ taskDes: "Task 1" });
    const res = await request(app).get("/Task");
    expect(res.body.task.length).toBe(1);
    expect(res.body.task[0]).toHaveProperty("taskDes", "Task 1");
  });

  it("DELETE /Task/:id - should delete a task", async () => {
    // Create a task
    const task = await request(app)
      .post("/Task")
      .send({ taskDes: "Task to delete" });

    const id = task.body.id;

    // Delete the task
    const deleteRes = await request(app).delete(`/Task/${id}`).send();
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body).toHaveProperty("message", "success");

    // Confirm task is deleted
    const getRes = await request(app).get("/Task");
    expect(getRes.body.task.find((t: any) => t.id === id)).toBeUndefined();
  });
});

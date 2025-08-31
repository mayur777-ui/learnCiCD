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
    it('should update an existing task', async () => {
    // First, create a task
    const postRes = await request(app)
      .post('/Task')
      .send({ taskDes: 'Original Task' });

    const taskId = postRes.body.id;

    // Update the task
    const putRes = await request(app)
      .put(`/Task/${taskId}`)
      .send({ taskDes: 'Updated Task' });

    expect(putRes.status).toBe(200);
    expect(putRes.body).toHaveProperty('id', taskId);
    expect(putRes.body).toHaveProperty('taskDes', 'Updated Task');

    // Verify tasks array is updated
    const getRes = await request(app).get('/Task');
    expect(getRes.body.task[0]).toHaveProperty('taskDes', 'Updated Task');
  });

  it('should return 404 for non-existent task', async () => {
    const res = await request(app)
      .put('/Task/non-existent-id')
      .send({ taskDes: 'Updated Task' });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Task not found');
  });

  it('should return 400 if taskDes is missing', async () => {
    const postRes = await request(app)
      .post('/Task')
      .send({ taskDes: 'Original Task' });

    const taskId = postRes.body.id;

    const res = await request(app).put(`/Task/${taskId}`).send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'taskDes required');
  });
});

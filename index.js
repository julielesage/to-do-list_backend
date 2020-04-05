const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");

const server = express();
server.use(formidableMiddleware());

mongoose.connect("mongodb://localhost/to-do-list", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Task = mongoose.model("Task", {
  title: { type: String }
});

server.get("/", (req, res) => {
  res.json("To Do List say hi");
});

/* Crud --> Create */

server.post("/create", async (req, res) => {
  try {
    const newTask = new Task({
      title: req.fields.title
    });
    console.log(req.fields.title);

    await newTask.save();
    res.status(200).send({
      message: "new task created"
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* cRud --> Read all */

server.get("/tasks/with-count", async (req, res) => {
  try {
    const all = await Task.find();
    res.status(200).send({
      count: all.length,
      tasks: all
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* crUd --> Update */

server.post("/update", async (req, res) => {
  try {
    if (req.fields.id && req.fields.title) {
      const taskToUpdate = await Task.findById(req.fields.id);
      taskToUpdate.title = req.fields.title;
      await taskToUpdate.save();
      res.json(taskToUpdate);
    } else {
      res.json({ message: "data missing" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* cruD --> Delete */
server.post("/delete", async (req, res) => {
  try {
    if (req.fields.id) {
      const taskToDelete = await Task.findById(req.fields.id);
      await taskToDelete.remove();
      res.json("task deleted");
    } else {
      res.json({ message: "missing id" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

server.all("*", (req, res) => {
  res.json({ message: "this route does not exist" });
});

server.listen(3000, () => {
  console.log("server started");
});

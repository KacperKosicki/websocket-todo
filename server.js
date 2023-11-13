const express = require("express");
const app = express();
const socket = require("socket.io");

const tasks = [];

const server = app.listen(8000, () => console.log("Server is running on Port:", 8000));

app.use((req, res) => res.status(404).send("404: Page not found"));

const io = socket(server);

io.on("connection", (socket) => {
  console.log("Client connected with ID:", socket.id);
  socket.emit('updateData', tasks);

  socket.on("addTask", (task) => {
    console.log("Task added");
    tasks.push(task);
    socket.broadcast.emit("addTask", task);
  });

  socket.on("removeTask", (task) => {
    console.log("Task removed");
    tasks.splice(tasks.indexOf(task), 1);
    socket.broadcast.emit("removeTask", task);
  });

  socket.on("disconnect", () => console.log("Client disconnected with ID:", socket.id));
});
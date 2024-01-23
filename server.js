const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const app = express();

let users = [{}];
app.use(cors());

app.get("/", (req, res) => {
  res.send("Chat server working");
});

const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
  // console.log("new user joined", socket.id);

  socket.on("userLogin", ({ user }) => {
    users[socket.id] = user;
    // console.log("dd user", `${user} has joined`);
    socket.broadcast.emit("userjoined", {
      user: "Admin",
      message: `${users[socket.id]} has joned`,
    });

    socket.emit("welcome", {
      user: "Admin",
      message: `Hey ${users[socket.id]} welcome to the chat!`,
      data: users,
    });
  });

  socket.on("sendingMessage", ({ message, id }) => {
    // socket.emit("sentMessage",data)
    io.emit("sentMessage", { user: users[id], message, id });
    // console.log("dd sendingMessage", message);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", {
      user: "Admit",
      message: `${users[socket.id]} left`,
    });
    // console.log(`${users[socket.id]} left`);
  });
});


server.listen(process.env.PORT, () => {
  console.log(`server is connected http://localhost:${process.env.PORT}`);
});

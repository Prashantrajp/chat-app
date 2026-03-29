const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { MongoClient } = require("mongodb");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 🔥 apna MongoDB link yaha paste kar
const uri = "mongodb+srv://admin:prashant@123@cluster0.xjpxqgw.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);
let db;

// DB connect
async function connectDB() {
  try {
    await client.connect();
    db = client.db("chatApp");
    console.log("MongoDB Connected 🔥");
  } catch (err) {
    console.log(err);
  }
}
connectDB();

// static files serve
app.use(express.static(__dirname));

// 🔥 IMPORTANT FIX (Cannot GET /)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// socket
io.on("connection", async (socket) => {
  console.log("User connected");

  // 🔥 old messages load
  const messages = await db.collection("messages").find().toArray();
  socket.emit("loadMessages", messages);

  // 🔥 new message
  socket.on("message", async (data) => {
    await db.collection("messages").insertOne(data);
    io.emit("message", data);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
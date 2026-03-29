const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { MongoClient } = require("mongodb");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 👉 apna MongoDB link yaha paste kar
const uri = "mongodb+srv://admin:prashant@123@cluster0.xjpxqgw.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);

let db;

// connect database
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

app.use(express.static("server"));

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("message", async (data) => {
    // save in DB
    await db.collection("messages").insertOne(data);

    // send to all users
    io.emit("message", data);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
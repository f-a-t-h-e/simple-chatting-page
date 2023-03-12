import express from "express";
import * as http from "http";
import * as WebSocket from "ws";
import path from "path";

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws: WebSocket, req) => {
  ws.on("message", (data: string, isBinary) => {
    const message = JSON.parse(data);
    console.log("Message from client :: ", message);

    wss.clients.forEach((client) => {
      if (/*client !== ws && */ client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ ...message, myMessage: client === ws }));
      }
    });
  });
  // ws.send(JSON.stringify({ message: "Welcome to chat !!" }));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

server.listen(process.env.PORT || 8080, () => {
  console.log("Server started");
});

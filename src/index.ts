import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import * as http from "http";
import cookieParser from "cookie-parser";

import config, { keys } from "./utils/config";

import path from "path";

import connectDB from "./database/connect";
import router from "./routes";
import ErrorHandler from "./middlewares/ErrorHandler";
import { createWS } from "./gateway";
import User from "./models/User";

const app = express();
const server = http.createServer(app);

app.use(cookieParser());

createWS(server);

app.get("/", async (req, res) => {
  console.log();

  const payload = jwt.verify(
    req.cookies["authorize-chat"] || "",
    keys.JWT_SECRET_KEY
  ) as any;
  const user = await User.findById(payload.id);

  res.sendFile(
    path.join(__dirname, "..", "public", user ? "index.html" : "auth.html")
  );
});

app.use(express.json());

app.use("/api/v1", router);

app.use(ErrorHandler);

server.listen(process.env.PORT || 3000, async () => {
  try {
    config();

    await connectDB();
    console.log("Server started");
  } catch (error) {
    console.log("🚀 ~ file: index.ts:35 ~ server.listen ~ error:", error);
  }
});

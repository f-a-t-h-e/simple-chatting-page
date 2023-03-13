import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/User";
import { keys } from "../utils/config";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new Error("Please send username and password");
    }

    const user = await User.findOne({
      username,
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error("Wrong credentials");
    }

    res.cookie(
      "authorize-chat",
      jwt.sign({ username, id: user.id }, keys.JWT_SECRET_KEY)
    );

    res.status(202).json({ id: user.id, username });
  } catch (error: any) {
    console.log("🚀 ~ file: auth.ts:10 ~ authRouter.post ~ error:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Wrong credentials" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new Error("Please send username and password");
    }

    const salt = bcrypt.genSaltSync(10);

    const user = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });

    res.cookie(
      "authorize-chat",
      jwt.sign({ username, id: user.id }, keys.JWT_SECRET_KEY)
    );

    res.status(202).json({ id: user.id, username });
  } catch (error) {
    console.log("🚀 ~ file: auth.ts:10 ~ authRouter.post ~ error:", error);
    res.status(500).end();
  }
};

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface UserAuthRequest extends Request {
  user?: string;
}

export const verifyToken = async (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET) as string;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

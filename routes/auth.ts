import { Router } from "express";
import jwt from "jsonwebtoken";

export const authRouter = Router();

authRouter.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    const userId = process.env.USER_ID;
    const userName = process.env.USER_NAME;
    const userEmail = process.env.USER_EMAIL;
    const userPwd = process.env.USER_PWD;

    if (email !== userEmail)
      return res
        .status(400)
        .json({ message: "Niepoprawny email użytkownika." });

    if (password !== userPwd)
      return res.status(400).json({ message: "Niepoprawne hasło." });

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
    res.status(200).json({ token, userName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

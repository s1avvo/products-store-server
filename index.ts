import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import fileUpload from "express-fileupload";
import rateLimit from "express-rate-limit";
import "express-async-errors";
import { handleError } from "./utils/errors";
import { viewRouter } from "./routes/view";
import { authRouter } from "./routes/auth";
import { listRouter } from "./routes/store";
import "./utils/db";

const app = express();

//middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(express.json());

app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
);

//roots
app.use("/api/", viewRouter);
app.use("/api/auth", authRouter);
app.use("/api/store", listRouter);

//errors
app.use(handleError);

app.listen(process.env.PORT || 3001, () =>
  console.log("Listening on port 3001")
);

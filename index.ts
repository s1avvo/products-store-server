import express, { Router } from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import rateLimit from "express-rate-limit";
import "express-async-errors";
import { handleError } from "./utils/errors";
import { viewRouter } from "./routes/view";
import { authRouter } from "./routes/auth";
import { listRouter } from "./routes/store";
import "./utils/db";
import bodyParser from "body-parser";
import helmet from "helmet";
// import { pool } from "./utils/db";
dotenv.config();

const app = express();

const PORT = 3005;

// Test połączenia z bazą danych
// (async () => {
//   try {
//     const connection = await pool.getConnection();
//     await connection.query("SELECT 1");
//     console.log("Database connection successful");
//     connection.release();
//   } catch (error) {
//     console.error("Error connecting to the database:", error);
//     process.exit(1); // Wyjdź z procesu, jeśli połączenie nie jest prawidłowe
//   }
// })();

// app.set("trust proxy", 1);

//middleware
// app.use((req, res, next) => {
//   const date = new Date().toLocaleString("pl-PL");
//   console.log(`${date} | ${req.method} ${req.url}`);
//   next();
// });

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
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

app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 1000, // Limit each IP to 500 requests per window
  })
);

//roots
const router = Router();

router.use("/", viewRouter);
router.use("/auth", authRouter);
router.use("/store", listRouter);

app.use("/api", router);

//errors
app.use(handleError);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

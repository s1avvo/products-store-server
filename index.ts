import * as express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import * as fileUpload from "express-fileupload";
import * as cors from "cors";
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
    origin: "http://localhost:3000",
  })
);

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(express.json());

//roots
app.use("/", viewRouter);
app.use("/auth", authRouter);
app.use("/store", listRouter);

//errors
app.use(handleError);

app.listen(process.env.PORT || 3001, () =>
  console.log("Listening on port 3001")
);

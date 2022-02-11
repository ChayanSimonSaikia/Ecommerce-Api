import express, { Application } from "express";
import config from "config";
import morgan from "morgan";
import { logger } from "./utils/logger";
import connect from "./utils/__init_db";
import { routes } from "./routes/index.routes";
import { multerImageUpload } from "./helpers/__config_multer";

const app: Application = express();
// Middlewares
app.use(express.json());
app.use(morgan("dev"));

const port = config.get<number>("PORT") || 3000;
app.listen(port, () => {
  logger.info(`Server is running on PORT:${port}`);
  connect();
  routes(app); // Routes
  multerImageUpload(app); // Image Upload middleware
});

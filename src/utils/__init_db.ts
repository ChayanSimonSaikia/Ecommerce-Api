import mongoose from "mongoose";
import config from "config";
import { logger } from "./logger";

const connect = async () => {
  try {
    const connection = await mongoose.connect(config.get<string>("DB_URI"), {
      dbName: config.get<string>("DB_NAME"),
    });
    logger.info(`MongoDB is connected`);
    return connection;
  } catch (error: any) {
    logger.error(error.message);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () =>
  logger.warn("MongoDB connected ended")
);

process.on("SIGINT", () => {
  mongoose.disconnect();
  process.exit(1);
});

export default connect;

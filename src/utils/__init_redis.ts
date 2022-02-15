import { createClient } from "redis";
import { logger } from "./logger";
const client = createClient();

(async () => {
  try {
    await client.connect();
  } catch (error: any) {
    throw error;
  }
})();

client.on("connect", () => logger.info("redis connected"));
client.on("error", (error) => {
  logger.error(error);
  process.exit(1);
});
client.on("end", () => logger.warn("redis disconnected"));

process.on("SIGINT", () => {
  client.quit();
  process.exit(1);
});

export default client;

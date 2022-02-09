import pino from "pino";
import moment from "moment";

export const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
  timestamp: () => `,"time":"${moment().format("DD-MM-YYYY hh:mm:ss")}"`,
  base: {
    pid: false,
  },
});

const { createLogger, format, transports } = require("winston");
const path = require("path");

const logLevel = {
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
  verbose: "verbose",
};

class Logger {
  constructor({
    app, // Electron app instance
    logPath = "appData",
    logLevel = "info",
    logFileName = "app.log",
    logMaxSize = 1024 * 1024 * 5, // 5MB
    logMaxFiles = 5,
  }) {
    const validLogPaths = [
      "appData",
      "userData",
      "temp",
      "exe",
      "desktop",
      "documents",
      "downloads",
      "music",
      "pictures",
      "videos",
      "module",
      "recent",
    ];

    if (!validLogPaths.includes(logPath)) {
      console.warn(
        `Invalid log path '${logPath}'. Defaulting to 'appData'. Valid paths are: ${validLogPaths.join(
          ", "
        )}`
      );
      logPath = "appData";
    }

    const productName = app.name;
    const logDirectory = app.getPath(logPath);
    const logFilePath = path.join(logDirectory, productName, logFileName);

    console.log(`Find logs at: ${logFilePath}`);

    this.logger = createLogger({
      level: logLevel,
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(
          (info) =>
            `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
        )
      ),
      transports: [
        new transports.Console(),
        new transports.File({
          filename: logFilePath,
          maxsize: logMaxSize,
          maxFiles: logMaxFiles,
        }),
      ],
    });
  }

  debug(message) {
    this.logger.debug(message);
  }

  info(message) {
    this.logger.info(message);
  }

  error(message) {
    this.logger.error(message);
  }

  warn(message) {
    this.logger.warn(message);
  }

  verbose(message) {
    this.logger.verbose(message);
  }
}

function log(logger, message, level) {
  if (logger) {
    switch (level) {
      case "debug":
        logger.debug(message);
        break;
      case "info":
        logger.info(message);
        break;
      case "warn":
        logger.warn(message);
        break;
      case "error":
        logger.error(message);
        break;
      case "verbose":
        logger.verbose(message);
        break;
      default:
        console.log(message);
        break;
    }
  } else {
    console.log(message);
  }
}

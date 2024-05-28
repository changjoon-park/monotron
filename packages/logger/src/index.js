const { createLogger, format, transports } = require("winston");
const path = require("path");

const logLevels = {
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
  verbose: "verbose",
};

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

class Logger {
  constructor({
    app, // Electron app instance
    logPath = "appData",
    logLevel = "info",
    logFileName = "app.log",
    logMaxSize = 1024 * 1024 * 5, // 5MB
    logMaxFiles = 5,
  }) {
    if (!validLogPaths.includes(logPath)) {
      console.warn(
        `Invalid log path '${logPath}'. Defaulting to 'appData'. Valid paths are: ${validLogPaths.join(
          ", "
        )}`
      );
      logPath = "appData";
    }

    if (!Object.values(logLevels).includes(logLevel)) {
      console.warn(
        `Invalid log level '${logLevel}'. Defaulting to 'info'. Valid levels are: ${logLevels.join(
          ", "
        )}`
      );
      logLevel = "info";
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

module.exports = Logger;

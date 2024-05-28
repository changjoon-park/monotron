const { spawn } = require("child_process");
const path = require("path");
const { log, logLevel, Logger } = require("../utils/logger");

class PythonSubprocess {
  constructor({
    app, // Electron app instance
    logger = null, // Logger instance
    moduleName = "run_app", // The name of your main Python module (or executable name)
  }) {
    this.app = app;
    this.subProcess = null;
    this.moduleName = moduleName;

    if (!logger) {
      this.logger = new Logger({ app });
    } else {
      this.logger = logger;
    }
  }

  getPythonExePath() {
    const baseDir = path.dirname(this.app.getPath("exe"));

    let pythonExePath;

    switch (process.platform) {
      case "win32":
        pythonExePath = path.join(baseDir, `${this.moduleName}.exe`); // TODO: Check Windows executable
        break;
      case "darwin":
        pythonExePath = path.join(
          baseDir,
          "../Resources",
          `${this.moduleName}.app`,
          "Contents",
          "MacOS",
          `${this.moduleName}`
        ); // macOS executable path
        break;
      default:
        pythonExePath = path.join(baseDir, `${this.moduleName}`); // Fallback for other platforms
    }

    return pythonExePath;
  }

  start(callback) {
    if (process.env.NODE_ENV === "development") {
      log(
        logger,
        "Skipping Python subprocess start in development mode.",
        logLevel.info
      );
      if (callback) {
        callback();
      }
      return;
    }

    const pythonExePath = this.getPythonExePath();
    const args = [];
    log(logger, `Python executable path: ${pythonExePath}`, logLevel.info);
    log(logger, "Starting Python subprocess...", logLevel.info);

    try {
      this.subProcess = spawn(pythonExePath, args);
      log(
        logger,
        `Python subprocess started with PID: ${this.subProcess.pid}`,
        logLevel.info
      );

      this.subProcess.stdout.on("data", (data) => {
        log(logger, `stdout: ${data}`, logLevel.info);
      });

      this.subProcess.stderr.on("data", (data) => {
        log(logger, `stderr: ${data}`, logLevel.error);
      });

      this.subProcess.on("close", (code) => {
        log(
          logger,
          `Python subprocess exited with code ${code}`,
          logLevel.info
        );
        this.subProcess = null;
      });

      if (callback) {
        callback();
      }
    } catch (error) {
      log(logger, `Error starting Python subprocess: ${error}`, logLevel.error);
      this.subProcess = null;
    }
  }

  stop() {
    if (!this.subProcess) {
      log(logger, "No subprocess to stop.", logLevel.info);
      return;
    }

    const pid = this.subProcess.pid;
    if (!pid) {
      log(
        logger,
        "Subprocess has no PID, may have already stopped.",
        logLevel.info
      );
      return;
    }

    try {
      // Attempt graceful shutdown
      process.kill(pid, "SIGTERM");
      log(
        logger,
        `Sent SIGTERM to Python subprocess with PID: ${pid}`,
        logLevel.info
      );

      // Set a timeout to forcefully terminate the process if it doesn't exit
      setTimeout(() => {
        if (this.subProcess && !this.subProcess.killed) {
          process.kill(pid, "SIGKILL");
          log(
            logger,
            `Sent SIGKILL to Python subprocess with PID: ${pid}`,
            logLevel.info
          );
        }
      }, 5000); // Wait 5 seconds before sending SIGKILL
    } catch (ex) {
      log(
        logger,
        `Failed to kill process with PID: ${pid} - ${ex}`,
        logLevel.error
      );
    }

    this.subProcess = null; // Clear the subprocess reference
  }
}

module.exports = PythonSubprocess;

const { spawn } = require("child_process");
const path = require("path");
const http = require("http");

const Logger = require("@electron-python/logger");

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
      this.logger = new Logger({
        app: this.app,
        logPath: "appData",
        logLevel: "info",
        logFileName: "app.log",
      });
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
      this.logger.info("Skipping Python subprocess start in development mode.");
      if (callback) {
        callback();
      }
      return;
    }

    const pythonExePath = this.getPythonExePath();
    const args = [];
    this.logger.info(`Python executable path: ${pythonExePath}`);
    this.logger.info("Starting Python subprocess...");

    try {
      this.subProcess = spawn(pythonExePath, args);
      this.logger.info(
        `Python subprocess started with PID: ${this.subProcess.pid}`
      ); // TODO: Check if this.subProcess.pid is always available

      this.subProcess.stdout.on("data", (data) => {
        this.logger.info(`stdout: ${data}`);
      });

      this.subProcess.stderr.on("data", (data) => {
        this.logger.error(`stderr: ${data}`);
      });

      this.subProcess.on("close", (code) => {
        this.logger.info(`Python subprocess exited with code ${code}`);
        this.subProcess = null;
      });

      if (callback) {
        callback();
      }
    } catch (error) {
      this.logger.error(`Error starting Python subprocess: ${error}`);
      this.subProcess = null;
    }
  }

  stop() {
    if (!this.subProcess) {
      this.logger.info("No subprocess to stop.");
      return;
    }

    const pid = this.subProcess.pid;
    if (!pid) {
      this.logger.info("Subprocess has no PID, may have already stopped.");
      return;
    }

    try {
      // Attempt graceful shutdown
      process.kill(pid, "SIGTERM");
      this.logger.info(`Sent SIGTERM to Python subprocess with PID: ${pid}`);

      // Set a timeout to forcefully terminate the process if it doesn't exit
      setTimeout(() => {
        if (this.subProcess && !this.subProcess.killed) {
          process.kill(pid, "SIGKILL");
          this.logger.info(
            `Sent SIGKILL to Python subprocess with PID: ${pid}`
          );
        }
      }, 5000); // Wait 5 seconds before sending SIGKILL
    } catch (ex) {
      this.logger.error(`Failed to kill process with PID: ${pid} - ${ex}`);
    }

    this.subProcess = null; // Clear the subprocess reference
  }

  async checkServerReady({
    host,
    port,
    path = "/",
    timeout = 100,
    retries = 30,
  }) {
    const url = `http://${host}:${port}${path}`;

    const attemptConnection = async (retryCount) => {
      this.logger.verbose(
        `Attempting to connect to ${url}. Retries left: ${retryCount}`
      );

      try {
        const response = await this.httpGet(url);
        const message = await this.handleResponse(response);
        return message;
      } catch (error) {
        this.logger.warn(`Fail to connect to ${url}`);
        if (retryCount > 0) {
          await new Promise((resolve) => setTimeout(resolve, timeout));
          return attemptConnection(retryCount - 1);
        } else {
          this.logger.error("Server did not become ready in time.");
          throw new Error(message);
        }
      }
    };

    return attemptConnection(retries);
  }

  httpGet(url) {
    return new Promise((resolve, reject) => {
      http
        .get(url, (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            resolve({ statusCode: res.statusCode, data });
          });

          res.on("error", (err) => {
            reject(new Error(`HTTP request error: ${err.message}`));
          });
        })
        .on("error", (err) => {
          reject(new Error(`HTTP request error: ${err.message}`));
        });
    });
  }

  async handleResponse(response) {
    if (response.statusCode === 200) {
      try {
        const jsonData = JSON.parse(response.data);
        const message = `Server response: ${
          jsonData.message || "No message found"
        }`;
        this.logger.info(message);
        return message;
      } catch (error) {
        const message = `Error parsing JSON response: ${error.message}`;
        this.logger.error(message);
        throw new Error(message);
      }
    } else {
      const message = `Server not ready. Status code: ${response.statusCode}`;
      this.logger.error(message);
      throw new Error(message);
    }
  }
}

module.exports = PythonSubprocess;

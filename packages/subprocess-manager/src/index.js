const { spawn, execFile } = require("child_process");
const path = require("path");

class PythonSubprocessManager {
  constructor({
    app: app, // Electron app instance
    logger: logger = null, // Logger instance
  }) {
    this.app = app;
    this.logger = logger;
    this.subProcess = null;
    this.PY_SRC_FOLDER = "src/python"; // Directory where your Python source code is located
    this.PY_MODULE = "run_app"; // The name of your main Python module (or executable name)
  }

  getPythonScriptPath() {
    const isProduction = process.env.NODE_ENV === "production";
    const baseDir = isProduction
      ? path.dirname(app.getPath("exe")) // Path for production
      : app.getAppPath(); // Path for development

    let executablePath;
    if (process.platform === "win32") {
      executablePath = path.join(baseDir, `${this.PY_MODULE}.exe`); // TODO: Check Windows executable
    } else if (process.platform === "darwin") {
      executablePath = path.join(
        baseDir,
        "../Resources",
        `${this.PY_MODULE}.app`,
        "Contents",
        "MacOS",
        `${this.PY_MODULE}`
      ); // macOS executable path
    } else {
      executablePath = path.join(baseDir, `${this.PY_MODULE}`); // Fallback for other platforms
    }

    const srcPath = path.join(
      baseDir,
      `${this.PY_SRC_FOLDER}`,
      `${this.PY_MODULE}.py`
    ); // Path for development
    return isProduction ? executablePath : srcPath;
  }

  start() {
    const scriptPath = this.getPythonScriptPath();
    const isProduction = process.env.NODE_ENV === "production";
    const pythonCommand = isProduction ? scriptPath : "python";
    const args = isProduction ? [] : [scriptPath];

    logInfo(
      `Attempting to start Python subprocess. Environment: ${process.env.NODE_ENV}`
    );
    logInfo(`Script path: ${scriptPath}`);
    logInfo(`Python command: ${pythonCommand}`);

    if (!isProduction) {
      execFile(pythonCommand, ["--version"], (error, stdout) => {
        if (error) {
          logError(`Python is not installed or not found in PATH: ${error}`); // Log error message
          return;
        }
        logInfo(`Python version: ${stdout.trim()}`);
      });
    }

    try {
      logInfo("Starting Python subprocess...");

      this.subProcess = spawn(pythonCommand, args);
      logInfo(`Python subprocess started with PID: ${this.subProcess.pid}`);

      this.subProcess.stdout.on("data", (data) => {
        logInfo(`Python subprocess stdout: ${data}`);
      });

      this.subProcess.stderr.on("data", (data) => {
        logError(`Python subprocess stderr: ${data}`);
      });

      this.subProcess.on("close", (code) => {
        logInfo(`Python subprocess exited with code ${code}`);
        this.subProcess = null;
      });
    } catch (error) {
      logError(`Error starting Python subprocess: ${error}`);
      this.subProcess = null;
    }
  }

  stop() {
    if (!this.subProcess) {
      logInfo("No subprocess to stop.");
      return;
    }

    const pid = this.subProcess.pid;
    if (!pid) {
      logInfo("Subprocess has no PID, may have already stopped.");
      return;
    }

    try {
      // Attempt graceful shutdown
      process.kill(pid, "SIGTERM");
      logInfo(`Sent SIGTERM to Python subprocess with PID: ${pid}`);

      // Set a timeout to forcefully terminate the process if it doesn't exit
      setTimeout(() => {
        if (this.subProcess && !this.subProcess.killed) {
          process.kill(pid, "SIGKILL");
          logInfo(`Sent SIGKILL to Python subprocess with PID: ${pid}`);
        }
      }, 5000); // Wait 5 seconds before sending SIGKILL
    } catch (ex) {
      logError(`Failed to kill process with PID: ${pid} - ${ex}`);
    }

    this.subProcess = null; // Clear the subprocess reference
  }
}

module.exports = PythonSubprocessManager;

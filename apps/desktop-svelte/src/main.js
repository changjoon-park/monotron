const { app, BrowserWindow } = require("electron");
const path = require("node:path");

import {
  PythonSubprocess,
  startPythonServer,
} from "@electron-python/subprocess-manager";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const pythonSubprocess = new PythonSubprocess({
  app: app,
  moduleName: "run_app",
});

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/src/app.html`)
    );
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  startPythonServer(pythonSubprocess, {
    host: "localhost",
    port: 4040,
  });
});

// Clean up Python subprocesses before quitting the app.
app.on("quit", () => {
  pythonSubprocess.stop();
});

import { app, BrowserWindow } from "electron";
import path from "path";

import { PythonSubprocess, startPythonServer } from "@monotron/python-manager";

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
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

app.on("ready", () => {
  createWindow();

  startPythonServer(pythonSubprocess, {
    host: "localhost",
    port: 4040,
  });
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Clean up Python subprocesses before quitting the app.
app.on("quit", () => {
  pythonSubprocess.stop();
});

import { App, app, BrowserWindow } from "electron";
import express, { Application } from "express";
import path from "path";
import { isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
// import { startInitialSetup } from "./service/DockerService.js";
let server: Application;

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }

  server = initServer();

  // Import the endpoints after the server is initialized
  import("./controllerHandler.js");

  // startup the initializers
  // TODO backend
  // startInitialSetup();

  mainWindow.on("closed", () => {
    app.quit();
  });
});

function initServer(): Application {
  const expressApp = express();
  const PORT = process.env.PORT || 3000;

  expressApp.listen(PORT, () => {
    console.log(`Express server is running on http://localhost:${PORT}`);
  });
  return expressApp;
}

export { server };

import { app, BrowserWindow } from "electron";
import path from "path";
import { registerTitlebarIpc } from "@main/window/titlebarIpc";

// Electron Forge automatically creates these entry points
declare const APP_WINDOW_WEBPACK_ENTRY: string;
declare const APP_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let appWindow: BrowserWindow;

/**
 * Create Application Window
 * @returns {BrowserWindow} Application Window Instance
 */
export function createAppWindow(): BrowserWindow {
  // Create new window instance
  appWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "#202020",
    show: false,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: "hidden",
    icon: path.resolve("assets/images/appIcon.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      preload: APP_WINDOW_PRELOAD_WEBPACK_ENTRY,
      sandbox: false,
    },
  });

  // CORS disable

  function UpsertKeyValue(obj: Record<string, string> | Record<string, string[]>, keyToChange: string, value: string[]) {
    const keyToChangeLower = keyToChange.toLowerCase();
    for (const key of Object.keys(obj)) {
      if (key.toLowerCase() === keyToChangeLower) {
        // Reassign old key
        obj[key] = value;
        // Done
        return;
      }
    }
    // Insert at end instead
    obj[keyToChange] = value;
  }

  appWindow.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      const { requestHeaders } = details;
      UpsertKeyValue(requestHeaders, "Access-Control-Allow-Origin", ["*"]);
      UpsertKeyValue(requestHeaders, "Access-Control-Allow-Headers", ["*"]);
      UpsertKeyValue(requestHeaders, "Access-Control-Allow-Methods", ["GET,HEAD,POST,OPTIONS,PUT,DELETE"]);
      callback({ requestHeaders });
    },
  );
  
  appWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const { responseHeaders } = details;
    UpsertKeyValue(responseHeaders, "Access-Control-Allow-Origin", ["*"]);
    UpsertKeyValue(responseHeaders, "Access-Control-Allow-Headers", ["*"]);
    UpsertKeyValue(responseHeaders, "Access-Control-Allow-Methods", ["GET,HEAD,POST,OPTIONS,PUT,DELETE"]);
    callback({
      responseHeaders,
    });
  });

  // Load the index.html of the app window.
  appWindow.loadURL(APP_WINDOW_WEBPACK_ENTRY);

  // Show window when its ready to
  appWindow.on("ready-to-show", () => appWindow.show());

  // Register Inter Process Communication for main process
  registerMainIPC();

  // Close all windows when main window is closed
  appWindow.on("close", () => {
    appWindow = null;
    app.quit();
  });

  return appWindow;
}

/**
 * Register Inter Process Communication
 */
function registerMainIPC() {
  /**
   * Here you can assign IPC related codes for the application window
   * to Communicate asynchronously from the main process to renderer processes.
   */
  registerTitlebarIpc(appWindow);
}

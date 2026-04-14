/**
 * Main process entry point for the Electron desktop application.
 *
 * This file handles:
 * - Creating and configuring the main `BrowserWindow`
 * - Setting environment variables and configuration paths
 * - Serving renderer assets (dist or Vite dev server)
 * - Security improvements, including navigation handling
 * - Application menu, ready notification, and development shortcuts
 */

import { app, BrowserWindow, Menu } from "electron";
import serve from "electron-serve";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Derive __dirname in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set the app root directory for reference in cross-path scenarios
process.env.APP_ROOT = path.join(__dirname, "..");

// Core distribution and public resource paths:
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

/**
 * PUBLIC assets location:
 * - Uses "public" dir when running in Vite dev mode for hot reload/assets
 * - Otherwise uses the production dist directory
 */
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

// Allow local HTTP dev server for browser security model in development
app.commandLine.appendSwitch(
  "unsafely-treat-insecure-origin-as-secure",
  "http://localhost:9000",
);

// Needs to be run before 'app.whenReady'
const loadURL = serve({ directory: RENDERER_DIST });

// Main window reference
let win: BrowserWindow | null;
/**
 * Creates the main application window and sets up core behaviors, UX,
 * development shortcuts, inter-process messaging, and security restrictions.
 */
async function createWindow() {
  win = new BrowserWindow({
    width: 1512,
    height: 1064,
    minWidth: 900,
    minHeight: 600,
    icon: path.join(process.env.VITE_PUBLIC, "Logo.ico"),
    title: "Akkl",
    show: false, // Only show after 'ready-to-show' event for smoother UX
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Wait for the window to be fully ready before displaying and maximizing.
  win.once("ready-to-show", () => {
    win?.show();
    win?.maximize();
  });

  /**
   * Global keyboard shortcuts for development and reload:
   * - F12 or Ctrl+Shift+I / Cmd+Opt+I: Toggle dev tools
   * - Ctrl+R or Cmd+R: Reload window
   */
  win.webContents.on("before-input-event", (event, input) => {
    if (
      input.key === "F12" ||
      (input.key.toLowerCase() === "i" &&
        ((input.control && input.shift) || (input.meta && input.alt)))
    ) {
      win?.webContents.toggleDevTools();
      event.preventDefault();
    }
    if (input.key.toLowerCase() === "r" && (input.control || input.meta)) {
      win?.webContents.reload();
      event.preventDefault();
    }
  });

  // Disable application menu, but keep the slot for future features
  Menu.setApplicationMenu(null);

  /**
   * Notify the renderer process when Electron main is ready;
   * provides status and timestamp for diagnostic or readiness display
   */
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", {
      status: "ready",
      time: new Date().toLocaleString(),
    });
  });

  /**
   * Security: Block in-app navigation to external or untrusted URLs.
   * - Allows navigation in dev only to Vite dev URL, in prod only to app://
   */
  win.webContents.on("will-navigate", (event, url) => {
    if (VITE_DEV_SERVER_URL && !url.startsWith(VITE_DEV_SERVER_URL)) {
      event.preventDefault();
    } else if (!VITE_DEV_SERVER_URL && !url.startsWith("app://")) {
      event.preventDefault();
    }
  });

  /**
   * Prevent new windows from opening in-app; external URLs open in the user's browser instead.
   */
  win.webContents.setWindowOpenHandler(({ url }) => {
    const { shell } = require("electron");
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Load the correct URL: Vite dev server for development, local dist for production
  if (VITE_DEV_SERVER_URL) {
    await win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    await loadURL(win); // Serves static files via app://; ensures same-site cookies work
  }
}

/**
 * Quit the app when all windows are closed, except on macOS
 * (where apps typically stay open until user quits explicitly)
 */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

/**
 * macOS-specific: Re-create a window when the dock icon is clicked
 * and there are no open windows.
 */
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/**
 * Main entrypoint: Called when Electron is ready.
 * Responsible for creating the main window.
 */
app.whenReady().then(() => {
  createWindow();
});

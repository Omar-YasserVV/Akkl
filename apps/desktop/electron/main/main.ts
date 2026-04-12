import { app, BrowserWindow, Menu } from "electron";
import serve from "electron-serve";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

app.commandLine.appendSwitch(
  "unsafely-treat-insecure-origin-as-secure",
  "http://localhost:9000",
);

// Set up BEFORE app.whenReady()
const loadURL = serve({ directory: RENDERER_DIST });

let win: BrowserWindow | null;

async function createWindow() {
  win = new BrowserWindow({
    width: 1512,
    height: 1064,
    icon: path.join(process.env.VITE_PUBLIC, "Logo.ico"),
    title: "Akkl",
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  win.maximize();

  win.webContents.on("before-input-event", (event, input) => {
    if (input.key === "F12") {
      win?.webContents.toggleDevTools();
      event.preventDefault();
    }
    if (input.key.toLowerCase() === "r" && input.control) {
      win?.webContents.reload();
      event.preventDefault();
    }
  });

  Menu.setApplicationMenu(null);

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    await loadURL(win); // serves via app:// — cookies work
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();
});

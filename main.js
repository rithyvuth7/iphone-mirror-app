const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let win;
let uxplay;

function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

ipcMain.on("start-mirror", (_, deviceName) => {

  const exePath = path.join(__dirname, "uxplay.exe");

  uxplay = spawn(exePath, ["-n", deviceName || "My iPhone Mirror", "-fps", "60", "-s", "1920x1080"], {
    cwd: __dirname,
    env: {
      ...process.env,
      PATH: process.env.PATH + ";C:\\msys64\\ucrt64\\bin"
    }
  });

  uxplay.stdout.on("data", data => {
    win.webContents.send("log", data.toString());
  });

  uxplay.stderr.on("data", data => {
    win.webContents.send("log", "ERR: " + data.toString());
  });

  uxplay.on("error", err => {
    win.webContents.send("log", "FAILED: " + err.message);
  });
});

ipcMain.on("stop-mirror", () => {
  if (uxplay) {
    uxplay.kill();
    win.webContents.send("log", "🔴 Mirroring stopped\n");
  }
});
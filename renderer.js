const { ipcRenderer } = require("electron");

function startMirror() {
  const name = document.getElementById("deviceName").value;

  document.getElementById("status").innerText = "🟡 Waiting for iPhone...";
  document.getElementById("log").textContent = "";

  ipcRenderer.send("start-mirror", name);
}

function stopMirror() {
  document.getElementById("status").innerText = "🔴 Stopped";
  ipcRenderer.send("stop-mirror");
}

ipcRenderer.on("log", (_, data) => {

  const logBox = document.getElementById("log");
  logBox.textContent += data;
  logBox.scrollTop = logBox.scrollHeight;

  if (data.includes("Initialized server socket")) {
    document.getElementById("status").innerText = "🟡 Waiting for iPhone...";
  }

  if (data.includes("AirPlay mirroring session started")) {
    document.getElementById("status").innerText = "🟢 iPhone Connected";
  }
});
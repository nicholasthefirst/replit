const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");

function runBot(code, botId) {
  return new Promise((resolve) => {
    const botPath = path.join(__dirname, "bots", `${botId}.js`);

    fs.writeFileSync(botPath, code);

    const child = spawn("node", [botPath]);

    child.stdout.on("data", (data) => {
      console.log(`[BOT ${botId}] ${data}`);
    });

    child.stderr.on("data", (data) => {
      console.log(`[BOT ${botId} ERROR] ${data}`);
    });

    resolve(child);
  });
}

module.exports = { runBot };

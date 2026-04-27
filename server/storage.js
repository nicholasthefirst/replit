const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "projects.json");

function loadProjects() {
  if (!fs.existsSync(DB_FILE)) return {};
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveProjects(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = { loadProjects, saveProjects };

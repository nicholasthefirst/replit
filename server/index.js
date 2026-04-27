const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { runBot } = require("./runner");
const { loadProjects, saveProjects } = require("./storage");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let runningBots = {};
let projects = loadProjects();

/* CREATE PROJECT */
app.post("/create", (req, res) => {
  const id = uuidv4();

  projects[id] = {
    id,
    name: "New Bot",
    code: "// your bot code"
  };

  saveProjects(projects);
  res.json(projects[id]);
});

/* GET PROJECTS */
app.get("/projects", (req, res) => {
  res.json(Object.values(projects));
});

/* SAVE PROJECT */
app.post("/save", (req, res) => {
  const { id, code } = req.body;

  if (!projects[id]) return res.json({ error: "Not found" });

  projects[id].code = code;
  saveProjects(projects);

  res.json({ status: "saved" });
});

/* RUN BOT */
app.post("/run", async (req, res) => {
  const { id } = req.body;

  if (!projects[id]) return res.json({ error: "Not found" });

  if (runningBots[id]) {
    return res.json({ error: "Already running" });
  }

  const process = await runBot(projects[id].code, id);
  runningBots[id] = process;

  res.json({ status: "running" });
});

/* STOP BOT */
app.post("/stop", (req, res) => {
  const { id } = req.body;

  if (!runningBots[id]) {
    return res.json({ error: "Not running" });
  }

  runningBots[id].kill();
  delete runningBots[id];

  res.json({ status: "stopped" });
});

app.listen(3000, () => console.log("API running on 3000"));

let currentId = null;

async function fetchProjects() {
  const res = await fetch("http://localhost:3000/projects");
  const data = await res.json();

  const select = document.getElementById("projects");
  select.innerHTML = "";

  data.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    select.appendChild(opt);
  });

  if (data.length) {
    currentId = data[0].id;
    document.getElementById("editor").value = data[0].code;
  }
}

async function createProject() {
  const res = await fetch("http://localhost:3000/create", { method: "POST" });
  const data = await res.json();
  currentId = data.id;
  fetchProjects();
}

async function loadProject() {
  const id = document.getElementById("projects").value;
  currentId = id;

  const res = await fetch("http://localhost:3000/projects");
  const data = await res.json();

  const project = data.find(p => p.id === id);
  document.getElementById("editor").value = project.code;
}

async function save() {
  const code = document.getElementById("editor").value;

  await fetch("http://localhost:3000/save", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ id: currentId, code })
  });

  alert("Saved");
}

async function run() {
  await fetch("http://localhost:3000/run", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ id: currentId })
  });

  alert("Bot running");
}

async function stop() {
  await fetch("http://localhost:3000/stop", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ id: currentId })
  });

  alert("Bot stopped");
}

fetchProjects();

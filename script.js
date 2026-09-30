// 1. Estado: un arreglo de objetos con las tareas

// Tareas que se muestran solo la primera vez (guardamos como texto para el [local storage])
// 1. Estado
const defaultTasks = [
  { text: "Welcome to the todo app!", done: false },
  { text: "Esto es una lista de tareas", done: false },
  { text: "Tiene contadores", done: true }
];

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  return saved ? JSON.parse(saved) : defaultTasks;
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

let tasks = loadTasks();

// 2. Referencias al HTML
const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const errorMsg = document.getElementById("error");
const list = document.getElementById("task-list");

// 3. Dibujar la lista según el estado
function render() {
  list.innerHTML = "";
  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " task--done" : "");

    const del = document.createElement("button");
    del.className = "btn-delete";
    del.textContent = "✕";
    del.setAttribute("aria-label", "Eliminar");
    del.onclick = () => { tasks.splice(i, 1); render(); };

    const text = document.createElement("span");
    text.className = "task__text";
    text.textContent = task.text;
    text.title = "Doble clic para editar";
    text.ondblclick = () => editTask(i, li, text);

    const check = document.createElement("button");
    check.className = "btn-check";
    check.textContent = "✓";
    check.setAttribute("aria-label", "Completar");
    check.onclick = () => { task.done = !task.done; render(); };

    li.append(del, text, check);
    list.appendChild(li);
  });
  updateCounters();
  saveTasks();          // guarda después de cada cambio
}

// 4. Editar
function editTask(i, li, textEl) {
  const edit = document.createElement("input");
  edit.className = "task__edit";
  edit.value = tasks[i].text;
  li.replaceChild(edit, textEl);
  edit.focus();
  const save = () => {
    const value = edit.value.trim();
    if (value) tasks[i].text = value;
    render();
  };
  edit.onblur = save;
  edit.onkeydown = e => { if (e.key === "Enter") save(); };
}

// 5. Agregar con validación
function addTask() {
  const value = input.value.trim();
  if (!value) { errorMsg.hidden = false; return; }
  errorMsg.hidden = true;
  tasks.push({ text: value, done: false });
  input.value = "";
  render();
}
addBtn.onclick = addTask;
input.onkeydown = e => { if (e.key === "Enter") addTask(); };

// 6. Contadores (solo contadores)
function updateCounters() {
  const done = tasks.filter(t => t.done).length;
  document.getElementById("total").textContent = "Total: " + tasks.length;
  document.getElementById("completed").textContent = "Completed: " + done;
  document.getElementById("incompleted").textContent = "Incompleted: " + (tasks.length - done);
}

// 7. Tema claro/oscuro (recuerda tu elección)
const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.dataset.theme = savedTheme;
} else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
  root.dataset.theme = "light";
}
document.getElementById("theme-toggle").onclick = () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
};

render();
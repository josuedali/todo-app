// 1. Estado: un arreglo de objetos con las tareas
let tasks = [
  { text: "Welcome to the todo app!", done: false },
  { text: "Esto es una lista de tareas", done: false },
  { text: "Tiene contadores", done: true }   // al menos una completada
];

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
    text.textContent = task.text;       // textContent evita inyectar HTML
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
}

// 4. Editar: cambia el texto por un input
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

// 6. Contadores
function updateCounters() {
  const done = tasks.filter(t => t.done).length;
  document.getElementById("total").textContent = "Total: " + tasks.length;
  document.getElementById("completed").textContent = "Completed: " + done;
  document.getElementById("incompleted").textContent = "Incompleted: " + (tasks.length - done);
}

// 7. Tema claro/oscuro (usa el del sistema al inicio)
const root = document.documentElement;
if (window.matchMedia("(prefers-color-scheme: light)").matches) root.dataset.theme = "light";
document.getElementById("theme-toggle").onclick = () => {
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
};

render();

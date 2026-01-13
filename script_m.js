const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const resetTaskBtn = document.getElementById("resetTaskBtn");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

let tasks = [];
const TASK_API = "http://localhost:3000/api/tasks?type=study";

function authHeader() {
  return {
    "Content-Type": "application/json",
    authorization: localStorage.getItem("token"),
  };
}

function loadTasks() {
  fetch(TASK_API, { headers: authHeader() })
    .then((res) => res.json())
    .then((data) => {
      tasks = data || [];
      renderTasks();
    });
}

function saveTasks() {
  fetch(TASK_API, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(tasks),
  });
}

function resetTasksBackend() {
  fetch(TASK_API, {
    method: "DELETE",
    headers: authHeader(),
  });
}

function updateProgress() {
  const total = tasks.length;
  if (total === 0) {
    progressFill.style.width = "0%";
    progressText.textContent = "0%";
    return;
  }
  const completed = tasks.filter((t) => t.done).length;
  const percent = Math.round((completed / total) * 100);
  progressFill.style.width = percent + "%";
  progressText.textContent = percent + "%";
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""}>
      <span>${task.text}</span>
      <button class="delete-task">❌</button>
    `;
    if (task.done) {
      li.classList.add("done");
    } else {
      li.classList.remove("done");
    }
    li.querySelector("input").onchange = (e) => {
      tasks[index].done = e.target.checked;
      saveTasks();
      renderTasks();
    };

    li.querySelector(".delete-task").onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    taskList.appendChild(li);
  });
  updateProgress();
}

addTaskBtn.onclick = () => {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
};

resetTaskBtn.onclick = () => {
  if (confirm("Reset toàn bộ tasks?")) {
    tasks = [];
    resetTasksBackend();
    renderTasks();
  }
};

const tableBody = document.querySelector("#tkbTable tbody");
const resetBtn = document.getElementById("resetBtn");
const hours = [
  "7:00",
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];
const days = ["2", "3", "4", "5", "6", "7", "CN"];
let tkbData = {};
const TKB_API = "http://localhost:3000/api/tkb";
function loadTKB() {
  fetch(TKB_API, { headers: authHeader() })
    .then((res) => res.json())
    .then((data) => {
      tkbData = data || {};
      createTable();
    });
}
function saveTKB() {
  fetch(TKB_API, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(tkbData),
  });
}
function resetTKB() {
  fetch(TKB_API, {
    method: "DELETE",
    headers: authHeader(),
  });
}
function createTable() {
  tableBody.innerHTML = "";
  hours.forEach((hour) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = hour;
    tr.appendChild(th);
    days.forEach((day) => {
      const td = document.createElement("td");
      td.contentEditable = true;
      if (tkbData[day] && tkbData[day][hour]) {
        td.textContent = tkbData[day][hour];
      }
      td.oninput = () => {
        if (!tkbData[day]) tkbData[day] = {};
        tkbData[day][hour] = td.textContent;
        saveTKB();
      };
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
}
resetBtn.onclick = () => {
  if (confirm("Reset toàn bộ thời khóa biểu?")) {
    tkbData = {};
    resetTKB();
    createTable();
  }
};

loadTasks();
loadTKB();

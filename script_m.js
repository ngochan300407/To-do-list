/************ TKB ************/
const tableBody = document.querySelector("#tkbTable tbody");
const resetBtn = document.getElementById("resetBtn");

let tkbData = JSON.parse(localStorage.getItem("tkbData")) || {};

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
      td.dataset.day = day;
      td.dataset.hour = hour;

      if (tkbData[day] && tkbData[day][hour]) {
        td.textContent = tkbData[day][hour];
      }

      td.addEventListener("input", () => {
        if (!tkbData[day]) tkbData[day] = {};
        tkbData[day][hour] = td.textContent;
        localStorage.setItem("tkbData", JSON.stringify(tkbData));
      });

      tr.appendChild(td);
    });

    tableBody.appendChild(tr);
  });
}

resetBtn.addEventListener("click", () => {
  if (confirm("Bạn có chắc muốn xóa toàn bộ thời khóa biểu?")) {
    tkbData = {};
    localStorage.removeItem("tkbData");
    createTable();
  }
});

createTable();

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const resetTaskBtn = document.getElementById("resetTaskBtn");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function updateProgress() {
  const total = tasks.length;
  if (total === 0) {
    progressFill.style.width = "0%";
    progressText.textContent = "0%";
    return;
  }

  const completed = tasks.filter((task) => task.done).length;
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

    li.querySelector("input").addEventListener("change", (e) => {
      tasks[index].done = e.target.checked;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      updateProgress();
    });

    li.querySelector(".delete-task").addEventListener("click", () => {
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    });

    taskList.appendChild(li);
  });

  updateProgress();
}

addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ text, done: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskInput.value = "";
  renderTasks();
});

resetTaskBtn.addEventListener("click", () => {
  if (confirm("Reset toàn bộ tasks?")) {
    tasks = [];
    localStorage.removeItem("tasks");
    renderTasks();
  }
});

renderTasks();

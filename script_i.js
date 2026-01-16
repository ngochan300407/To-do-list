const API = "http://localhost:3000";
const TASK_API = API + "/api/tasks?type=work";

const Daily = {
  tasks: [],

  headers() {
    return {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
    };
  },

  load() {
    fetch(TASK_API, { headers: this.headers() })
      .then((r) => (r.status === 401 ? [] : r.json()))
      .then((data) => {
        this.tasks = data || [];
        this.render();
      });
  },

  save() {
    fetch(TASK_API, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(this.tasks),
    });
  },

  render() {
    const list = document.getElementById("workList");
    list.innerHTML = "";

    let done = 0;

    this.tasks.forEach((task, i) => {
      if (task.done) done++;

      const li = document.createElement("li");
      li.innerHTML = `
        <input type="checkbox" ${task.done ? "checked" : ""}>
        <span>${task.text}</span>
        <button class="delete-daily">❌</button>
      `;

      const checkbox = li.querySelector("input");
      checkbox.onchange = () => {
        task.done = checkbox.checked;
        this.save();
        this.render();
      };
      const delBtn = li.querySelector(".delete-daily");

      delBtn.onclick = () => {
        this.tasks.splice(i, 1);
        this.save();
        this.render();
      };
      if (task.done) li.style.textDecoration = "line-through";
      list.appendChild(li);
    });

    const percent =
      this.tasks.length === 0
        ? 0
        : Math.round((done / this.tasks.length) * 100);

    document.getElementById("workPercent").innerText = percent + "%";
    document.getElementById(
      "circleProgress"
    ).style.background = `conic-gradient(#250b62 ${percent}%, #eee ${percent}%)`;
  },

  add() {
    const input = document.getElementById("newTask");
    const text = input.value.trim();
    if (!text) return;

    this.tasks.push({ text, done: false });
    input.value = "";
    this.save();
    this.render();
  },
};
if (localStorage.getItem("token")) {
  Daily.load();
}

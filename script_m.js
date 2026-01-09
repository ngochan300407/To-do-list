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

const loginBtn = document.getElementById("loginBtn");
const loginBox = document.getElementById("loginBox");
const username = document.getElementById("username");
const password = document.getElementById("password");

loginBtn.onclick = () => {
  loginBox.style.display = "flex";
};

function hideLogin() {
  loginBox.style.display = "none";
}

const API = "http://localhost:3000";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    authorization: localStorage.getItem("token"),
  };
}

function register() {
  fetch(API + "/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  })
    .then((r) => r.json())
    .then((d) => {
      alert(d.message || "Đăng ký thành công");
    });
}

function login() {
  fetch(API + "/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  })
    .then((r) => r.json())
    .then((d) => {
      if (d.token) {
        localStorage.setItem("token", d.token);
        hideLogin();
        loadNotes();
      } else {
        alert("Sai tài khoản hoặc mật khẩu");
      }
    });
}

const noteInput = document.getElementById("noteInput");
const saveBtn = document.getElementById("saveNoteBtn");
const noteList = document.getElementById("noteList");

const NOTE_API = API + "/api/notes";
let notes = [];

function loadNotes() {
  fetch(NOTE_API, {
    headers: { authorization: localStorage.getItem("token") },
  })
    .then((res) => {
      if (res.status === 401) {
        loginBox.style.display = "flex";
        return [];
      }
      return res.json();
    })
    .then((data) => {
      notes = data || [];
      renderNotes();
    });
}
function renderNotes() {
  noteList.innerHTML = "";
  notes.forEach((note) => {
    const div = document.createElement("div");
    div.className = "note-item";
    div.innerHTML = `
      <div class="note-date">${note.date}</div>
      <div class="note-text">${note.text}</div>
      <button class="delete-note">❌</button>
    `;
    div.querySelector(".delete-note").onclick = () => {
      fetch(NOTE_API + "/" + note._id, {
        method: "DELETE",
        headers: { authorization: localStorage.getItem("token") },
      }).then(loadNotes);
    };
    noteList.prepend(div);
  });
}
saveBtn.onclick = () => {
  const text = noteInput.value.trim();
  if (!text) return;
  fetch(NOTE_API, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      text,
      date: new Date().toLocaleString("vi-VN"),
    }),
  }).then(() => {
    noteInput.value = "";
    loadNotes();
  });
};
if (localStorage.getItem("token")) {
  loadNotes();
} else {
  loginBox.style.display = "flex";
}
const quotes = [
  "Hôm nay cố gắng, ngày mai đỡ mệt.",
  "Bạn không cần giỏi ngay, chỉ cần không bỏ cuộc.",
  "Một chút tiến bộ mỗi ngày tạo nên kỳ tích.",
  "Không ai thành công nhờ trì hoãn.",
  "Làm xong còn hơn làm hoàn hảo.",
  "Mệt cũng được, bỏ cuộc thì không.",
  "Bạn đang đi đúng hướng, đừng dừng lại.",
  "Kỷ luật hôm nay = tự do ngày mai.",
  "Học tập là khoản đầu tư không bao giờ lỗ.",
  "Đừng so sánh, hãy tiến bộ.",
];

function getToday() {
  return new Date().toDateString();
}

function randomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function setQuote(text) {
  localStorage.setItem("motivationDate", getToday());
  localStorage.setItem("motivationQuote", text);
  const el = document.getElementById("motivationText");
  if (el) el.innerText = text;
}

function showMotivation() {
  const savedDate = localStorage.getItem("motivationDate");
  const savedQuote = localStorage.getItem("motivationQuote");

  if (savedDate === getToday() && savedQuote) {
    const el = document.getElementById("motivationText");
    if (el) el.innerText = savedQuote;
  } else {
    const newQuote = randomQuote();
    setQuote(newQuote);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  showMotivation();

  const btn = document.getElementById("changeQuoteBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      const newQuote = randomQuote();
      setQuote(newQuote);
    });
  }
});
function loadTaskSummary() {
  Promise.all([
    fetch(API + "/api/tasks?type=daily", { headers: authHeaders() }).then((r) =>
      r.json()
    ),
    fetch(API + "/api/tasks?type=study", { headers: authHeaders() }).then((r) =>
      r.json()
    ),
    fetch(API + "/api/tasks?type=work", { headers: authHeaders() }).then((r) =>
      r.json()
    ),
  ]).then(([daily, study, work]) => {
    const tasks = [...daily, ...study, ...work];

    const total = tasks.length;
    const done = tasks.filter((t) => t.done).length;
    const pending = total - done;

    document.getElementById("totalTask").innerText = total;
    document.getElementById("doneTask").innerText = done;
    document.getElementById("pendingTask").innerText = pending;

    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    document.getElementById("progress").style.width = percent + "%";
  });
}
loadNotes();
loadTaskSummary();
if (localStorage.getItem("token")) {
  loadNotes();
  loadTaskSummary();
}

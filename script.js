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

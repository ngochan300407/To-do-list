const noteInput = document.getElementById("noteInput");
const saveBtn = document.getElementById("saveNoteBtn");
const noteList = document.getElementById("noteList");

let notes = [];

// Load notes từ server
function loadNotes() {
  fetch("http://localhost:3000/api/notes")
    .then((res) => res.json())
    .then((data) => {
      notes = data;
      renderNotes();
    });
}

// Vẽ notes ra màn hình
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

    div.querySelector(".delete-note").onclick = function () {
      deleteNote(note.id);
    };

    noteList.prepend(div);
  });
}

// Thêm note
saveBtn.addEventListener("click", () => {
  const text = noteInput.value.trim();
  if (!text) return;

  const date = new Date().toLocaleString("vi-VN");

  fetch("http://localhost:3000/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, date }),
  })
    .then((res) => res.json())
    .then(() => {
      noteInput.value = "";
      loadNotes();
    });
});

// Xoá note
function deleteNote(id) {
  fetch(`http://localhost:3000/api/notes/${id}`, {
    method: "DELETE",
  }).then(() => {
    loadNotes();
  });
}

// Khi mở trang
window.onload = loadNotes;

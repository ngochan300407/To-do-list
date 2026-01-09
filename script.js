const noteInput = document.getElementById("noteInput");
const saveBtn = document.getElementById("saveNoteBtn");
const noteList = document.getElementById("noteList");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

function renderNotes() {
  noteList.innerHTML = "";

  notes.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "note-item";

    div.innerHTML = `
      <div class="note-date">${note.date}</div>
      <div class="note-text">${note.text}</div>
      <button class="delete-note">❌</button>
    `;

    div.querySelector(".delete-note").onclick = function () {
      notes.splice(index, 1);
      localStorage.setItem("notes", JSON.stringify(notes));
      renderNotes();
    };

    noteList.prepend(div);
  });
}

saveBtn.addEventListener("click", () => {
  const text = noteInput.value.trim();
  if (!text) return;

  const date = new Date().toLocaleString("vi-VN");
  notes.push({ text, date });
  localStorage.setItem("notes", JSON.stringify(notes));

  noteInput.value = "";
  renderNotes();
});

window.onload = renderNotes;

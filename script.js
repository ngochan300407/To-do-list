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
  if (text === "") return;

  const now = new Date();
  const dateString = now.toLocaleString("vi-VN");

  const newNote = {
    text: text,
    date: dateString,
  };

  notes.push(newNote);
  localStorage.setItem("notes", JSON.stringify(notes));

  noteInput.value = "";
  renderNotes();
});

renderNotes();

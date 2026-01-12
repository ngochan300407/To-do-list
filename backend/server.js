const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Fake database (lưu trong RAM)
let notes = [];

// Lấy danh sách note
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// Thêm note
app.post("/api/notes", (req, res) => {
  const { text, date } = req.body;

  const newNote = {
    id: Date.now(),
    text: text,
    date: date,
  };

  notes.push(newNote);

  // ⚠️ TRẢ VỀ NOTE VỪA TẠO
  res.json(newNote);
});

// Xoá note
app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((n) => n.id !== id);
  res.json({ ok: true });
});

// Chạy server
app.listen(3000, () => {
  console.log("Backend chạy ở http://localhost:3000");
});

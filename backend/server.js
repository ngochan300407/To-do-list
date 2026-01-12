const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let notes = [];

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const { text, date } = req.body;

  const newNote = {
    id: Date.now(),
    text: text,
    date: date,
  };

  notes.push(newNote);

  res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((n) => n.id !== id);
  res.json({ ok: true });
});

app.listen(3000, () => {
  console.log("Backend chạy ở http://localhost:3000");
});

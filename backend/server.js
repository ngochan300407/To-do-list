const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/todolist");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    password: String,
  })
);

const Note = mongoose.model(
  "Note",
  new mongoose.Schema({
    userId: String,
    text: String,
    date: String,
  })
);

const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    userId: String,
    text: String,
    done: Boolean,
    type: String,
  })
);

const TKB = mongoose.model(
  "TKB",
  new mongoose.Schema({
    userId: String,
    data: Object,
  })
);

const SECRET = "TODOLIST_SECRET";

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);

  try {
    const data = jwt.verify(token, SECRET);
    req.userId = data.id;
    next();
  } catch {
    res.sendStatus(401);
  }
}

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  if (await User.findOne({ username }))
    return res.json({ message: "User đã tồn tại" });

  const hash = await bcrypt.hash(password, 10);
  await User.create({ username, password: hash });

  res.json({ message: "Đăng ký thành công" });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.json({});

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.json({});

  const token = jwt.sign({ id: user._id }, SECRET);
  res.json({ token });
});

app.get("/api/notes", auth, async (req, res) => {
  const notes = await Note.find({ userId: req.userId });
  res.json(notes);
});

app.post("/api/notes", auth, async (req, res) => {
  const note = await Note.create({
    userId: req.userId,
    text: req.body.text,
    date: req.body.date,
  });
  res.json(note);
});

app.delete("/api/notes/:id", auth, async (req, res) => {
  await Note.deleteOne({ _id: req.params.id, userId: req.userId });
  res.json({ ok: true });
});

app.get("/api/tasks", auth, async (req, res) => {
  const { type } = req.query;
  const tasks = await Task.find({ userId: req.userId, type });
  res.json(tasks);
});

app.post("/api/tasks", auth, async (req, res) => {
  const { type } = req.query;

  await Task.deleteMany({ userId: req.userId, type });

  await Task.insertMany(
    req.body.map((t) => ({
      ...t,
      userId: req.userId,
      type,
    }))
  );

  res.json({ ok: true });
});
app.get("/api/tkb", auth, async (req, res) => {
  const t = await TKB.findOne({ userId: req.userId });
  res.json(t ? t.data : {});
});
app.post("/api/tkb", auth, async (req, res) => {
  await TKB.deleteMany({ userId: req.userId });
  await TKB.create({ userId: req.userId, data: req.body });
  res.json({ ok: true });
});
app.listen(3000, () => {
  console.log("Mongo Backend running at http://localhost:3000");
});

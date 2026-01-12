const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "todosecret";
let users = [];
let notes = {};
let tasks = {};
let tkb = {};
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  if (users.find((u) => u.username === username))
    return res.json({ message: "User đã tồn tại" });

  const hash = await bcrypt.hash(password, 10);
  users.push({ username, password: hash });
  res.json({ message: "Đăng ký thành công" });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) return res.json({ message: "Sai tài khoản" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.json({ message: "Sai mật khẩu" });

  const token = jwt.sign({ username }, SECRET);
  res.json({ token });
});
app.get("/api/notes", auth, (req, res) => {
  res.json(notes[req.user.username] || []);
});

app.post("/api/notes", auth, (req, res) => {
  if (!notes[req.user.username]) notes[req.user.username] = [];
  const n = { id: Date.now(), ...req.body };
  notes[req.user.username].push(n);
  res.json(n);
});

app.delete("/api/notes/:id", auth, (req, res) => {
  notes[req.user.username] = (notes[req.user.username] || []).filter(
    (n) => n.id != req.params.id
  );
  res.json({ ok: true });
});
app.get("/api/tasks", auth, (req, res) => {
  res.json(tasks[req.user.username] || []);
});

app.post("/api/tasks", auth, (req, res) => {
  tasks[req.user.username] = req.body;
  res.json({ ok: true });
});

app.delete("/api/tasks", auth, (req, res) => {
  tasks[req.user.username] = [];
  res.json({ ok: true });
});
app.get("/api/tkb", auth, (req, res) => {
  res.json(tkb[req.user.username] || {});
});

app.post("/api/tkb", auth, (req, res) => {
  tkb[req.user.username] = req.body;
  res.json({ ok: true });
});

app.delete("/api/tkb", auth, (req, res) => {
  tkb[req.user.username] = {};
  res.json({ ok: true });
});
app.listen(3000, () => console.log("Backend http://localhost:3000"));

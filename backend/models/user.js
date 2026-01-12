const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  notes: Array,
  tkb: Object,
  tasks: Array,
});

module.exports = mongoose.model("User", UserSchema);

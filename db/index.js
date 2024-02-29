const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://kulkarnikeyurg:2aV0rdEyfk8eH4OF@cluster0.aueqqtg.mongodb.net/"
);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  todosCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }],
});

const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
});

const User = mongoose.model("User", userSchema);
const Todo = mongoose.model("Todo", todoSchema);

module.exports = {
  User,
  Todo,
};

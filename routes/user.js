const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const jwt = require("jsonwebtoken");
const jwtPassword = "secret";
const { User, Todo } = require("../db");

//route for user signup
router.post("/signup", function (req, res) {
  const username = req.headers.username;
  const password = req.headers.password;
  try {
    User.create({
      username: username,
      password: password,
    }).then(function () {
      res.status(200).json({
        msg: "User created!!!",
      });
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
});

//route for user signin with auth
router.post("/signin", function (req, res) {
  const username = req.headers.username;
  const password = req.headers.password;
  try {
    User.findOne({
      username: username,
      password: password,
    }).then(function (user) {
      if (!user) {
        res.status(404).json({
          msg: "User not signed up!!!",
        });
      } else {
        const signedToken = jwt.sign(
          {
            username: username,
            password: password,
          },
          jwtPassword
        );
        res.status(200).json({
          msg: "User Signed In!!!",
          token: signedToken,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
});

//route to create a todo
router.post("/todo", userMiddleware, function (req, res) {
  const title = req.body.title;
  const description = req.body.description;
  const status = req.body.status;
  const username = req.username;
  try {
    Todo.create({
      title: title,
      description: description,
      status: status,
    })
      .then(function (todo) {
        return User.updateOne(
          {
            username: username,
          },
          {
            $push: {
              todosCreated: todo._id,
            },
          }
        );
      })
      .then(function () {
        res.status(200).json({
          msg: "Todo added successfully!!!",
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
});

//route to read the todos of an user
router.get("/todo", userMiddleware, function (req, res) {
  const username = req.username;
  try {
    User.findOne({
      username: username,
    })
      .then(function (user) {
        return Todo.find({
          _id: { $in: user.todosCreated },
        });
      })
      .then(function (todos) {
        res.status(200).json({
          todosList: todos,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
});
module.exports = router;

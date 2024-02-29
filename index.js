const express = require("express");
const app = express();
const userRouter = require("./routes/user");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.json());
app.use("/user", userRouter);

const PORT = 3000;
app.listen(PORT, function () {
  console.log(`server running on port ${PORT}`);
});

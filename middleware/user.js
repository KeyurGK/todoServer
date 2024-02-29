const jwt = require("jsonwebtoken");
const jwtPassword = "secret";

function userMiddleware(req, res, next) {
  const bearerToken = req.headers.token;
  const splitToken = bearerToken.split(" ");
  const jwtToken = splitToken[1];
  try {
    const verifiedToken = jwt.verify(bearerToken, jwtPassword);
    if (verifiedToken.username) {
      req.username = verifiedToken.username;

      next();
    } else {
      res.status(404).json({
        msg: "User not authenticated!!!",
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
}

module.exports = userMiddleware;
